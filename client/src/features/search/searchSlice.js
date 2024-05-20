import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  searchType: "latest",
  flexData: "_",
  headingType: "_",
  headingData: "_",
  advancedData: {
    title: "_",
    authors: "_",
    genres: "_",
    section: "_",
    publisher: "_",
    yearStart: "_",
    yearEnd: "_",
    isbn: "_",
    udk: "_",
    bbk: "_",
  },
  page: 1,
  limit: 10,
  sort: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setFlexData: (state, action) => {
      state.flexData = action.payload;
    },
    setAdvancedData: (state, action) => {
      state.advancedData = action.payload;
    },
    setHeadingData: (state, action) => {
      state.headingData = action.payload;
    },
    setHeadingType: (state, action) => {
      state.headingType = action.payload;
    },
  },
});

export const {
  setLimit,
  setPage,
  setSort,
  setSearchType,
  setFlexData,
  setAdvancedData,
  setHeadingData,
  setHeadingType,
} = searchSlice.actions;
export default searchSlice.reducer;
