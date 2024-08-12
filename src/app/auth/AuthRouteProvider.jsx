/* eslint-disable no-undef */
import { createContext, useCallback, useContext, useMemo } from "react";
import FuseAuthorization from "@fuse/core/FuseAuthorization";
import { useAppDispatch, useAppSelector } from "app/store/hooks";
import FuseSplashScreen from "@fuse/core/FuseSplashScreen/FuseSplashScreen";
import {
  resetUser,
  selectUser,
  selectUserRole,
  setUser,
  updateUser,
} from "src/app/auth/user/store/userSlice";
import BrowserRouter from "@fuse/core/BrowserRouter";
import axios from "axios";
import _ from "@lodash";
import useJwtAuth from "./services/jwt/useJwtAuth";
import UserModel from "./user/models/UserModel";

const AuthContext = createContext({
  isAuthenticated: false,
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

function AuthRouteProvider(props) {
  const { children } = props;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userRole = useAppSelector(selectUserRole);

  const jwtService = useJwtAuth({
    config: {
      tokenStorageKey: "jwt_access_token",
      signInUrl: "/auth/sign-in",
      signUpUrl: "/auth/sign-up",
      tokenRefreshUrl: "/auth/refresh",
      getUserUrl: "/auth/user",
      updateUserUrl: "/auth/user",
      updateTokenFromHeader: true,
    },
    onSignedIn: (user) => {
      dispatch(setUser(user));
      setAuthService("jwt");
    },
    onSignedUp: (user) => {
      dispatch(setUser(user));
      setAuthService("jwt");
    },
    onSignedOut: () => {
      dispatch(resetUser());
      resetAuthService();
    },
    onUpdateUser: (user) => {
      dispatch(updateUser(user));
    },
    onError: (error) => {
      console.warn(error);
    },
  });

  const axiosService = {
    signIn: async (params) => {
      try {
        const response = await axiosInstance.post("/Account/Login", params);
        const user = response.data;
        dispatch(setUser(user));
        setAuthService("axios");
        return user;
      } catch (error) {
        console.warn(error);
        throw error;
      }
    },
    signUp: async (email, password, displayName) => {
      try {
        const response = await axiosInstance.post("/auth/sign-up", {
          email,
          password,
          displayName,
        });
        const user = UserModel({
          uid: response.data.id,
          role: ["admin"],
          data: {
            displayName,
            email: response.data.email,
          },
        });
        dispatch(setUser(user));
        setAuthService("axios");
        return user;
      } catch (error) {
        console.warn(error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await axiosInstance.post("/auth/sign-out");
        dispatch(resetUser());
        resetAuthService();
      } catch (error) {
        console.warn(error);
        throw error;
      }
    },
    updateUser: async (userData) => {
      try {
        const response = await axiosInstance.put("/auth/user", userData);
        const updatedUser = response.data;
        dispatch(updateUser(updatedUser));
        return updatedUser;
      } catch (error) {
        console.warn(error);
        throw error;
      }
    },
    isLoading: false,
    isAuthenticated: !!user,
  };

  const isLoading = useMemo(
    () => jwtService?.isLoading || axiosService?.isLoading,
    [jwtService?.isLoading, axiosService?.isLoading]
  );

  const isAuthenticated = useMemo(
    () => jwtService?.isAuthenticated || axiosService?.isAuthenticated,
    [jwtService?.isAuthenticated, axiosService?.isAuthenticated]
  );

  const combinedAuth = useMemo(
    () => ({
      jwtService,
      axiosService,
      signOut: () => {
        const authService = getAuthService();

        if (authService === "jwt") {
          return jwtService?.signOut();
        }

        if (authService === "axios") {
          return axiosService?.signOut();
        }

        return null;
      },
      updateUser: (userData) => {
        const authService = getAuthService();

        if (authService === "jwt") {
          return jwtService?.updateUser(userData);
        }

        if (authService === "axios") {
          return axiosService?.updateUser(_.merge({}, user, userData));
        }

        return null;
      },
      isAuthenticated,
    }),
    [isAuthenticated, user]
  );

  const getAuthService = useCallback(() => {
    return localStorage.getItem("authService");
  }, []);

  const setAuthService = useCallback((authService) => {
    if (authService) {
      localStorage.setItem("authService", authService);
    }
  }, []);

  const resetAuthService = useCallback(() => {
    localStorage.removeItem("authService");
  }, []);

  if (isLoading) {
    return <FuseSplashScreen />;
  }

  return (
    <AuthContext.Provider value={combinedAuth}>
      <BrowserRouter>
        <FuseAuthorization userRole={userRole}>{children}</FuseAuthorization>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthRouteProvider");
  }

  return context;
}

export { useAuth, AuthRouteProvider };

// import { createContext, useCallback, useContext, useMemo } from 'react';
// import FuseAuthorization from '@fuse/core/FuseAuthorization';
// import { useAppDispatch, useAppSelector } from 'app/store/hooks';
// import FuseSplashScreen from '@fuse/core/FuseSplashScreen/FuseSplashScreen';
// import { resetUser, selectUser, selectUserRole, setUser, updateUser } from 'src/app/auth/user/store/userSlice';
// import BrowserRouter from '@fuse/core/BrowserRouter';
// import firebase from 'firebase/compat/app';
// import _ from '@lodash';
// import useJwtAuth from './services/jwt/useJwtAuth';
// import useFirebaseAuth from './services/firebase/useFirebaseAuth';
// import UserModel from './user/models/UserModel';

// const AuthContext = createContext({
// 	isAuthenticated: false
// });

// function AuthRouteProvider(props) {
// 	const { children } = props;
// 	const dispatch = useAppDispatch();
// 	const user = useAppSelector(selectUser);
// 	/**
// 	 * Get user role from store
// 	 */
// 	const userRole = useAppSelector(selectUserRole);
// 	/**
// 	 * Jwt auth service
// 	 */
// 	const jwtService = useJwtAuth({
// 		config: {
// 			tokenStorageKey: 'jwt_access_token',
// 			signInUrl: 'mock-api/auth/sign-in',
// 			signUpUrl: 'mock-api/auth/sign-up',
// 			tokenRefreshUrl: 'mock-api/auth/refresh',
// 			getUserUrl: 'mock-api/auth/user',
// 			updateUserUrl: 'mock-api/auth/user',
// 			updateTokenFromHeader: true
// 		},
// 		onSignedIn: (user) => {
// 			dispatch(setUser(user));
// 			setAuthService('jwt');
// 		},
// 		onSignedUp: (user) => {
// 			dispatch(setUser(user));
// 			setAuthService('jwt');
// 		},
// 		onSignedOut: () => {
// 			dispatch(resetUser());
// 			resetAuthService();
// 		},
// 		onUpdateUser: (user) => {
// 			dispatch(updateUser(user));
// 		},
// 		onError: (error) => {
// 			// eslint-disable-next-line no-console
// 			console.warn(error);
// 		}
// 	});
// 	/**
// 	 * Firebase auth service
// 	 */
// 	const firebaseService = useFirebaseAuth({
// 		onSignedIn: (_user) => {
// 			firebase
// 				.database()
// 				.ref(`users/${_user.uid}`)
// 				.once('value')
// 				.then((snapshot) => {
// 					const user = snapshot.val();
// 					dispatch(setUser(user));
// 					setAuthService('firebase');
// 				});
// 		},
// 		onSignedUp: (userCredential, displayName) => {
// 			const _user = userCredential.user;
// 			const user = UserModel({
// 				uid: _user.uid,
// 				role: ['admin'],
// 				data: {
// 					displayName,
// 					email: _user.email
// 				}
// 			});
// 			firebaseService.updateUser(user);
// 			setAuthService('firebase');
// 		},
// 		onSignedOut: () => {
// 			dispatch(resetUser());
// 			resetAuthService();
// 		},
// 		onUpdateUser: (user) => {
// 			dispatch(updateUser(user));
// 		},
// 		onError: (error) => {
// 			// eslint-disable-next-line no-console
// 			console.warn(error);
// 		}
// 	});
// 	/**
// 	 * Check if services is in loading state
// 	 */
// 	const isLoading = useMemo(
// 		() => jwtService?.isLoading || firebaseService?.isLoading,
// 		[jwtService?.isLoading, firebaseService?.isLoading]
// 	);
// 	/**
// 	 * Check if user is authenticated
// 	 */
// 	const isAuthenticated = useMemo(
// 		() => jwtService?.isAuthenticated || firebaseService?.isAuthenticated,
// 		[jwtService?.isAuthenticated, firebaseService?.isAuthenticated]
// 	);
// 	/**
// 	 * Combine auth services
// 	 */
// 	const combinedAuth = useMemo(
// 		() => ({
// 			jwtService,
// 			firebaseService,
// 			signOut: () => {
// 				const authService = getAuthService();

// 				if (authService === 'jwt') {
// 					return jwtService?.signOut();
// 				}

// 				if (authService === 'firebase') {
// 					return firebaseService?.signOut();
// 				}

// 				return null;
// 			},
// 			updateUser: (userData) => {
// 				const authService = getAuthService();

// 				if (authService === 'jwt') {
// 					return jwtService?.updateUser(userData);
// 				}

// 				if (authService === 'firebase') {
// 					return firebaseService?.updateUser(_.merge({}, user, userData));
// 				}

// 				return null;
// 			},
// 			isAuthenticated
// 		}),
// 		[isAuthenticated, user]
// 	);
// 	/**
// 	 * Get auth service
// 	 */
// 	const getAuthService = useCallback(() => {
// 		return localStorage.getItem('authService');
// 	}, []);
// 	/**
// 	 * Set auth service
// 	 */
// 	const setAuthService = useCallback((authService) => {
// 		if (authService) {
// 			localStorage.setItem('authService', authService);
// 		}
// 	}, []);
// 	/**
// 	 * Reset auth service
// 	 */
// 	const resetAuthService = useCallback(() => {
// 		localStorage.removeItem('authService');
// 	}, []);

// 	/**
// 	 * Render loading screen while loading user data
// 	 */
// 	if (isLoading) {
// 		return <FuseSplashScreen />;
// 	}

// 	return (
// 		<AuthContext.Provider value={combinedAuth}>
// 			<BrowserRouter>
// 				<FuseAuthorization userRole={userRole}>{children}</FuseAuthorization>
// 			</BrowserRouter>
// 		</AuthContext.Provider>
// 	);
// }

// function useAuth() {
// 	const context = useContext(AuthContext);

// 	if (!context) {
// 		throw new Error('useAuth must be used within a AuthRouteProvider');
// 	}

// 	return context;
// }

// export { useAuth, AuthRouteProvider };
