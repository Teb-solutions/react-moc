/* eslint-disable no-undef */
import axios from 'axios';

const handleError = async (error) => {
	let err = {
		status: 500,
		message: 'error_message'
	};

	if (error.response) {
		if (error.response.status === 401 && !error.config._retry) {
			error.config._retry = true;
			// const refresh_token = localStorage.getItem('refresh_token');
			// const resp = await apiClient.get(`${process.env.REACT_APP_API_BASE_URL}/auth/admin/refresh-token`, {
			// 	headers: { Authorization: `Bearer ${refresh_token}` }
			// });

			localStorage.setItem('token', resp.data.accessToken);
			localStorage.setItem('refresh_token', resp.data.refreshToken);

			error.config.headers.Authorization = `Bearer ${resp.data.accessToken}`;

			return apiClient(error.config);
		}

		if (error.response.status === 403) {
			// err = {
			//     status: 403,
			//     message: "",
			// };
			localStorage.clear();
			window.location = `${process.env.REACT_APP_PUBLIC_URL}/auth/login`;
		} else if (error.response.status === 500) {
			err = {
				status: error.response.status,
				message: 'error_message'
			};
		} else if (error.response.status === 503) {
			err = {
				status: error.response.status,
				message: 'App is under maintenance'
			};
			window.location = `${process.env.REACT_APP_PUBLIC_URL}/under-maintenance`;
		} else if (error.response.status === 400) {
			err = {
				message: error.response.data.message || err.message,
				status: error.response.status,
				errors: error.response.data.messages || {}
			};
		} else {
			err = {
				status: error.response.status,
				message: error.response.data.message || 'error_message'
			};
		}
	}

	return Promise.reject(err);
};

export const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_API_BASE_URL}/admins`,
	headers: {
		Accept: 'application/json'
	}
});

export const apiAuth = axios.create({
	baseURL: process.env.VITE_APP_API_BASE_URL,
	headers: {
		Accept: 'application/json'
	}
});

apiClient.interceptors.request.use((config) => {
	if (config.url !== `${process.env.REACT_APP_API_BASE_URL}/auth/admin/refresh-token`)
		config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

	return config;
});
apiClient.interceptors.response.use((res) => res, handleError);
apiAuth.interceptors.response.use((res) => res, handleError);
