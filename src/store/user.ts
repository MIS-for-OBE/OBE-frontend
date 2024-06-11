import { IModelUser } from "@/models/ModelUser";
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {} as IModelUser,
  reducers: {
    setUser: (state, data) => {
      return { ...state, ...data.payload };
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;