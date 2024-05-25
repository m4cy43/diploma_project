import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import headingService from "./headingService";

const initialState = {
  authors: [{ uuid: "", name: "", surname: "", middlename: "" }],
  genres: [{ uuid: "", genre: "" }],
  publishers: [{ uuid: "", publisher: "" }],
  sections: [{ uuid: "", section: "" }],
  isbns: [{ uuid: "", isbn: "" }],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getAuthors = createAsyncThunk(
  "headings/getAuthors",
  async (query, thunkAPI) => {
    try {
      return await headingService.getAuthors(query);
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

export const getGenres = createAsyncThunk(
  "headings/getGenres",
  async (query, thunkAPI) => {
    try {
      return await headingService.getGenres(query);
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

export const getPublishers = createAsyncThunk(
  "headings/getPublishers",
  async (query, thunkAPI) => {
    try {
      return await headingService.getPublishers(query);
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

export const getSections = createAsyncThunk(
  "headings/getSections",
  async (query, thunkAPI) => {
    try {
      return await headingService.getSections(query);
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

export const getIsbns = createAsyncThunk(
  "headings/getIsbns",
  async (query, thunkAPI) => {
    try {
      return await headingService.getIsbns(query);
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

export const createAuthor = createAsyncThunk(
  "headings/createAuthor",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.createAuthor(data, token);
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

export const createGenre = createAsyncThunk(
  "headings/createGenre",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.createGenre(data, token);
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

export const createSection = createAsyncThunk(
  "headings/createSection",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.createSection(data, token);
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

export const createPublisher = createAsyncThunk(
  "headings/createPublisher",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.createPublisher(data, token);
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

export const createIsbn = createAsyncThunk(
  "headings/createIsbn",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.createIsbn(data, token);
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

export const deleteAuthor = createAsyncThunk(
  "headings/deleteAuthor",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.deleteAuthor(query, token);
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

export const deleteGenre = createAsyncThunk(
  "headings/deleteGenre",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.deleteGenre(query, token);
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

export const deleteSection = createAsyncThunk(
  "headings/deleteSection",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.deleteSection(query, token);
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

export const deletePublisher = createAsyncThunk(
  "headings/deletePublisher",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.deletePublisher(query, token);
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

export const deleteIsbn = createAsyncThunk(
  "headings/deleteIsbn",
  async (query, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await headingService.deleteIsbn(query, token);
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

export const headingSlice = createSlice({
  name: "headings",
  initialState,
  reducers: {
    resetHeadings: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuthors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.authors = action.payload;
      })
      .addCase(getAuthors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGenres.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGenres.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.genres = action.payload;
      })
      .addCase(getGenres.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sections = action.payload;
      })
      .addCase(getSections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPublishers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublishers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.publishers = action.payload;
      })
      .addCase(getPublishers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getIsbns.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIsbns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isbns = action.payload;
      })
      .addCase(getIsbns.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createGenre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPublisher.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPublisher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createPublisher.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createIsbn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createIsbn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createIsbn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteGenre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGenre.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePublisher.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePublisher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deletePublisher.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteIsbn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteIsbn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteIsbn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetHeadings } = headingSlice.actions;
export default headingSlice.reducer;
