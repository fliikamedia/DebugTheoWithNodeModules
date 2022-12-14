import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import {
  LOGIN,
  SIGNUP,
  FORGOTPASSWORD,
  MOVIES,
  EMAILSIGNUP,
} from "../constants/RouteNames";
import firebase from "firebase";
import Video from "react-native-video";
import FastImage from "react-native-fast-image";
import SVGImg from "../assets/fliika-logo.svg";
import Spinner from "react-native-spinkit";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies } from "../store/actions/movies";
import { useTranslation } from "react-i18next";
const WelcomePage = ({ navigation }) => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const dispatch = useDispatch();
  const timer = useRef();
  const movies = useSelector((state) => state.movies);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    timer.current = setTimeout(() => {
      setShowImage(true);
      setIsPreloading(false);
    }, 10000);

    return () => clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    fetchMovies()(dispatch);
  }, []);
  // Button Width Responsive
  var buttonWidth;
  if (Dimensions.get("window").width < 350) {
    buttonWidth = 230;
  } else if (Dimensions.get("window").width < 800) {
    buttonWidth = 250;
  } else {
    buttonWidth = 350;
  }

  let bannerUrl;
  try {
    bannerUrl = movies?.availableMovies?.find(
      (movie) => movie.active_banner === "YES"
    )?.dvd_thumbnail_link;
  } catch (err) {
    bannerUrl =
      "https://fliikaimages.azureedge.net/movies/Batman-2022/Batman_2022.webp";
  }
  const createBtn = {
    backgroundColor: "#f3f8ff",
    padding: 15,
    borderRadius: Dimensions.get("window").width < 800 ? 30 : 34,
    justifyContent: "center",
    width: buttonWidth,
    marginBottom: 20,
  };
  const loginBtn = {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: Dimensions.get("window").width < 800 ? 30 : 34,
    justifyContent: "center",
    width: buttonWidth,
    borderWidth: 1,
    borderColor: "#f3f8ff",
  };
  //////////////////////////
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setIsPaused(false);
    });
    return () => unsubscribe();
  }, [navigation]);

  const video = React.useRef(null);

  // if (showImage) {
  //   return (
  //     <View style={{ flex: 1 }}>
  //       <FastImage
  //         src="https://fliikaimages.azureedge.net/movies/Batman-2022/Batman_2022.webp"
  //         style={styles.poster}
  //       />
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      {isPreloading && (
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner
            isVisible={isPreloading}
            size={70}
            type={"ThreeBounce"}
            color={"#fff"}
          />
        </View>
      )}
      {showImage ? (
        <View style={styles.posterContainer}>
          <View style={styles.opa}></View>
          <FastImage
            source={{
              uri: bannerUrl,
            }}
            style={styles.poster}
          />
        </View>
      ) : (
        <Video
          paused={isPaused}
          onReadyForDisplay={() => {
            clearTimeout(timer.current);
            setIsPreloading(false);
          }}
          ref={video}
          style={styles.video}
          source={{
            uri: "https://fliikaimages.azureedge.net/hero-container/Zeenamore-hero-full.mp4",
          }}
          repeat={true}
          muted={true}
          shouldPlay
          resizeMode="cover"
          rate={1.0}
        />
      )}
      {isPreloading ? null : (
        <View style={styles.Wrapper}>
          {/* <FastImage
            source={require("../assets/fliika-logo.png")}
            style={styles.logo}
          /> */}
          <SVGImg width={130} height={40} style={styles.logo} />
          <View>
            <Text style={styles.textDescriptionLg}>
              {t("welcomePage:welcomeTitle")}
            </Text>
            <Text style={styles.textDescriptionSm}>
              {t("welcomePage:welcomeDescription")}
            </Text>
          </View>
          <View style={styles.btnsContainer}>
            <Text style={styles.textDescriptionSb}>
              {t("welcomePage:joinUs")}
            </Text>
            <TouchableOpacity
              style={createBtn}
              onPress={() => {
                setIsPaused(true), navigation.navigate(EMAILSIGNUP);
              }}
            >
              <Text style={styles.createText}>
                {t("welcomePage:createBtn")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPaused(true), navigation.navigate(LOGIN);
              }}
              style={loginBtn}
            >
              <Text style={styles.loginText}>{t("welcomePage:loginBtn")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/*<StatusBar style="light" />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: Platform.OS === "android" ? 0.5 : 1,
  },
  Wrapper: {
    height: "95%",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    flexDirection: "column",
    zIndex: 5,
  },
  logo: {
    marginTop: 30,
  },
  textDescriptionLg: {
    color: "#f3f8ff",
    fontSize: Dimensions.get("window").width < 350 ? 18 : 22,
    textAlign: "center",
    fontFamily: "Sora-Bold",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 10,
  },
  textDescriptionSm: {
    letterSpacing: 3,
    fontFamily: "Sora-Regular",
    color: "#f4f4f4",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 10,
    fontSize: Dimensions.get("window").width < 350 ? 6 : 12,
  },
  textDescriptionSb: {
    letterSpacing: 3,
    fontFamily: "Sora-Regular",
    color: "#f4f4f4",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 20,
    fontSize: Dimensions.get("window").width < 350 ? 10 : 14,
  },
  createText: {
    textTransform: "uppercase",
    fontFamily: "Sora-Bold",
    textAlign: "center",
    letterSpacing: 3,
    color: "#666",
    fontSize: Dimensions.get("window").width < 350 ? 10 : 14,
  },
  loginText: {
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Sora-Bold",
    letterSpacing: 3,
    color: "#f3f8ff",
    fontSize: Dimensions.get("window").width < 350 ? 12 : 16,
  },
  posterContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
  poster: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  opa: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 2,
  },
  btnsContainer: {
    alignItems: "center",
  },
});

export default WelcomePage;
