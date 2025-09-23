const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyToken: "/auth/verifyToken",
  },
  invoice: {
    read: "/invoice/read",
  },
  user: {
    read: "/user/read",
    create: "/user/create",
    update: "/user/update",
    delete: "/user/delete",
  },
};

export default endpoints;
