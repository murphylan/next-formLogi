import axios from "axios";
import { deleteCookie } from "cookies-next";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
import { getCookie } from "cookies-next";

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
      // 发送请求获取登录页面
      await axios.get('http://localhost:8080/login', { withCredentials: true })
      // 获取Cookie
      const xsrf_cookie = getCookie("XSRF-TOKEN");

      // 构造登录请求的数据
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      // 发送第二个请求并携带“X-XSRF-TOKEN”头
      const response = await axios.post('http://localhost:8080/login', formData, {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': xsrf_cookie
        }
      })

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