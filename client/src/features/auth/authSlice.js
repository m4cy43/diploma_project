import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user
    ? user
    : {
        email: "",
        token: "",
      },
  full: {
    email: "",
    membership: "",
    name: "",
    surname: "",
    middlename: "",
    phone: "",
  },
  roles: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout(user);
});

export const getAuthUser = createAsyncThunk(
  "auth/full",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.getAuthUser(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getRoles = createAsyncThunk("auth/roles", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await authService.getRoles(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const changeCred = createAsyncThunk(
  "auth/changeCred",
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.changeCred(user, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    resetRoles: (state) => {
      state.roles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.roles = action.payload.roles;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.roles = [];
      })
      .addCase(getAuthUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.full = action.payload;
      })
      .addCase(getAuthUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.full = null;
      })
      .addCase(changeCred.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeCred.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(changeCred.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = {
          uuid: "",
          email: "",
          membership: "",
          name: "",
          surname: "",
          middlename: "",
          phone: "",
          token: "",
        };
        state.roles = [];
      });
  },
});

export const { reset, resetRoles } = authSlice.actions;
export default authSlice.reducer;
