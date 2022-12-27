import { useReducer } from "react";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  TOGGLE_LOADING,
  CLEAR_ERROR_MESSAGE,
  SIGNUP_FAIL,
  SIGNUP_SUCCESS,
} from "../types";
import axios from "axios";

const AuthState = ({ children }) => {
  const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    error: false,
    message: "",
    loading: false,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: TOGGLE_LOADING });
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        {
          "Content-Type": "application/json",
        }
      );

      dispatch({ type: LOGIN_SUCCESS, payload: res.data.user });
      axios.defaults.headers["x-auth-token"] = res.data.user.token;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data,
      });
    }
  };

  const signup = async (formData) => {
    dispatch({ type: TOGGLE_LOADING });
    try {
      const { name, email, password } = formData;
      console.log(name);
      const res = await axios.post(
        "/api/auth/signup",
        { email, password, name },
        {
          "Content-Type": "application/json",
        }
      );

      dispatch({ type: SIGNUP_SUCCESS, payload: res.data });
      axios.defaults.headers["x-auth-token"] = res.data.user.token;
    } catch (error) {
      console.log(error);
      dispatch({
        type: SIGNUP_FAIL,
        payload: error.response.data,
      });
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      console.log(res);

      dispatch({ type: LOGOUT, payload: res.data.message });
    } catch (error) {
      dispatch({ type: CLEAR_ERROR_MESSAGE });
    }
  };

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
  };

  const changeLoadingState = () => {
    dispatch({ type: TOGGLE_LOADING });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        message: state.message,
        error: state.error,
        loading: state.loading,
        login,
        logout,
        signup,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
