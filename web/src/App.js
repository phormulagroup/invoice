import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { useContext } from "react";

import api from "./utils/api";
import { Context } from "./utils/context";

import Loading from "./layout/loading";
import Main from "./layout/main";

import Login from "./pages/login";
import Home from "./pages/home";
import Users from "./pages/users";
import Email from "./pages/email";

api.axiosCreate();

function App() {
  const { isLoggedIn, isLoading } = useContext(Context);

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
            <Route exact path="/app/email" element={<Email />} />
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
