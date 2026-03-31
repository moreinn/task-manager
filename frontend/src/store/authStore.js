import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // check if user is logged in
  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        withCredentials: true,
      });

      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    // after login → fetch user
    const res = await axios.get("http://localhost:5000/api/profile", {
      withCredentials: true,
    });

    set({ user: res.data.user });
  },

  logout: async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );

    set({ user: null });
  },
}));