import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
  users: [
    {
      uuid: "",
      email: "",
      membership: "",
      name: "",
      surname: "",
      middlename: "",
      phone: null,
      updatedAt: "",
      roles: [
        {
          role: "",
        },
      ],
    },
  ],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const getByRoleAndMembership = createAsyncThunk(
  "user/getByRoleAndMembership",
  async (query, thunkAPI) => {
    try {
      return await userService.getByRoleAndMembership(query);
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

export const getByMembership = createAsyncThunk(
  "user/getByMembership",
  async (query, thunkAPI) => {
    try {
      return await userService.getByMembership(query);
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

export const verifyUser = createAsyncThunk(
  "user/verifyUser",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.verifyUser(query, token);
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

export const updUser = createAsyncThunk(
  "user/updUser",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.updUser(data, token);
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

export const delUser = createAsyncThunk(
  "user/delUser",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.delUser(query, token);
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

export const setAdmin = createAsyncThunk(
  "user/setAdmin",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.setAdmin(query, token);
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

export const delAdmin = createAsyncThunk(
  "user/delAdmin",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.delAdmin(query, token);
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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUsers: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getByRoleAndMembership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getByRoleAndMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getByRoleAndMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getByMembership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getByMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getByMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(delUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(delUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(setAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(setAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(delAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(delAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetUsers } = userSlice.actions;
export default userSlice.reducer;
