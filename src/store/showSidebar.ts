import { createSlice } from "@reduxjs/toolkit";

export const showSidebarSlice = createSlice({
  name: "showSidebar",
  initialState: false,
  reducers: {
    setShowSidebar: (state, action) => {
      return action.payload;
    },
  },
});

export const { setShowSidebar } = showSidebarSlice.actions;

export default showSidebarSlice.reducer;