import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Image,
} from "react-native";
import UserProfile from "../components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { addProfile } from "../../store/actions/user";
import { WELCOMESCREEN } from "../../constants/RouteNames";
import firebase from "firebase";
import profileImgs from "../../constants/profileImgs";
import { COLORS, SIZES, icons } from "../../constants";
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [imageName, setImageName] = useState("");
  let profilesLength;
  try {
    profilesLength = user.user.profiles.length;
  } catch (err) {}
  const logOut = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate(WELCOMESCREEN);
    } catch (err) {
      Alert.alert(
        "There is something wrong! Please try again later",
        err.message
      );
    }
  };
  const creatingProfile = () => {
    if (name) {
      setName("");
      setImageName("");
      addProfile(user.email, name, imageName)(dispatch);
      setCreating(false);
    } else {
      Alert.alert("", "Please Select a profile name first", [
        { text: "Ok", cancelable: true },
      ]);
    }
  };
  const createProfile = () => {
    if (creating) {
      return (
        <View>
          <UserProfile
            image={imageName}
            editing={editing}
            setEditing={setEditing}
            main={false}
            name=""
          />
          <TextInput
            placeholder="Name"
            placeholderTextColor="white"
            style={styles.input}
            onChangeText={(newValue) => setName(newValue)}
            value={name}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 20,
              marginHorizontal: 20,
            }}
          >
            <Text style={{ color: "white" }}>Choose an image</Text>
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
            horizontal
            data={profileImgs}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => setImageName(item.name)}>
                <Image
                  source={item.path}
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
              <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => {
                setImageName("");
                setCreating(false);
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (editing) {
      return (
        <View>
          <UserProfile
            navigation={navigation}
            main={true}
            name={user.user.firstName}
            image={user.user.profileImage}
            editing={editing}
            setEditing={setEditing}
          />
          {user.user.profiles.map((item) => {
            return (
              <UserProfile
                navigation={navigation}
                editing={editing}
                setEditing={setEditing}
                main={false}
                key={item.name}
                name={item.name}
                image={item.image}
              />
            );
          })}
          <View>
            <TouchableOpacity
              onPress={() => setEditing(false)}
              style={{
                alignSelf: "center",
                width: 100,
                height: 50,
                borderWidth: 2,
                borderColor: "teal",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ color: "white" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View>
            <Text
              style={{
                fontSize: 24,
                color: "teal",
                textAlign: "center",
                marginBottom: 30,
                marginTop: 20,
              }}
            >
              Who's Watching ?
            </Text>
            <UserProfile
              editing={editing}
              setEditing={setEditing}
              main={true}
              name={user.user.firstName}
              image={user.user.profileImage}
            />
            {user.user.profiles.map((item) => {
              return (
                <UserProfile
                  editing={editing}
                  setEditing={setEditing}
                  main={false}
                  key={item.name}
                  name={item.name}
                  image={item.image}
                />
              );
            })}
            {profilesLength < 2 ? (
              <TouchableOpacity
                onPress={() => setCreating(true)}
                style={{ alignSelf: "center" }}
              >
                <IconAnt name="pluscircleo" size={60} color="grey" />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={{
              height: 50,
              width: 160,
              borderWidth: 2,
              borderColor: "white",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              alignSelf: "center",
              marginTop: 30,
              backgroundColor: "teal",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Manage Profiles
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "95%",
            justifyContent: "space-between",
            alignSelf: "center",
            marginTop: 40,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconFeather name="arrow-left" size={40} color="teal" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logOut()}>
            <Icon name="logout" size={40} color="white" />
          </TouchableOpacity>
        </View>
        {
          <View style={{ flex: 1, justifyContent: "center" }}>
            {createProfile()}
          </View>
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  input: {
    backgroundColor: "grey",
    width: "90%",
    height: 60,
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
    color: "white",
  },
  btnContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  save: {
    height: 60,
    width: 120,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  cancel: {
    height: 60,
    width: 120,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
export default ProfileScreen;