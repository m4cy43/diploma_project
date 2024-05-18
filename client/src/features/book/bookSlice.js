import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "./bookService";

const initialState = {
  books: [
    {
      uuid: "",
      title: "",
      originalTitle: "",
      yearPublish: "",
      yearAuthor: "",
      number: 0,
      createdAt: "",
      genres: [
        {
          uuid: "",
          genre: "",
        },
      ],
      authors: [
        {
          uuid: "",
          name: "",
          surname: "",
          middlename: "",
        },
      ],
      publisher: {
        uuid: "",
        publisher: "",
      },
    },
  ],
  book: {
    uuid: "",
    number: 0,
    title: "",
    year: 0,
    section: {
      uuid: "",
      sectionName: "",
    },
    authors: [
      {
        uuid: "",
        name: "",
        surname: "",
        middlename: "",
      },
    ],
    genres: [
      {
        uuid: "",
        genreName: "",
      },
    ],
  },
  limit: 10,
  sort: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getLatest = createAsyncThunk(
  "books/getLatest",
  async (query, thunkAPI) => {
    try {
      return await bookService.getLatest(query);
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

export const simpleFind = createAsyncThunk(
  "books/simpleFind",
  async (query, thunkAPI) => {
    try {
      return await bookService.simpleFind(query);
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

export const advancedFind = createAsyncThunk(
  "books/advancedFind",
  async (query, thunkAPI) => {
    try {
      return await bookService.advancedFind(query);
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

export const oneBook = createAsyncThunk(
  "books/oneBook",
  async (query, thunkAPI) => {
    try {
      return await bookService.oneBook(query);
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

export const getAuthorBooks = createAsyncThunk(
  "books/getAuthorBooks",
  async (query, thunkAPI) => {
    try {
      return await bookService.getAuthorBooks(query);
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

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.deleteBook(query, token);
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

export const createBook = createAsyncThunk(
  "books/createBook",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.createBook(data, token);
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

export const incBookNum = createAsyncThunk(
  "books/incBookNum",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.incBookNum(query, token);
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

export const decBookNum = createAsyncThunk(
  "books/decBookNum",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.decBookNum(query, token);
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

export const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    resetBooks: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLatest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLatest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload;
      })
      .addCase(getLatest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(simpleFind.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(simpleFind.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload;
      })
      .addCase(simpleFind.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(advancedFind.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(advancedFind.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload;
      })
      .addCase(advancedFind.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(oneBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(oneBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.book = action.payload;
      })
      .addCase(oneBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAuthorBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuthorBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload;
      })
      .addCase(getAuthorBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.book = initialState.book;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(incBookNum.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(incBookNum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.book = action.payload;
      })
      .addCase(incBookNum.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(decBookNum.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(decBookNum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.book = action.payload;
      })
      .addCase(decBookNum.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetBooks } = bookSlice.actions;
export default bookSlice.reducer;
