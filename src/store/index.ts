import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import loadingReducer from "./loading";
import errorResponseReducer from "./errorResponse";
import userReducer from "./user";
import academicYearReducer from "./academicYear";
import courseReducer from "./course";
import courseManagementReducer from "./courseManagement";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    errorResponse: errorResponseReducer,
    user: userReducer,
    academicYear: academicYearReducer,
    course: courseReducer,
    courseManagement: courseManagementReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
