import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import endpoints from "./endpoints";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetUser();
  }, []);

  function handleGetUser() {
    let token = localStorage.getItem("token");
    if (token) {
      axios
        .post(endpoints.auth.verifyToken, {
          data: token,
        })
        .then((res) => {
          if (res.data.token_valid) {
            navigate("/app");
            setUser(res.data.user);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            navigate("/login");
          }
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsLoading(true);
    navigate("/login");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  function handleLogin(res) {
    setUser(res.user);
    setIsLoggedIn(true);
    navigate("/app");
  }

  function handleUpdateProfile(item) {
    setUser(item);
  }

  return (
    <Context.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        handleLogout,
        handleLogin,
        handleUpdateProfile,
        setIsLoading,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
