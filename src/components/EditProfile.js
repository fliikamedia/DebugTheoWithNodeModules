import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import UserProfile from "./UserProfile";
import { icons } from "../../constants";
import profileImgs from "../../constants/profileImgs";
import { updateUserImage, updateProfile } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { useTranslation } from "react-i18next";

const EditProfile = ({ navigation, route }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { main, profileName, imageTitle, profileId } = route.params;
  const [name, setName] = useState(profileName);
  const [imageName, setImageName] = useState(imageTitle);
  const { t } = useTranslation();
  //console.log(main);
  const creatingProfile = () => {
    //  let profileId = user?.user?.profiles[0]?._id;
    /*   if (main) {
      updateUserImage(user.user._id, imageName, profileId)(dispatch);
      navigation.goBack();
      return;
    } */

    if (name) {
      updateProfile(user.user._id, profileId, name, imageName)(dispatch);
      navigation.goBack();
      return;
    }
    if (!name) {
      Alert.alert("", "Please Select a profile name first", [
        { text: "Ok", cancelable: true },
      ]);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        // marginVertical: 150,
        justifyContent: "center",
      }}
    >
      <View>
        <UserProfile image={imageName} editing={false} main={false} name="" />
        {!main ? (
          <TextInput
            placeholder={t("common:name")}
            placeholderTextColor="white"
            style={styles.input}
            onChangeText={(newValue) => setName(newValue)}
            value={name}
          />
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 40,
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{ color: "white", fontFamily: "Sora-Regular", fontSize: 16 }}
          >
            {t("common:selectImg")}
          </Text>
          <Image
            source={icons.right_arrow}
            style={{
              height: 20,
              width: 20,
              tintColor: "teal",
            }}
          />
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={profileImgs}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setImageName(item)}>
              <FastImage
                source={{ uri: item }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 120,
                  marginLeft: 20,
                }}
              />
            </TouchableOpacity>
          )}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.save}
            onPress={() => creatingProfile()}
          >
            <Text style={{ color: "white", fontSize: 18 }}>
              {t("common:save")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>
              {t("common:cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    width: "90%",
    height: 60,
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  btnContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  save: {
    height: 60,
    width: 130,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  cancel: {
    height: 60,
    width: 130,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default EditProfile;
