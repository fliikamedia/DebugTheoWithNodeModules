import React, { useState, useEffect, Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Awesome from "react-native-vector-icons/FontAwesome";
import firebase from "firebase";
import {
  cancelSubscription,
  getSubscriptions,
  getStripePrices,
  CANCEL_MY_SUBSCRIPTION,
  CANCEL_MY_SUBSCRIPTION_SUCCESS,
  CANCEL_MY_SUBSCRIPTION_FAILED,
} from "../store/actions/subscriptions";
import expressApi from "./api/expressApi";
import ModalComponent from "./components/ModalComponent";
import SubscriptionCard from "./components/SubscriptionCard";
import LinearGradient from "react-native-linear-gradient";
import Spinner from "react-native-spinkit";
import { useTranslation } from "react-i18next";

const ManageSubscriptions = () => {
  const dispatch = useDispatch();
  const subscriptions_state = useSelector((state) => state.subscriptions);
  const { t } = useTranslation();
  const user_state = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  console.log(
    subscriptions_state?.mySubscriptions?.subscriptions?.data[0]?.status
  );
  const fetchSubsctiption = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          getSubscriptions(
            user_state.user.stripe_customer_id,
            idToken
          )(dispatch);
        });
      }
    });
  };
  useEffect(() => {
    getStripePrices()(dispatch);
  }, []);
  useEffect(() => {
    fetchSubsctiption();
  }, [user_state.user.stripe_customer_id]);
  const dynamicDescription = (plan) => {
    if (plan === "Fliika Yearly") {
      return "Annual Plan";
    } else if (plan === "Fliika Monthly") {
      return "Monthly Plan";
    }
  };
  //   console.log(id);
  const dynamicSlash = (plan) => {
    if (plan === "Fliika Yearly") {
      return "/year";
    } else if (plan === "Fliika Monthly") {
      return "/month";
    }
  };
  const parseCurr = (value) => "$" + (value / 100).toFixed(2);

  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t.toDateString();
  }

  const cancelSubscription = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(async function (idToken) {
          // cancelSubscription(
          //   subscriptions_state.mySubscriptions.subscriptions.data[0]
          //     .id,
          //   idToken
          // )();
          // console.log(
          //   idToken,
          //   subscriptions_state.mySubscriptions.subscriptions.data[0].id
          // );
          try {
            dispatch({ type: CANCEL_MY_SUBSCRIPTION });
            const result = await expressApi.post(
              "/mobile-subs/cancel-subscriptions",
              {
                subscriptionId:
                  subscriptions_state.mySubscriptions.subscriptions.data[0].id,
              },
              {
                headers: {
                  authtoken: idToken,
                },
              }
            );
            // console.log(result?.data?.subscription?.status);
            if (result.status === 200) {
              if (result?.data?.subscription?.status === "canceled") {
                dispatch({ type: CANCEL_MY_SUBSCRIPTION_SUCCESS });
                setShowModal(true);
              }
            }
          } catch (err) {
            console.log(err);
            dispatch({ type: CANCEL_MY_SUBSCRIPTION_FAILED });
          }
        });
      }
    });
  };
  let cardDetails;
  let plan;
  let periodEnd;
  try {
    cardDetails =
      subscriptions_state?.mySubscriptions?.subscriptions?.data[0]
        ?.default_payment_method?.card;
    plan = subscriptions_state?.mySubscriptions?.subscriptions?.data[0]?.plan;
    periodEnd =
      subscriptions_state?.mySubscriptions?.subscriptions?.data[0]
        ?.current_period_end;
  } catch (err) {
    console.log(err);
    cardDetails = {};
    plan = {};
    periodEnd = null;
  }

  const renderSubscriptions = () => {
    return (
      <View style={{ marginTop: 30 }}>
        <Text style={styles.header}>
          {t("manageSubscriptions:currentPlan")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "95%",
            paddingLeft: 10,
          }}
        >
          <Text style={styles.descriptionTxt}>{plan?.nickname}</Text>
          <Text style={styles.priceText}>
            {parseCurr(plan?.amount)}
            {dynamicSlash(plan?.nickname)}
          </Text>
        </View>
        <Text
          style={{
            color: "#fff",
            fontFamily: "Sora-Regular",
            fontSize: 16,
            marginLeft: 10,
          }}
        >{`${t("manageSubscriptions:yourPlan")} ${
          subscriptions_state?.mySubscriptions?.subscriptions?.data[0]
            ?.status === "active"
            ? `${t("manageSubscriptions:renews")}`
            : `${t("manageSubscriptions:ends")}`
        } ${t("manageSubscriptions:on")} ${toDateTime(periodEnd)}`}</Text>
        {/* Buttons */}
        <View>
          {subscriptions_state?.mySubscriptions?.subscriptions?.data[0]
            ?.status === "active" ? (
            <TouchableOpacity
              style={styles.cancelBTN}
              onPress={() => cancelSubscription()}
            >
              <Text style={styles.cancelBtnTxt}>
                {t("manageSubscriptions:cancelSubscription")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelBTN}
              // onPress={() => cancelSubscription()}
            >
              <Text style={styles.cancelBtnTxt}>
                {t("manageSubscriptions:subscriptionCanceled")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {subscriptions_state?.mySubscriptions?.subscriptions?.data[0]
          ?.status === "active" && (
          <View>
            <View style={styles.separator}></View>

            <Text style={styles.header}>
              {t("manageSubscriptions:paymentMethod")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                //   justifyContent: "space-evenly",
                paddingLeft: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Awesome name="cc-visa" size={30} color="#fff" />
                <Text
                  style={{ color: "#fff", marginLeft: 10 }}
                >{`*****${cardDetails?.last4}`}</Text>
              </View>
              <View>
                <Text style={{ color: "#fff", marginLeft: 30 }}>{`${t(
                  "manageSubscriptions:expires"
                )} ${cardDetails?.exp_month}/${cardDetails?.exp_year}`}</Text>
              </View>
            </View>
          </View>
        )}
        <ModalComponent
          type="cancel-subscription"
          isVisible={showModal}
          text="Subscription Canceled successfully!"
          setShowModal={setShowModal}
          fetchSubsctiption={fetchSubsctiption}
        />
      </View>
    );
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {subscriptions_state?.isFetching ? (
        <View style={styles.spinnerContainer}>
          <Spinner
            isVisible={subscriptions_state?.isFetching}
            size={70}
            type={"ThreeBounce"}
            color={"#fff"}
          />
        </View>
      ) : (
        renderSubscriptions()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Sora-Bold",
    fontSize: 20,
    color: "#A9A9A9",
    marginBottom: 20,
  },
  separator: {
    width: "95%",
    height: 1,
    backgroundColor: "#505050",
    alignSelf: "center",
    marginVertical: 30,
  },
  planText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 20,
    // textAlign: "center",
  },
  priceText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 20,
    // textAlign: "center",
    marginBottom: 7,
  },
  trialTxt: {
    color: "#89CFF0",
    fontFamily: "Sora-Regular",
    fontSize: 16,
    // textAlign: "center",
  },
  descriptionTxt: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 18,
    // textAlign: "center",
    // width: "80%",
  },
  cancelBTN: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  cancelBtnTxt: {
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: "red",
  },
  spinnerContainer: {
    // width: "100%",
    flex: 1,
    alignItems: "center",
    // backgroundColor: "red",
    justifyContent: "center",
  },
});
export default ManageSubscriptions;
