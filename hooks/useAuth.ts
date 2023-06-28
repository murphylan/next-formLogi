import axios from "axios";
import { deleteCookie } from "cookies-next";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    }
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const response = await axios.post(
        "/api/auth/signin",
        {
          email,
          password,
        }
      );
      if ("success" === response.data.status) {
        response.data.email = email;
        setAuthState({
          data: response.data,
          error: null,
          loading: false,
        });
      } else {
        setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };
  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    }
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const response = await axios.post(
        "/api/auth/signup",
        {
          email,
          password,
          firstName,
          lastName,
          city,
          phone,
        }
      );
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const signout = () => {
    deleteCookie("jwt");

    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };

  return {
    signin,
    signup,
    signout,
  };
};

export default useAuth;