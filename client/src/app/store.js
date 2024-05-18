import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookReducer from "../features/book/bookSlice";
import otherSlice from "../features/other/otherSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    other: otherSlice,
  },
});
