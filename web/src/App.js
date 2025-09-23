import { Routes, Route, Navigate, useNavigate, BrowserRouter, useLocation } from "react-router-dom";
import { createContext, useEffect, useReducer, useState } from "react";
import { ConfigProvider, notification, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useContext } from "react";

import api from "./utils/api";

import Login from "./pages/login";
import Main from "./layout/main";

import Home from "./pages/home";

import Loading from "./layout/loading";

import endpoints from "./utils/endpoints";
import { Context } from "./utils/context";
import Register from "./pages/register";
import Users from "./pages/users";

api.axiosCreate();

function App() {
  const { user, isLoggedIn, isLoading } = useContext(Context);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#061848",
          fontFamily: "Poppins",
        },
      }}
    >
      {isLoading ? (
        <Loading />
      ) : isLoggedIn ? (
        <Routes>
          <Route element={<Main />}>
            <Route exact path="/app/" element={<Home />} />
            <Route exact path="/app/users" element={<Users />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/*" element={<Navigate to={`/login`} replace />} />
        </Routes>
      )}
    </ConfigProvider>
  );
}

export default App;
