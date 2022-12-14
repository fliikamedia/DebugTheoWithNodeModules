import axios from "axios";
import expressApi from "../../src/api/expressApi";
import geoLocationApi from "../../src/api/geoLocationApi";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import { HOME } from "../../constants/RouteNames";
export const ADD_USER = "ADD_USER";
export const ADD_USER_SUCCESS = "ADD_USER_SUCCESS";
export const ADD_USER_FAILED = "ADD_USER_FAILED";
export const GET_USER = "GET_USER";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILED = "GET_USER_FAILED";
export const ADD_TO_WATCHLIST = "ADD_TO_WATCHLIST";
export const ADD_TO_WATCHLIST_SUCCESS = "ADD_TO_WATCHLIST_SUCCESS";
export const ADD_TO_WATCHLIST_FAILED = "ADD_TO_WATCHLIST_FAILED";
export const REMOVE_FROM_WATCHLIST = "REMOVE_FROM_WATCHLIST";
export const REMOVE_FROM_WATCHLIST_SUCCESS = "REMOVE_FROM_WATCHLIST_SUCCESS";
export const REMOVE_FROM_WATCHLIST_FAILED = "REMOVE_FROM_WATCHLIST_FAILED";
export const ADD_TO_WATCHED = "ADD_TO_WATCHED";
export const ADD_TO_WATCHED_SUCCESS = "ADD_TO_WATCHED_SUCCESS";
export const ADD_TO_WATCHED_FAILED = "ADD_TO_WATCHED_FAILED";
export const UPDATE_WATCHED = "UPDATE_WATCHED";
export const UPDATE_WATCHED_SUCCESS = "UPDATE_WATCHED_SUCCESS";
export const UPDATE_WATCHED_FAILED = "UPDATE_WATCHED_FAILED";
export const ADD_PROFILE = "ADD_PROFILE";
export const ADD_PROFILE_SUCCESS = "ADD_PROFILE_SUCCESS";
export const ADD_PROFILE_FAILED = "ADD_PROFILE_FAILED";
export const ADD_PROFILE_DETAILS = "ADD_PROFILE_DETAILS";
export const ADD_TO_WATCHED_PROFILE = "ADD_TO_WATCHED_PROFILE";
export const ADD_TO_WATCHED_PROFILE_SUCCESS = "ADD_TO_WATCHED_PROFILE_SUCCESS";
export const ADD_TO_WATCHED_PROFILE_FAILED = "ADD_TO_WATCHED_PROFILE_FAILED";
export const ADD_PROFILE_WATCHED_DETAILS = "ADD_PROFILE_WATCHED_DETAILS";
export const SET_PROFILE = "SET_PROFILE";
export const SET_NOT_PROFILE = "SET_NOT_PROFILE";
export const SET_EMAIL = "SET_EMAIL";
export const UPDATE_USER_IMAGE = "UPDATE_USER_IMAGE";
export const UPDATE_USER_IMAGE_SUCCESS = "UPDATE_USER_IMAGE_SUCCESS";
export const UPDATE_USER_IMAGE_FAILED = "UPDATE_USER_IMAGE_FAILED";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILED = "UPDATE_PROFILE_FAILED";
export const UPDATE_MOVIE_TIME = "UPDATE_MOVIE_TIME";
export const REMOVE_PROFILE = "REMOVE_PROFILE";
export const REMOVE_PROFILE_SUCCESS = "REMOVE_PROFILE_SUCCESS";
export const REMOVE_PROFILE_FAILED = "REMOVE_PROFILE_FAILED";
export const CURRENT_PROFILE = "CURRENT_PROFILE";
export const REMOVE_FROM_WATCHED = "REMOVE_FROM_WATCHED";
export const REMOVE_FROM_WATCHED_SUCCESS = "REMOVE_FROM_WATCHED_SUCCESS";
export const REMOVE_FROM_WATCHED_FAILED = "REMOVE_FROM_WATCHED_FAILED";
export const LOGGED_IN_SUCCESS = "LOGGED_IN_SUCCESS";
export const LOGGED_OUT_SUCCESS = "LOGGED_OUT_SUCCESS";
export const FILLING_PROFILE = "FILLING_PROFILE";
export const GET_ALL_USERS = "GET_ALL_USERS";
export const GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS";
export const GET_ALL_USERS_FAILED = "GET_ALL_USERS_FAILED";
export const GET_ALL_WATCHED_MOVIES = "GET_ALL_WATCHED_MOVIES";
export const SELECTING_PROFILE = "SELECTING_PROFILE";
export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
export const NO_PROFILE_FOUND = "NO_PROFILE_FOUND";
export const PROFILE_FOUND = "PROFILE_FOUND";
export const FETCH_PROFILE = "FETCH_PROFILE";
export const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
export const FETCH_PROFILE_FALED = "FETCH_PROFILE_FAILED";
export const CHOOSING_SUBSCRIPTION = "CHOOSING_SUBSCRIPTION";
export const CREATE_USER = "CREATE_USER";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILED = "CREATE_USER_FAILED";
export const ADD_LIKED_MOVIE = "ADD_LIKED_MOVIE";
export const ADD_LIKED_MOVIE_SUCCESS = "ADD_LIKED_MOVIE_SUCCESS";
export const ADD_LIKED_MOVIE_FAILED = "ADD_LIKED_MOVIE_FAILED";
export const REMOVE_LIKED_MOVIE = "REMOVE_LIKED_MOVIE";
export const REMOVE_LIKED_MOVIE_SUCCESS = "REMOVE_LIKED_MOVIE_SUCCESS";
export const REMOVE_LIKED_MOVIE_FAILED = "REMOVE_LIKED_MOVIE_FAILED";
export const ADD_DISLIKED_MOVIE = "ADD_DISLIKED_MOVIE";
export const ADD_DISLIKED_MOVIE_SUCCESS = "ADD_DISLIKED_MOVIE_SUCCESS";
export const ADD_DISLIKED_MOVIE_FAILED = "ADD_DISLIKED_MOVIE_FAILED";
export const REMOVE_DISLIKED_MOVIE = "REMOVE_DISLIKED_MOVIE";
export const REMOVE_DISLIKED_MOVIE_SUCCESS = "REMOVE_DISLIKED_MOVIE_SUCCESS";
export const REMOVE_DISLIKED_MOVIE_FAILED = "REMOVE_DISLIKED_MOVIE_FAILED";
export const HIDE_SPLASH = "HIDE_SPLASH";
export const SHOW_SPLASH = "SHOW_SPLASH";
export const createUser =
  (email, uid, authToken, emailVerified) => async (dispatch) => {
    let headers = {
      authtoken: authToken,
    };
    try {
      dispatch({ type: CREATE_USER });
      const result = await expressApi.post(
        "/users/create-user",
        { email: email, uid: uid, email_verified: emailVerified },
        {
          headers: headers,
        }
      );
      // console.log(result);
      if (result.status === 200) {
        dispatch({ type: CREATE_USER_SUCCESS, payload: result.data });
      } else {
        dispatch({ type: CREATE_USER_FAILED });
      }
    } catch (err) {
      dispatch({ type: CREATE_USER_FAILED });
    }
  };
