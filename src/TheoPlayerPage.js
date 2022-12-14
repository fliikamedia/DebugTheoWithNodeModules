import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StatusBar,
  AppState,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import Orientation from "react-native-orientation-locker";
import {
  addToWatchList,
  removeFromWatchList,
  addtoWatchedProfile,
  updateWatchedProfile,
  addToProfileWatchList,
  removeFromProfileWatchList,
  updateMovieTime,
} from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import KeepAwake from "@sayem314/react-native-keep-awake";
import moment from "moment";
import { PlayerConfiguration, THEOplayerView } from "react-native-theoplayer";
import Icon from "react-native-vector-icons/AntDesign";
import { SIZES } from "../constants";
import ReactNativeTheoUI from "./theoplayer/ReactNativeTheoUI";
import {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
} from "react-native-orientation-locker";
import FastImage from "react-native-fast-image";
const TheoPlayerPage = ({ navigation, route }) => {
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const { movieId, time } = route.params;
  // const [watched, setWatched] = useState(0);
  // const [duration, setDuration] = useState(0);

  const appState = useRef(AppState.currentState);
  const playerRef = useRef(null);
  const movie = movies.availableMovies.find((r) => r._id === movieId);
  let watchedTime;
  let movieDuration;
  try {
    watchedTime = user?.currentProfile?.watched?.find(
      (data) => data.movieId === movieId
    )?.watchedAt;
    movieDuration = user?.currentProfile?.watched?.find(
      (data) => data.movieId === movieId
    )?.duration;
  } catch (err) {
    // console.log("errrrrrrrs", err);
    watchedTime = 0;
  }
  // const videoUrl = Platform.select({
  //   ios: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  //   android: "https://bitdash-a.akamaihd.net/content/sintel/sintel.mpd",
  //   default: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  // });
  const allMovies = [...movies?.availableMovies];
  const shuffled = allMovies?.sort(() => 0.5 - Math.random());
  // console.log("shuffled", shuffled);
  useEffect(() => {
    FastImage.preload([
      {
        uri: shuffled[0]?.wide_thumbnail_link,
        // headers: { Authorization: 'someAuthToken' },
      },
      {
        uri: shuffled[1]?.wide_thumbnail_link,
        // headers: { Authorization: 'someAuthToken' },
      },
      {
        uri: shuffled[2]?.wide_thumbnail_link,
        // headers: { Authorization: 'someAuthToken' },
      },
      {
        uri: shuffled[3]?.wide_thumbnail_link,
        // headers: { Authorization: 'someAuthToken' },
      },
    ]);
  }, shuffled);
  let nextEpisode;
  try {
    nextEpisode = movies?.availableMovies?.find(
      (item) =>
        item.title === movie.title &&
        item.episode_number === movie.episode_number + 1
    );
  } catch {
    nextEpisode = null;
  }
  const setWatchedMovie = async () => {
    if (movie.film_type == "movie") {
      AsyncStorage.setItem("isSeries", "movie");
      if (isWatched(user.currentProfile.watched, movie.title)) {
        AsyncStorage.setItem("isWatchedBefore", "true");
      } else {
        AsyncStorage.setItem("isWatchedBefore", "false");
      }
    } else {
      //console.log('seeeeries');
      AsyncStorage.setItem("isSeries", "series");
      if (
        isWatchedSeries(
          user.currentProfile.watched,
          movie.title,
          movie.season_number,
          movie.episode_number
        )
      ) {
        AsyncStorage.setItem("isWatchedBefore", "true");
      } else {
        AsyncStorage.setItem("isWatchedBefore", "false");
      }
    }
  };
  useEffect(() => {
    // Platform.OS == "android"
    //   ? Orientation.lockToLandscapeLeft()
    //   : Orientation.lockToLandscapeRight();
    setWatchedMovie();
  }, [movie?._id]);
  const stopPlaying = async () => {
    // const didPlay = await AsyncStorage.getItem("didPlay");
    // //Orientation.lockToPortrait();
    // if (didPlay == "true") {
    //   saveMovie();
    // }
    // if (Platform.OS === "ios") {
    //   //ReactNativeBitmovinPlayerIntance.pause();
    //   console.log("ios");
    // } else if (Platform.OS == "android" && didPlay == "true") {
    //   //ReactNativeBitmovinPlayerIntance.destroy();
    //   AsyncStorage.setItem("didPlay", "false");
    //   console.log("android");
    // }
    // AsyncStorage.setItem("movieName", "");
    // AsyncStorage.setItem("isWatchedBefore", "null");

    if (!playerRef) return;
    playerRef?.current?.pause();
  };

  const stoppedPlaying = () => {
    //navigation.goBack();
  };
  const isWatched = (movieArray, movieName) => {
    try {
      var movieWatched = false;
      for (var i = 0; i < movieArray.length; i++) {
        if (movieArray[i].title == movieName) {
          movieWatched = true;
          break;
        }
      }
      return movieWatched;
    } catch (err) {}
  };

  const isWatchedSeries = (
    seriesArray,
    seriesName,
    seriesSeason,
    seriesEpisode
  ) => {
    try {
      var seriesWatched = false;
      for (var i = 0; i < seriesArray.length; i++) {
        if (
          seriesArray[i].title == seriesName &&
          seriesArray[i].season == seriesSeason &&
          seriesArray[i].episode == seriesEpisode
        ) {
          seriesWatched = true;
          break;
        }
      }
      return seriesWatched;
    } catch (err) {}
  };
  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", stopPlaying);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [appState]);

  //console.log('state out',user.watchedAt, user.duration);

  /*   useEffect(() => {
    if (watched > 0 ) {
    updateMovieTime(watched, duration)(dispatch)
      console.log('updating time locally');
    }
    saveMovie()
  }, [watched]); */

  const saveMovie = async () => {
    const whatTime = await AsyncStorage.getItem("watched");
    const whatDuration = await AsyncStorage.getItem("duration");

    //console.log('update watched', whatTime, whatDuration);
    if (whatTime > 0) {
      if (isWatched(user.currentProfile.watched, movie.title) == false) {
        //console.log('here 1');
        addtoWatchedProfile(
          moment(),
          moment(),
          user.user._id,
          movie.title,
          movie._id,
          Number(whatDuration),
          Number(whatTime),
          user.currentProfile._id
        )(dispatch);
      } else if (isWatched(user.currentProfile.watched, movie.title) == true) {
        //console.log('here 2');
        updateWatchedProfile(
          moment(),
          user.user._id,
          movie.title,
          Number(whatDuration),
          Number(whatTime),
          user.currentProfile._id
        )(dispatch);
      }
    }
  };

  //console.log(movie);
  const saveTiming = (x, y) => {
    AsyncStorage.setItem("duration", x);
    AsyncStorage.setItem("watched", y);
  };

  // let str = movie.play_url;
  // let playURL;
  // if (Platform.OS === "android") {
  //   if (str.includes("m3u8-cmaf")) {
  //     playURL = str.replace("m3u8-cmaf", "mpd-time-cmaf");
  //   } else if (str.includes("m3u8-aapl")) {
  //     playURL = str.replace("m3u8-aapl", "mpd-time-cmaf");
  //   }
  // } else {
  //   playURL = str;
  // }
  const saveMovieDetails = async () => {
    await AsyncStorage.setItem("didPlay", "true"),
      await AsyncStorage.setItem("movieName", movie.title),
      await AsyncStorage.setItem("seasonNumber", String(movie.season_number)),
      await AsyncStorage.setItem("episodeNumber", String(movie.episode_number)),
      await AsyncStorage.setItem("movieId", String(movie._id)),
      await AsyncStorage.setItem("userId", String(user.user._id)),
      await AsyncStorage.setItem("profileId", String(user.currentProfile._id));
  };
  useEffect(() => {
    saveMovieDetails();
  }, [movie]);
  // Theo Player

  const license = Platform.select({
    android:
      "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert Android THEOplayer license here
    ios: "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert iOS THEOplayer license here
    web: "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert Web THEOplayer license here
  });

  const playerConfig = {
    license,
    chromeless: Platform.OS === "ios" ? true : true,
  };
  const theoSubtitles = movie?.subtitles_tracks?.map((subtitle, index) => ({
    // default: true,
    kind: "subtitles",
    label: subtitle.label,
    src: subtitle.url,
    srclang: "En",
  }));
  // const source = {
  //   sources: [
  //     {
  //       src: playURL,
  //       type:
  //         Platform.OS === "android"
  //           ? "application/dash+xml"
  //           : "application/x-mpegurl",
  //     },
  //   ],
  //   textTracks: theoSubtitles,
  const fairPlayEncryptionHLS = "(format=m3u8-aapl,encryption=cbcs-aapl).m3u8";
  const noEncryptionHLS = "(format=m3u8-aapl).m3u8";
  const widevineEncryptionDASH = "(format=mpd-time-cmaf,encryption=cenc).mpd";
  const noEncryptionDASH = "(format=mpd-time-cmaf).mpd";
  const playReadyEncryptionSMOOTH = "(encryption=cenc)";
  const noEncryptionSMOOTH = "";

  let str = movie.play_url;
  let playURL;
  if (Platform.OS === "android") {
    if (str.includes(fairPlayEncryptionHLS)) {
      str.replace(fairPlayEncryptionHLS, widevineEncryptionDASH);
    } else if (str.includes("encryption=cenc")) {
      if (str.includes("csf")) {
        playURL = `${str.replace("csf", "cmaf")}.mpd`;
      } else {
        playURL = `${str}.mpd`;
      }
    } else if (str.includes("m3u8-cmaf")) {
      playURL = str.replace("m3u8-cmaf", "mpd-time-cmaf");
    } else if (str.includes("m3u8-aapl")) {
      playURL = str.replace("m3u8-aapl", "mpd-time-cmaf");
    } else {
      playURL = str;
    }
  } else if (Platform.OS === "ios") {
    if (str.includes(widevineEncryptionDASH)) {
      str.replace(widevineEncryptionDASH, fairPlayEncryptionHLS);
    } else if (str.includes("(format=mpd-time-csf,encryption=cenc)")) {
      playURL = str.replace(
        "(format=mpd-time-csf,encryption=cenc)",
        fairPlayEncryptionHLS
      );
    } else if (str.includes("encryption=cbcs-aapl")) {
      playURL = `${str}.m3u8`;
    } else if (str.includes("mpd-time-csf")) {
      playURL = str.replace("mpd-time-csf", "m3u8-aapl");
    } else if (str.includes("mpd-time-cmaf")) {
      playURL = str.replace("mpd-time-cmaf", "m3u8-aapl");
    } else {
      playURL = str;
    }
  }
  // let newDash =
  //   "https://fliikamediaservice-usea.streaming.media.azure.net/1f78762a-f6ff-4fcb-b575-3f1c6c7a67ba/BatmanDarkKnight.ism/manifest(format=mpd-time-cmaf,encryption=cenc)";
  // let postsDash =
  //   "https://fliikamediaservice-usea.streaming.media.azure.net/1f78762a-f6ff-4fcb-b575-3f1c6c7a67ba/BatmanDarkKnight.ism/manifest(format=mpd-time-cmaf,encryption=cenc).mpd";
  // const dash =
  //   "https://fliikamediaservice-usea.streaming.media.azure.net/8a569f21-6e46-4964-a09f-f716be5066dd/BatmanDarkKnight.ism/manifest(format=mpd-time-cmaf,encryption=cenc).mpd";
  // const hls =
  //   "https://fliikamediaservice-usea.streaming.media.azure.net/8a569f21-6e46-4964-a09f-f716be5066dd/BatmanDarkKnight.ism/manifest(format=m3u8-aapl,encryption=cbcs-aapl).m3u8";
  // console.log("uuuurs", playURL, dash);
  const source = {
    sources: [
      {
        src: playURL,
        type:
          Platform.OS === "android"
            ? "application/dash+xml"
            : "application/x-mpegurl",
        contentProtection: {
          widevine: {
            licenseAcquisitionURL:
              "https://fliikamediaservice.keydelivery.eastus.media.azure.net/Widevine/?kid=f5eddbea-f922-46dc-be21-0272c1209e82",
          },
          fairplay: {
            licenseAcquisitionURL:
              "https://fliikamediaservice.keydelivery.eastus.media.azure.net/FairPlay/?kid=88937495-9b26-40ba-90e0-713666d5d1c0",
            certificateURL:
              "https://fliikamediaservice-usea.streaming.media.azure.net/85e29d77-aa15-4311-9ec7-ac6e32399d06/fairplay.cer",
          },
          // FairPlay: {
          //   certificateURL:
          //     "skd://fliikamediaservice.keydelivery.eastus.media.azure.net/FairPlay/?kid=e3829c72-787d-41e3-81de-e1645b74a83e",
          // },
        },
      },
    ],
    textTracks: theoSubtitles,

    // textTracks: [
    //   {
    //     kind: "subtitles",
    //     label: "english",
    //     src: "https://fliikamediaservice-usea.streaming.media.azure.net/4ecba15f-ee02-48df-8c55-9ba7bd2f138e/mcjw-subs.vtt",
    //     srclang: "En",
    //   },
    // ],
  };
  // };
  // const source = {
  //   sources: [
  //     {
  //       src: "https://contentserver.prudentgiraffe.com/videos/dash/webvtt-embedded-in-isobmff/Manifest.mpd",
  //       type: "application/dash+xml",
  //     },
  //   ],
  //   textTracks: theoSubtitles,
  // };

  // const onLoadedMetadata = (data) => {
  //   console.log("loadedmetadata", JSON.stringify(data));
  // };
  // End of theo player

  return (
    <View style={{ flex: 1 }}>
      <OrientationLocker orientation={LANDSCAPE} />
      <ReactNativeTheoUI
        source={source}
        config={playerConfig}
        watchedTime={watchedTime}
        movieDuration={movieDuration}
        nextEpisode={nextEpisode}
        title={movie.episode_title ? movie.episode_title : movie?.title}
        content_advisory={movie?.content_advisory}
        film_rating={movie?.film_rating}
        recommendOne={shuffled[0]}
        recommendTwo={shuffled[1]}
        recommendThree={shuffled[2]}
        recommendFour={shuffled[3]}
      />
    </View>
  );

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
    >
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrowleft" color="#fff" size={30} />
      </TouchableOpacity>
      <THEOplayerView
        config={playerConfig}
        source={source}
        paused={false}
        // playbackRate
        // volume
        muted={false}
        fullscreen={true}
        // selectedTextTrack={{
        //   label: "English [CC]",
        //   language: "en-US",
        //   href: "https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt",
        // }}
        // selectedVideoTrack
        // selectedAudioTrack
        // style
        // onFullscreenPlayerWillPresent
        // onFullscreenPlayerDidPresent
        // onFullscreenPlayerWillDismiss
        // onFullscreenPlayerDidDismiss
        // onBufferingStateChange
        // onSourceChange
        // onLoadStart
        // onLoadedMetadata={onLoadedMetadata}
        // onLoadedData
        // onReadyStateChange
        // onError
        // onProgress
        // onPlay
        // onPlaying
        // onPause
        // onSeeking
        // onSeeked
        // onEnded
        // onTimeUpdate={(e) => {
        //   console.log(e);
        // }}
        // onDurationChange
        // onSegmentNotFound
        // onTextTrackListEvent={(e) => {
        //   console.log("text tracks", e);
        // }}
        // onTextTrackEvent
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  backArrow: {
    zIndex: 40,
    top: 30,
    left: 30,
  },
});
export default TheoPlayerPage;
