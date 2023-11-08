import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { addAuthToken, createItem, removeAuthToken } from "../../api/api";
import { LOGIN } from "../../api/routes";

function initialState() {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  console.log("user", user, "\naccessToken", accessToken);

  if (!user || !accessToken || accessToken === "") {
    removeAuthToken();

    return {
      isLoading: false,

      isLoggedIn: false,
      user: null,
      accessToken: null,
    };
  }

  addAuthToken(accessToken);

  return {
    isLoading: false,

    isLoggedIn: true,
    user: user,
    accessToken: accessToken,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState(),
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      removeAuthToken();

      state.isLoggedIn = false;
      state.user = null;
      state.accessToken = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      localStorage.setItem("user", JSON.stringify(payload.user));
      localStorage.setItem("accessToken", payload.accessToken);

      addAuthToken(payload.accessToken);

      state.isLoggedIn = true;
      state.user = payload.user;
      state.accessToken = payload.accessToken;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.isLoading = false;

      removeAuthToken();

      console.log(payload);
    });
  },
});

export const login = createAsyncThunk("auth/login", async (data, thunkApi) => {
  try {
    const response = await createItem(LOGIN, data);
    console.log(data, response);

    const { role } = response.user;
    if (role !== "admin") {
      return thunkApi.rejectWithValue("Admin Only");
    }

    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
