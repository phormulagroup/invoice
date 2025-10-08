import { useContext, useEffect, useState } from "react";
import { FileOutlined, LogoutOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, notification } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Context } from "../utils/context";

import logo from "../assets/phormula-logo.svg";

const { Header, Content, Sider } = Layout;

const Main = () => {
  const { user, handleLogout } = useContext(Context);
  const location = useLocation();
  const [current, setCurrent] = useState("");

  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [items] = useState([
    getItem("Faturas", "/app", <FileOutlined />),
    getItem("E-mail", "/app/email", <MailOutlined />),
    getItem("Utilizadores", "/app/users", <UserOutlined />),
  ]);

  const navigate = useNavigate();

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, []);

  useEffect(() => {
    let pathname = location.pathname.split("/");
    if (pathname.length > 2) {
      setCurrent(`/${pathname[1]}/${pathname[2]}`);
    } else {
      setCurrent(`/${pathname[pathname.length - 1]}`);
    }
    //setCurrent(location.pathname);
  }, [location]);

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  function handleClickMenu(e) {
    if (e.key === "logout") {
      handleLogout();
    } else {
      navigate(e.key);
    }
  }

  return (
    <Layout>
      <Header className="p-[0px_20px] bg-[#FFF] shadow-lg flex justify-between items-center">
        <div className="flex justify-start items-center w-full">
          <img src={logo} className="h-8 mr-4" />
        </div>
        <Button className="flex justify-end items-center" onClick={handleLogout}>
          <LogoutOutlined /> Logout
        </Button>
      </Header>
      <Layout>
        <Sider
          width={250}
          style={{
            background: "#FFF",
            height: "calc(100vh - 64px)",
          }}
        >
          <div className="flex flex-col justify-between h-full">
            <Menu className="principal-menu" selectedKeys={[current]} mode="inline" items={items} onClick={handleClickMenu} />
          </div>
        </Sider>
        <Layout className={"layout"}>
          <div className="p-[20px] min-h-[calc(100vh-64px)]">
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Main;
