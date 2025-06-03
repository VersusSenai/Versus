import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Recupera o usuário salvo
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Salva no localStorage
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Remove ao deslogar
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
