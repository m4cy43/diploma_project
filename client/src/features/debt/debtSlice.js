import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import debtService from "./debtService";
import reserveService from "./reserveService";
import bookmarkService from "./bookmarkService";

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
  reservings: [
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
  bookmarks: [
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
  debtsAreLoaded: false,
  reservingsAreLoaded: false,
  bookmarksAreLoaded: false,
};

export const getAllDebts = createAsyncThunk(
  "debts/getAllDebts",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.getAllDebts(query, token);
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

export const getDebtsAuth = createAsyncThunk(
  "debts/getDebtsAuth",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.getDebtsAuth(token);
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

export const isDebted = createAsyncThunk(
  "debts/isDebted",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.isDebted(query, token);
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

export const debtBook = createAsyncThunk(
  "debts/debtBook",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.debtBook(data, token);
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

export const reserveToDebt = createAsyncThunk(
  "debts/reserveToDebt",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.reserveToDebt(data, token);
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

export const deleteDebt = createAsyncThunk(
  "debts/deleteDebt",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.deleteDebt(query, token);
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

export const sendEmail = createAsyncThunk(
  "debts/sendEmail",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await debtService.sendEmail(query, token);
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

export const getAllReservings = createAsyncThunk(
  "debts/getAllReservings",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reserveService.getAllReservings(query, token);
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

export const getReservingsAuth = createAsyncThunk(
  "debts/getReservingsAuth",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reserveService.getReservingsAuth(token);
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

export const isReserved = createAsyncThunk(
  "debts/isReserved",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reserveService.isReserved(query, token);
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

export const reserveBook = createAsyncThunk(
  "debts/reserveBook",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reserveService.reserveBook(query, token);
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

export const deleteReserving = createAsyncThunk(
  "debts/deleteReserving",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reserveService.deleteReserving(query, token);
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

export const getBookmarksAuth = createAsyncThunk(
  "debts/getBookmarksAuth",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookmarkService.getBookmarksAuth(token);
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

export const isBookmarked = createAsyncThunk(
  "debts/isBookmarked",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookmarkService.isBookmarked(query, token);
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

export const saveBook = createAsyncThunk(
  "debts/saveBook",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookmarkService.saveBook(query, token);
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

export const deleteBookmark = createAsyncThunk(
  "debts/deleteBookmark",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookmarkService.deleteBookmark(query, token);
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
      .addCase(getDebtsAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDebtsAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
        state.debtsAreLoaded = true;
      })
      .addCase(getDebtsAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(isDebted.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(isDebted.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.debts = action.payload;
      })
      .addCase(isDebted.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(debtBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(debtBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.debts = action.payload;
      })
      .addCase(debtBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(reserveToDebt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reserveToDebt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.debts = action.payload;
      })
      .addCase(reserveToDebt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteDebt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDebt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteDebt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllReservings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReservings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservings = action.payload;
      })
      .addCase(getAllReservings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReservingsAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReservingsAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservings = action.payload;
        state.reservingsAreLoaded = true;
      })
      .addCase(getReservingsAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(isReserved.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(isReserved.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservings = action.payload;
      })
      .addCase(isReserved.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(reserveBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reserveBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.reservings = action.payload;
      })
      .addCase(reserveBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteReserving.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReserving.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteReserving.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBookmarksAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookmarksAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookmarks = action.payload;
        state.bookmarksAreLoaded = true;
      })
      .addCase(getBookmarksAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(isBookmarked.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(isBookmarked.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookmarks = action.payload;
      })
      .addCase(isBookmarked.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.bookmarks = action.payload;
      })
      .addCase(saveBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteBookmark.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDebts } = debtSlice.actions;
export default debtSlice.reducer;
