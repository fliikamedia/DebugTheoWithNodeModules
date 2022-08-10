import React, { useState, useEffect, useRef } from "react";
import {
  filterRenderableTracks,
  filterThumbnailTracks,
  MediaTrack,
  TextTrack,
} from "react-native-theoplayer";

import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SeekBar } from "../seekbar/SeekBar";
import styles from "./VideoPlayerUI.style";
import { DelayedActivityIndicator } from "../delayedactivityindicator/DelayedActivityIndicator";
import {
  FullScreenIcon,
  FullScreenExitIcon,
  SubtitlesIcon,
  AudioIcon,
  PlayButton,
  MutedIcon,
  UnMutedIcon,
  ListIcon,
  backAarrow,
  backwards,
  forwards,
  pause,
} from "../../res/images";
import { MenuButton } from "../menubutton/MenuButton";
import { MenuItem } from "../modalmenu/MenuItem";
import { getISO639LanguageByCode } from "../../utils/language/Language";
import { ActionButton } from "../actionbutton/ActionButton";
import { TimeLabel } from "../timelabel/TimeLabel";
// import type { VideoPlayerUIProps } from './VideoPlayerUIProps';
import { THUMBNAIL_MODE, THUMBNAIL_SIZE } from "./VideoPlayerUIProps";
import { ThumbnailView } from "../thumbnail/ThumbnailView";
// import type { SeekBarPosition } from '../seekbar/SeekBarPosition';
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
const VideoPlayerUI = ({
  style,
  sources,
  srcIndex,
  error,
  paused,
  muted,
  fullscreen,
  showLoadingIndicator,
  duration,
  seekable,
  currentTime,
  textTracks,
  selectedTextTrack,
  audioTracks,
  selectedAudioTrack,
  onSetPlayPause,
  onSetFullScreen,
  onSetMuted,
  onSelectTextTrack,
  onSelectAudioTrack,
  onSelectSource,
  onSeeks,
}) => {
  const [screenClicked, setScreenClicked] = useState(false);
  const [seekingButton, setSeekingButton] = useState(false);
  const timer = useRef();
  const navigation = useNavigation();
  const onSeek = (time) => {
    if (onSeeks) {
      onSeeks(time);
    }
  };
  // console.log("selectedTextTrack", selectedTextTrack);
  // console.log(currentTime);
  // var myVar;

  // function myFunction() {
  //   myVar = setTimeout(() => {
  //     setScreenClicked(false);
  //   }, 2000);
  // }

  // useEffect(() => {
  //   onSetFullScreen(true);
  // }, []);
  function myStopFunction() {
    console.log(timer.current);
    clearTimeout(timer.current);
  }
  useEffect(() => {
    // if (!screenClicked || paused) return;
    timer.current = setTimeout(() => {
      setScreenClicked(false);
    }, 2000);

    return () => clearTimeout(timer.current);
  }, [screenClicked]);
  const toggleScreenTouched = () => {
    setScreenClicked(!screenClicked);
  };
  const togglePlayPause = () => {
    if (onSetPlayPause) {
      onSetPlayPause(!paused);
      if (!paused) {
        myStopFunction();
      } else {
        setScreenClicked(false);
      }
    }
  };

  const toggleFullScreen = () => {
    if (onSetFullScreen) {
      onSetFullScreen(!fullscreen);
    }
  };

  const toggleMuted = () => {
    if (onSetMuted) {
      onSetMuted(!muted);
    }
  };

  const selectTextTrack = (index) => {
    if (onSelectTextTrack) {
      const uid =
        textTracks && index >= 0 && index < textTracks.length
          ? textTracks[index].uid
          : undefined;
      onSelectTextTrack(uid);
    }
  };

  const selectAudioTrack = (index) => {
    if (onSelectAudioTrack) {
      if (audioTracks && index >= 0 && index < audioTracks.length) {
        onSelectAudioTrack(audioTracks[index].uid);
      }
    }
  };

  const selectSource = (index) => {
    if (onSelectSource) {
      onSelectSource(index);
    }
  };

  const getTrackLabel = (track) => {
    if (track.label) {
      return track.label;
    }
    const languageCode = track.language;
    if (languageCode) {
      const iso639Language = getISO639LanguageByCode(languageCode);
      if (iso639Language) {
        return iso639Language.local;
      }
    }
    return languageCode || "";
  };

  const renderThumbnailCarousel = (seekBarPosition) => {
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <ThumbnailView
        visible={seekBarPosition.isScrubbing}
        containerStyle={styles.thumbnailContainerCarousel}
        thumbnailStyleCurrent={styles.thumbnailCurrentCarousel}
        thumbnailStyleCarousel={styles.thumbnailCarousel}
        thumbnailTrack={thumbnailTrack}
        time={seekBarPosition}
        duration={seekBarPosition.duration}
        size={THUMBNAIL_SIZE}
        carouselCount={2}
        // Optionally scale down the thumbnails when further from currentTime.
        // carouselThumbnailScale={(index: number) => 1.0 - Math.abs(index) * 0.15}
      />
    );
  };

  const renderSingleThumbnail = (seekBarPosition) => {
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <ThumbnailView
        visible={seekBarPosition.isScrubbing}
        containerStyle={styles.thumbnailContainerSingle}
        thumbnailStyleCurrent={styles.thumbnailCurrentSingle}
        thumbnailTrack={thumbnailTrack}
        duration={seekBarPosition.duration}
        time={seekBarPosition.currentProgress}
        size={THUMBNAIL_SIZE}
        showTimeLabel={false}
        offset={Math.min(
          seekBarPosition.seekBarWidth - THUMBNAIL_SIZE,
          Math.max(
            0,
            seekBarPosition.currentProgressPercentage *
              seekBarPosition.seekBarWidth -
              0.5 * THUMBNAIL_SIZE
          )
        )}
      />
    );
  };

  const selectableTextTracks = filterRenderableTracks(textTracks);

  return (
    <View style={[styles.container, style]}>
      <StatusBar hidden></StatusBar>
      <TouchableOpacity
        onPress={() => {
          toggleScreenTouched();
        }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          justifyContent: "center",
        }}
      >
        {/* <ActionButton
          icon={backAarrow}
          style={styles.fullScreenCenter}
          iconStyle={styles.playButton}
        /> */}
        {screenClicked && (
          <TouchableOpacity
            // style={{left: 0, zIndex: 10}}
            // icon={backAarrow}
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: 30,
              top: 30,
              zIndex: 100,
            }}
          >
            {/* <Image source={backAarrow} style={{ height: 20, width: 30 }} /> */}
            <Icon name="arrowleft" size={30} color="#fff" />
          </TouchableOpacity>
        )}
        {/*Background*/}
        <View style={styles.background} />

        {showLoadingIndicator && !paused && !seekingButton && (
          <View style={styles.fullScreenCenter}>
            <DelayedActivityIndicator size="large" color="aqua" />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            width: "60%",
            justifyContent: "space-evenly",
          }}
        >
          {screenClicked && (
            <ActionButton
              touchable={!Platform.isTV}
              icon={backwards}
              style={styles.fullScreenCenter}
              iconStyle={styles.playButton}
              // onPress={togglePlayPause}
              onPress={() => {
                setSeekingButton(true);
                myStopFunction();
                timer.current = setTimeout(() => {
                  setScreenClicked(false);
                  setSeekingButton(false);
                }, 2000);
                onSeek(currentTime - 10000);
              }}
            />
          )}
          {!error && screenClicked && (
            <ActionButton
              touchable={!Platform.isTV}
              icon={paused ? PlayButton : pause}
              style={styles.fullScreenCenter}
              iconStyle={paused ? styles.playButton : styles.pauseButton}
              onPress={togglePlayPause}
            />
          )}
          {screenClicked && (
            <ActionButton
              touchable={!Platform.isTV}
              icon={forwards}
              style={styles.fullScreenCenter}
              iconStyle={styles.playButton}
              onPress={() => {
                setSeekingButton(true);
                myStopFunction();
                timer.current = setTimeout(() => {
                  setScreenClicked(false);
                  setSeekingButton(false);
                }, 2000);
                onSeek(currentTime + 10000);
              }}
            />
          )}
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>
              {error.errorCode} - {error.errorMessage}
            </Text>
          </View>
        )}

        {screenClicked && (
          <View style={styles.controlsContainer}>
            <SeekBar
              // On TV platforms we use the progress dot to play/pause
              setScreenClicked={setScreenClicked}
              cleartimeout={myStopFunction}
              onDotPress={togglePlayPause}
              onSeek={onSeek}
              seekable={seekable}
              duration={duration}
              currentTime={currentTime}
              renderTopComponent={
                THUMBNAIL_MODE === "carousel"
                  ? renderThumbnailCarousel
                  : renderSingleThumbnail
              }
            />

            <View style={styles.bottomControlsContainer}>
              {/*Mute*/}
              <ActionButton
                style={{ marginLeft: 0 }}
                icon={muted ? MutedIcon : UnMutedIcon}
                onPress={toggleMuted}
                iconStyle={styles.menuIcon}
              />

              {/*TimeLabel*/}
              <TimeLabel
                style={styles.timeLabel}
                isLive={!isFinite(duration)}
                currentTime={currentTime}
                duration={duration}
              />

              {/*Spacer*/}
              <View style={{ flexGrow: 1 }} />

              {/*TextTrack menu */}
              {selectableTextTracks && selectableTextTracks.length > 0 && (
                <MenuButton
                  setScreenClicked={setScreenClicked}
                  cleartimeout={myStopFunction}
                  title={"Subtitles"}
                  icon={SubtitlesIcon}
                  data={
                    [...selectableTextTracks, null] ||
                    [].map((textTrack) =>
                      textTrack.label
                        ? new MenuItem(getTrackLabel(textTrack))
                        : new MenuItem("None")
                    )
                  }
                  onItemSelected={selectTextTrack}
                  selectedItem={
                    selectedTextTrack
                      ? textTracks.findIndex(
                          (textTrack) => textTrack.uid === selectedTextTrack
                        )
                      : textTracks.length
                  }
                  keyExtractor={(index) => `sub${index}`}
                />
              )}

              {/*AudioTrack menu */}
              {audioTracks && audioTracks.length > 0 && (
                <MenuButton
                  setScreenClicked={setScreenClicked}
                  title={"Language"}
                  icon={AudioIcon}
                  data={
                    audioTracks ||
                    [].map(
                      (audioTrack) => new MenuItem(getTrackLabel(audioTrack))
                    )
                  }
                  onItemSelected={selectAudioTrack}
                  minimumItems={2}
                  selectedItem={audioTracks.findIndex(
                    (audioTrack) => audioTrack.uid === selectedAudioTrack
                  )}
                  keyExtractor={(index) => `lng${index}`}
                />
              )}

              {/*Source menu */}
              {/* {sources && sources.length > 0 && (
                <MenuButton
                  title={'Source'}
                  icon={ListIcon}
                  data={sources.map(source => new MenuItem(source.name))}
                  onItemSelected={selectSource}
                  selectedItem={srcIndex}
                  keyExtractor={index => `src${index}`}
                />
              )} */}

              {/*Fullscreen*/}
              {/* {!Platform.isTV && (
                <ActionButton
                  icon={fullscreen ? FullScreenExitIcon : FullScreenIcon}
                  onPress={toggleFullScreen}
                  iconStyle={styles.menuIcon}
                />
              )} */}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VideoPlayerUI;
