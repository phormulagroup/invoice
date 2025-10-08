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
  email: {
    read: "/email/read",
    create: "/email/create",
    update: "/email/update",
    delete: "/email/delete",
  },
  media: {
    read: "/media/read",
    upload: "/media/upload",
    singleUpload: "/media/singleUpload",
    update: "/media/update",
    delete: "/media/delete",
  },
};

export default endpoints;
