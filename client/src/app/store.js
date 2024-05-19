import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookReducer from "../features/book/bookSlice";
import searchSlice from "../features/search/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    search: searchSlice,
  },
});
