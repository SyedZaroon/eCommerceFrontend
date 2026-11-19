import api from "./api";

export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data.user;
};

export const loginCustomer = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const registerCustomer = async (details) => {
  const response = await api.post("/register", details);
  return response.data;
};

export const logoutCustomer = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const updateAccount = async (details) => {
  const response = await api.patch("/account", details);
  return response.data;
};

export const getMyOrders = async (page = 1, limit = 10) => {
  const response = await api.get("/orders/mine", {
    params: { page, limit },
  });
  return response.data.data;
};
