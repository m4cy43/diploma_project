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
      rate: 0,
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
    title: "",
    originalTitle: "",
    yearPublish: "",
    yearAuthor: "",
    bibliography: "",
    annotation: "",
    physicalDescription: "",
    note: "",
    udk: "",
    bbk: "",
    rate: 0,
    number: 0,
    debtedNumber: 0,
    sectionUuid: "",
    publisherUuid: "",
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
    isbns: [
      {
        uuid: "",
        isbn: "",
        bookUuid: "",
      },
    ],
    publisher: {
      uuid: "",
      publisher: "",
    },
    section: {
      uuid: "",
      section: "",
    },
  },
  recommended: [
    {
      uuid: "",
      title: "",
      originalTitle: "",
      yearPublish: "",
      yearAuthor: "",
      number: 0,
      rate: 0,
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
  isError: false,
  isSuccess: false,
  isLoading: false,
  similarLoading: false,
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

export const getByHeading = createAsyncThunk(
  "books/getByHeading",
  async (query, thunkAPI) => {
    try {
      return await bookService.getByHeading(query);
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

export const getSimilar = createAsyncThunk(
  "books/getSimilar",
  async (query, thunkAPI) => {
    try {
      return await bookService.similarBooks(query);
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

export const getRecommended = createAsyncThunk(
  "books/getRecommended",
  async (query, thunkAPI) => {
    try {
      return await bookService.getRecommended(query);
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

export const updBook = createAsyncThunk(
  "books/updBook",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.updBook(data, token);
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
      .addCase(getByHeading.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getByHeading.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload;
      })
      .addCase(getByHeading.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSimilar.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(getSimilar.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.isSuccess = true;
        state.recommended = action.payload;
      })
      .addCase(getSimilar.rejected, (state, action) => {
        state.similarLoading = false;
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
      .addCase(getRecommended.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(getRecommended.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.isSuccess = true;
        state.recommended = action.payload;
      })
      .addCase(getRecommended.rejected, (state, action) => {
        state.similarLoading = false;
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
      .addCase(updBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetBooks } = bookSlice.actions;
export default bookSlice.reducer;
