import axios from "axios";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle errors
const handleErrors = (error) => {
  console.error("API Error:", error);
  throw error;
};

// Generic CRUD functions
const sendRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: endpoint,
    };

    if (data !== null) {
      config.data = data;
    }

    const response = await api(config);

    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getAllItems = (endpoint) => {
  return sendRequest("get", endpoint);
};

export const getItemById = (endpoint) => {
  return sendRequest("get", endpoint);
};

export const createItem = (endpoint, itemData) => {
  return sendRequest("post", endpoint, itemData);
};

export const updateItem = (endpoint, itemData) => {
  return sendRequest("put", endpoint, itemData);
};

export const deleteItem = (endpoint) => {
  return sendRequest("delete", endpoint);
};

// https://github.com/axios/axios#custom-instance-defaults
export const addAuthToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};
