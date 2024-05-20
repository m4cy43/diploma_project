import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import debtService from "./debtService";

const initialState = {
  debts: [
    {
      uuid: "",
      email: "",
      name: "",
      surname: "",
      phone: "",
      membership: "",
      books: [
        {
          uuid: "",
          title: "",
          originalTitle: "",
          yearPublish: "",
          yearAuthor: "",
          userbook: {
            uuid: "",
            type: "",
            deadline: "",
            note: "",
            updatedAt: "",
          },
        },
      ],
    },
  ],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getAllDebts = createAsyncThunk(
  "debts/getAllDebts",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.getAllDebts(token);
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

export const getAllBookings = createAsyncThunk(
  "debts/getAllBookings",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.getAllBookings(token);
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

export const oneBookDebt = createAsyncThunk(
  "debts/oneBookDebt",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.oneBookDebt(query, token);
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

export const bookTheBook = createAsyncThunk(
  "debts/bookTheBook",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.bookTheBook(query, token);
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

export const unbookTheBook = createAsyncThunk(
  "debts/unbookTheBook",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.unbookTheBook(query, token);
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

export const getBoth = createAsyncThunk(
  "debts/getBoth",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.getBoth(token);
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

export const debtTheBook = createAsyncThunk(
  "debts/debtTheBook",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.debtTheBook(query, token);
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

export const deleteBookingAdm = createAsyncThunk(
  "debts/deleteBookingAdm",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.deleteBookingAdm(query, token);
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

export const deleteUserDebt = createAsyncThunk(
  "debts/deleteUserDebt",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.deleteUserDebt(query, token);
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

export const debtSlice = createSlice({
  name: "debts",
  initialState,
  reducers: {
    resetDebts: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDebts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDebts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
      })
      .addCase(getAllDebts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(oneBookDebt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(oneBookDebt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
      })
      .addCase(oneBookDebt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(bookTheBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookTheBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
      })
      .addCase(bookTheBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unbookTheBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unbookTheBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
      })
      .addCase(unbookTheBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBoth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBoth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
      })
      .addCase(getBoth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(debtTheBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(debtTheBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(debtTheBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBookingAdm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBookingAdm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteBookingAdm.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteUserDebt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserDebt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteUserDebt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDebts } = debtSlice.actions;
export default debtSlice.reducer;
