import axios from "axios";
import authHeader from "./AuthHeader.js";
import API from "./Constant.js";

// axios.defaults.baseURL = "http://192.168.1.96/api/v1";
axios.defaults.baseURL = "https://mocapi.tebs.co.in/api";

axios.interceptors.response.use(
  (response) => response,

  (error) => {
    const { config, response } = error;

    if (response && response.status === 403) {
      location.reload();
      window.location.href = "http://localhost:3000";

      localStorage.clear();

      const retryOriginalRequest = new Promise((resolve) => {});

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);

export const Evalution = (params) => {
  return axios.get(`${API.evaluation}`, params, { headers: authHeader() });
};

export const Dashboard = (params) => {
  return axios.get(`${API.dashboard}`, params, { headers: authHeader() });
};
