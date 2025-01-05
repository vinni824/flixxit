import {
  ADDLIST,
  REMOVELIST,
  LOGIN,
  SIGNUP,
  GENRES,
  MOVIEDATA,
  BANNERDATA,
  MYLIST,
  LOGOUT,
  SEARCHDATA,
  CONFIGURL,
} from "./actionType.js";
import axios from "axios";

import { Button, message } from "antd";

const BASE_URL = "http://localhost:5000/api";

export function login(params) {
  return async function (dispatch, getState) {
    try {
      const { data } = await axios.post(BASE_URL + "/users/login", {
        ...params,
      });
      if (data?.token?.length > 10) {
        localStorage.setItem("auth_token", data.token);

        message.success("Login Success!");

        localStorage.setItem("role", data?.role);
        dispatch({ type: LOGIN });
        dispatch(getUrlConfiguration());
        dispatch(getGenres());
      } else {
        localStorage.removeItem("auth_token");

        message.error("Login Failed");
      }
    } catch (err) {
      localStorage.removeItem("auth_token");
      console.log("error--", err);
      message.error(err?.response?.data?.error || "Login Failed");
    }
  };
}

export function signup(params, successCallback) {
  return async function (dispatch, getState) {
    try {
      const { data } = await axios.post(BASE_URL + "/users/register", {
        ...params,
      });
      if (data) {
        message.success("Signup Success!");
        successCallback();
        dispatch({ type: SIGNUP, payload: params });
      }
    } catch (err) {
      message.error(err?.response?.data?.error || "Signup Failed");
    }
  };
}

export const getGenres = (params) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const res = await axios.get(BASE_URL + "/movie/genres", {
        headers,
        params,
      });
      const { data } = res?.data;
      console.log("payload", data, res);
      dispatch({ type: GENRES, payload: data });
    } catch (err) {
      console.log(err);
      return err;
    }
  };
};
export const getBannerData = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.get(BASE_URL + "/bannerdata", {
        headers,
        params,
      });
      successCallback(data);
      dispatch({ type: BANNERDATA, payload: data });
    } catch (err) {
      callback();
      console.log(err);
      return err;
    }
  };
};
export const getTrendingData = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.get(BASE_URL + "/movies/trending", {
        headers,
        params,
      });
      successCallback(data);
      dispatch({ type: BANNERDATA, payload: data });
    } catch (err) {
      callback();
      console.log(err);
      return err;
    }
  };
};

export const getMovieData = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.get(BASE_URL + "/bannerdata", {
        headers,
        params,
      });
      successCallback(data);
      dispatch({ type: MOVIEDATA, payload: data });
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};

export const getSearchData = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.get(BASE_URL + "/movie/search", {
        headers,
        params,
      });
      successCallback(data);
      dispatch({ type: SEARCHDATA, payload: data });
    } catch (err) {
      callback();
      console.log(err);
      return err;
    }
  };
};

export const addToList = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        BASE_URL + `/users/add-to-watchlist`,
        params,
        {
          headers,
        }
      );
      successCallback(data);
      dispatch({ type: ADDLIST, payload: data });

      message.success("Added to List!");
      dispatch(getMyList());
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};

export const removeFromList = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        BASE_URL + `/users/remove-from-watchlist`,
        params,
        {
          headers,
        }
      );
      successCallback(data);
      dispatch({ type: REMOVELIST, payload: data });
      message.success("Removed from List!");
      dispatch(getMyList());
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};

export const upvote = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      console.log("headers", headers);

      const res = await axios.post(BASE_URL + `/movies/upvote`, params, {
        headers,
      });
      successCallback(res);

      message.success("Liked!");
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};
export const downvote = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.post(BASE_URL + `/movies/downvote`, params, {
        headers,
      });
      successCallback(data);

      message.success("Disliked!");
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};
export const getProfile = (successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.get(BASE_URL + `/users/profile`, {
        headers,
      });
      successCallback(data);
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};

export const updateProfile = (params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.patch(
        BASE_URL + `/users/update-profile`,
        params,
        {
          headers,
        }
      );
      successCallback(data);
      message.success("Profile updated!");
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};

export const getMyList = () => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const { data } = await axios.get(BASE_URL + `/user/my-list`, {
        headers,
      });

      dispatch({ type: MYLIST, payload: data });
    } catch (err) {
      console.log(err);

      return err;
    }
  };
};

export const logout = (callback) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOGOUT });
      callback();
    } catch (err) {
      return err;
    }
  };
};

export const getUrlConfiguration = (params) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const res = await axios.get(BASE_URL + "/movie/configuration", {
        headers,
        params,
      });
      const { data } = res?.data;
      const url = {
        backdrop: data.images.secure_base_url + "original",
        poster: data.images.secure_base_url + "original",
        profile: data.images.secure_base_url + "original",
      };

      dispatch({ type: CONFIGURL, payload: url });
    } catch (err) {
      console.log(err);
      return err;
    }
  };
};
export const fetchDataFromApi = (url, params, successCallback, callback) => {
  const headers = {
    Authorization: "bearer " + localStorage.getItem("auth_token"),
  };
  return async (dispatch) => {
    try {
      const res = await axios.get(BASE_URL + url, {
        headers,
        params,
      });
      const { data } = res?.data;
      successCallback(data);
    } catch (err) {
      console.log(err);
      callback();
      return err;
    }
  };
};
