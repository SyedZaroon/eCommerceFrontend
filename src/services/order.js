import api from "./api";

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getShippingOptions = async (itemsPrice) => {
  const response = await api.get("/orders/shipping-options", {
    params: { itemsPrice },
  });
  return response.data.data;
};

export const getStripeOrderConfirmation = async (sessionId) => {
  const response = await api.get("/payment/confirmation", {
    params: { session_id: sessionId },
  });
  return response.data.data;
};