export const addUser =
  (email, firstName, lastName, yearOfBirth, phoneNumber, profileImage) =>
  async (dispatch) => {
    let data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      dateofBirth: yearOfBirth,
      phone: phoneNumber,
      profiles: {
        name: firstName,
        image: profileImage,
        isMainProfile: true,
      },
    };
    try {
      dispatch({ type: ADD_USER });
      const result = await expressApi.post(`users/update-user`, data);
      // console.log(result);
      if (result.status == 200) {
        dispatch({
          type: ADD_USER_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: SET_PROFILE,
          payload: firstName,
        });
        if (result?.data?.profiles?.length > 0) {
          dispatch({
            type: CURRENT_PROFILE,
            payload: result.data.profiles[0],
          });
        }
      } else {
        dispatch({ type: ADD_USER_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };
export const loggedIn = () => async (dispatch) => {
  try {
    dispatch({ type: LOGGED_IN_SUCCESS });
  } catch (err) {}
};
export const loggedOut = () => async (dispatch) => {
  try {
    dispatch({ type: LOGGED_OUT_SUCCESS });
  } catch (err) {}
};

export const fillingProfile = () => async (dispatch) => {
  try {
    dispatch({ type: FILLING_PROFILE });
  } catch (err) {}
};
export const subscribing = () => async (dispatch) => {
  try {
    dispatch({ type: CHOOSING_SUBSCRIPTION });
  } catch (err) {}
};
export const getUser = (email, authtoken) => async (dispatch) => {
  const profileName = await AsyncStorage.getItem("profileName");
  // console.log("profile namesss", authtoken, email);
  let data = {
    email: email,
  };
  let headers = {
    authtoken: authtoken,
  };
  try {
    dispatch({ type: GET_USER });
    const result = await expressApi.post(`/users/getUser`, data, {
      headers: headers,
    });
    // console.log("result", result.data);
    if (result.status == 200) {
      dispatch({
        type: GET_USER_SUCCESS,
        payload: result?.data,
      });
      // dispatch({
      //   type: SET_AUTH_TOKEN,
      //   payload: authtoken,
      // });
      /* if (profileName) {
        dispatch({
          type: ADD_PROFILE_WATCHED_DETAILS,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      } else { */
      const fetchedProfile = result?.data?.profiles?.find(
        (r) => r.name == profileName
      );
      if (fetchedProfile) {
        dispatch({
          type: CURRENT_PROFILE,
          payload: fetchedProfile,
        });
      } else {
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles[0],
        });
      }
      // dispatch({
      //   type: SET_PROFILE,
      //   payload: result?.data?.profiles[0].name,
      // });
      //}
    } else {
      console.log("err 2");
      dispatch({ type: GET_USER_FAILED });
    }
  } catch (err) {
    dispatch({ type: GET_USER_FAILED });
    alert(err);
    console.log("err 3", err);
  }
};

export const addProfile = (userId, name, image) => async (dispatch) => {
  console.log("adding profile");
  try {
    dispatch({ type: ADD_PROFILE, payload: name });
    const result = await expressApi.post(`/users/addProfile`, {
      userId: userId,
      profile: {
        name: name,
        image: image,
        isMainProfile: false,
      },
    });
    if (result.status == 200) {
      // console.log(result.data);
      dispatch({
        type: ADD_PROFILE_SUCCESS,
        payload: result.data,
      });
      dispatch({
        type: ADD_PROFILE_DETAILS,
        payload: result.data.profiles.find((r) => r.name == name),
      });
    } else {
      dispatch({ type: ADD_PROFILE_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const addtoWatchedProfile =
  (
    created,
    updated,
    userId,
    movieId,
    title,
    duration,
    watched,
    profileId,
    season = null,
    episode = null
  ) =>
  async (dispatch) => {
    try {
      console.log("watched profile");
      //dispatch({ type: ADD_TO_WATCHED_PROFILE });
      const result = await expressApi.patch(`/users/addToWatched`, {
        userId: userId,
        profileId: profileId,
        newMovie: {
          movieId,
          title: title,
          duration: duration,
          watchedAt: watched,
          season: season,
          episode: episode,
          created: created,
          updated: updated,
        },
      });
      if (result.status == 200) {
        // console.log('result',result.data);
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });

        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHED_PROFILE_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const setProfile = (name) => async (dispatch) => {
  dispatch({ type: SET_PROFILE, payload: name });
};
export const setNotProfile = () => async (dispatch) => {
  dispatch({ type: SET_NOT_PROFILE });
};

export const updateWatchedProfile =
  (
    updated,
    userId,
    movieId,
    title,
    duration,
    watched,
    profileId,
    season = null,
    episode = null
  ) =>
  async (dispatch) => {
    console.log("updating profile");
    try {
      // dispatch({ type: UPDATE_WATCHED });
      const result = await expressApi.put(`/users/updateWatched`, {
        userId: userId,
        profileId: profileId,
        newMovie: {
          movieId,
          title: title,
          duration: duration,
          watchedAt: watched,
          season: season,
          episode: episode,
          updated: updated,
        },
      });
      if (result.status === 200) {
        //console.log("result", result);

        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: UPDATE_WATCHED_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const addToProfileWatchList =
  (userId, movie, profileId, season, created) => async (dispatch) => {
    try {
      dispatch({ type: ADD_TO_WATCHLIST });
      const result = await expressApi.post(`/users/addToWatchList`, {
        userId: userId,
        newMovie: {
          title: movie.title,
          movieId: movie._id,
        },
        profileId: profileId,
        season,
        created,
      });
      if (result.status == 200) {
        dispatch({
          type: ADD_TO_WATCHLIST_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHLIST_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const removeFromProfileWatchList =
  (userId, movie, profileId, season) => async (dispatch) => {
    try {
      dispatch({ type: REMOVE_FROM_WATCHLIST });
      const result = await expressApi.post(`/users/removeFromWatchList`, {
        userId: userId,
        newMovie: { title: movie.title },
        profileId: profileId,
        season,
      });
      if (result.status == 200) {
        //console.log(result);
        dispatch({
          type: REMOVE_FROM_WATCHLIST_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: REMOVE_FROM_WATCHLIST_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const removeProfile = (userId, profileId) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FROM_WATCHLIST });
    const result = await expressApi.post(`/users/removeProfile`, {
      userId: userId,
      profileId: profileId,
    });
    if (result.status == 200) {
      // console.log(result);
      dispatch({
        type: GET_USER_SUCCESS,
        payload: result.data,
      });
      dispatch({
        type: CURRENT_PROFILE,
        payload: result.data.profiles[0],
      });
    } else {
      dispatch({ type: REMOVE_FROM_WATCHLIST_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const setEmailFunc = (email) => (dispatch) => {
  try {
    dispatch({ type: SET_EMAIL, payload: email });
  } catch (err) {}
};

export const updateUserImage =
  (userId, profileImage, profileId) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_USER_IMAGE });
      const result = await expressApi.post(`/users/updateUserImage`, {
        userId: userId,
        profileImage: profileImage,
      });
      if (result.status == 200) {
        // console.log(result);
        dispatch({
          type: UPDATE_USER_IMAGE_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: UPDATE_USER_IMAGE_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const updateProfile =
  (userId, profileId, newName, profileImage) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_PROFILE });
      const result = await expressApi.post(`/users/updateProfile`, {
        userId: userId,
        profileId: profileId,
        newName: newName,
        profileImage: profileImage,
      });
      if (result.status == 200) {
        //console.log(result);
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: UPDATE_PROFILE_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const updateMovieTime = (watched, duration) => async (dispatch) => {
  try {
    console.log("updating time");
    dispatch({
      type: UPDATE_MOVIE_TIME,
      payload: { watched: watched, duration: duration },
    });
  } catch (err) {}
};

export const changeProfile = (state, profileId) => (dispatch) => {
  try {
    dispatch({
      type: CURRENT_PROFILE,
      payload: state.user.profiles.find((r) => r._id == profileId),
    });
  } catch (err) {}
};

export const deleteFromWatched =
  (userId, profileId, movieId, isSeries, seriesName) => async (dispatch) => {
    try {
      dispatch({ type: REMOVE_FROM_WATCHED });
      const result = await expressApi.post(`/users/deleteFromWatched`, {
        userId,
        profileId,
        movieId,
        isSeries,
        seriesName,
      });
      if (result.status == 200) {
        //console.log(result.data);
        dispatch({
          type: REMOVE_FROM_WATCHED_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data.profiles.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: REMOVE_FROM_WATCHED_FAILED });
      }
    } catch (err) {
      //console.log(err);
    }
  };

export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USERS });
    const result = await expressApi.get(`/users/get-all-users`);
    if (result.status == 200) {
      console.log("All users", result.data);
      dispatch({
        type: GET_ALL_USERS_SUCCESS,
        payload: result.data,
      });

      //Get all watched movies
      let allWatchedMovies = [];
      for (let i = 0; i < result.data?.length; i++) {
        for (let c = 0; c < result.data[i]?.profiles?.length; c++) {
          allWatchedMovies.push(...result.data[i].profiles[c].watched);
        }
      }
      dispatch({
        type: GET_ALL_WATCHED_MOVIES,
        payload: allWatchedMovies,
      });
    } else {
      dispatch({ type: GET_ALL_USERS_FAILED });
    }
  } catch (err) {
    //console.log(err);
  }
};

export const postGeolocation = (email, geolocation) => async (dispatch) => {
  const body = { email, geolocation };
  console.log("starting");
  try {
    const result = await expressApi.post(`/users/post-geolocation`, {
      email,
      geolocation,
    });
    if (result.status == 200) {
      // console.log("geo location", result.data);
      // dispatch({
      //   type: GET_USER_SUCCESS,
      //   payload: result?.data,
      // });
      /* if (profileName) {
        dispatch({
          type: ADD_PROFILE_WATCHED_DETAILS,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      } else { */
      // dispatch({
      //   type: CURRENT_PROFILE,
      //   payload: result?.data?.profiles[0],
      // });
      // dispatch({
      //   type: SET_PROFILE,
      //   payload: result?.data?.profiles[0].name,
      // });
    } else {
      // dispatch({ type: GET_ALL_USERS_FAILED });
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
};

export const selectedProfile = () => async (dispatch) => {
  try {
    dispatch({ type: SELECTING_PROFILE });
  } catch (err) {}
};

export const changeProfileNew =
  (email, profileId, navigation, navigate) => async (dispatch) => {
    // console.log(email, profileId);
    try {
      dispatch({ type: FETCH_PROFILE });
      const result = await expressApi.post(`/users/change-profile`, {
        email,
        profileId,
      });
      if (result.status === 200 && result.data._id === profileId) {
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data,
        });
        dispatch({ type: SET_PROFILE, payload: result.data.name });
        if (navigate) {
          navigation.navigate(HOME);
        }
        dispatch({ type: FETCH_PROFILE_SUCCESS });
      } else {
        console.log("no profile found");
        dispatch({
          type: CURRENT_PROFILE,
          payload: result.data,
        });
        dispatch({ type: FETCH_PROFILE_FALED });
        dispatch({ type: SET_PROFILE, payload: result.data.name });
        dispatch({ type: NO_PROFILE_FOUND });
      }
    } catch (err) {
      dispatch({ type: FETCH_PROFILE_FALED });
      alert(err);
    }
  };

export const removeProfileError = () => (dispatch) => {
  dispatch({ type: PROFILE_FOUND });
};

export const addLikedMovie =
  (created, userId, movieId, title, profileId, season = null) =>
  async (dispatch) => {
    try {
      dispatch({ type: ADD_LIKED_MOVIE });
      const result = await expressApi.post(`/users/likedMovie`, {
        userId: userId,
        profileId: profileId,
        newMovie: {
          movieId,
          title: title,
        },
        season: season,
        created: created,
      });
      if (result.status == 200) {
        // console.log('result',result.data);
        dispatch({ type: ADD_LIKED_MOVIE_SUCCESS });
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });

        dispatch({
          type: CURRENT_PROFILE,
          payload: result?.data?.profiles?.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHED_PROFILE_FAILED });
        dispatch({ type: ADD_LIKED_MOVIE_FAILED });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: ADD_LIKED_MOVIE_FAILED });
    }
  };
export const addDislikedMovie =
  (created, userId, movieId, title, profileId, season = null) =>
  async (dispatch) => {
    try {
      dispatch({ type: ADD_DISLIKED_MOVIE });
      const result = await expressApi.post(`/users/dislikedMovie`, {
        userId: userId,
        profileId: profileId,
        newMovie: {
          movieId,
          title: title,
        },
        season: season,
        created: created,
      });
      if (result.status == 200) {
        // console.log('result',result.data);
        dispatch({ type: ADD_DISLIKED_MOVIE_SUCCESS });
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });

        dispatch({
          type: CURRENT_PROFILE,
          payload: result?.data?.profiles?.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHED_PROFILE_FAILED });
        dispatch({ type: ADD_DISLIKED_MOVIE_FAILED });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: ADD_DISLIKED_MOVIE_FAILED });
    }
  };

export const removeLikedMovie =
  (userId, movieId, title, profileId, season = null) =>
  async (dispatch) => {
    try {
      dispatch({ type: REMOVE_LIKED_MOVIE });
      const result = await expressApi.post(`/users/remove-likedMovie`, {
        userId: userId,
        profileId: profileId,
        newMovie: {
          movieId,
          title: title,
        },
        season: season,
      });
      if (result.status == 200) {
        dispatch({ type: REMOVE_LIKED_MOVIE_SUCCESS });
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });

        dispatch({
          type: CURRENT_PROFILE,
          payload: result?.data?.profiles?.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHED_PROFILE_FAILED });
        dispatch({ type: REMOVE_LIKED_MOVIE_FAILED });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: REMOVE_LIKED_MOVIE_FAILED });
    }
  };
export const removeDislikedMovie =
  (userId, movieId, title, profileId, season = null) =>
  async (dispatch) => {
    try {
      dispatch({ type: REMOVE_DISLIKED_MOVIE });
      const result = await expressApi.post(`/users/remove-dislikedMovie`, {
        userId: userId,
        profileId: profileId,
        newMovie: {
          movieId,
          title: title,
        },
        season: season,
      });
      if (result.status == 200) {
        dispatch({ type: REMOVE_DISLIKED_MOVIE_SUCCESS });
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });

        dispatch({
          type: CURRENT_PROFILE,
          payload: result?.data?.profiles?.find((r) => r._id == profileId),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHED_PROFILE_FAILED });
        dispatch({ type: REMOVE_DISLIKED_MOVIE_FAILED });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: REMOVE_DISLIKED_MOVIE_FAILED });
    }
  };

export const hideSplashScreen = () => (dispatch) => {
  dispatch({ type: HIDE_SPLASH });
};

export const showSplashScreen = () => (dispatch) => {
  dispatch({ type: SHOW_SPLASH });
};
