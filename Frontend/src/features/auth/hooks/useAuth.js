import { useDispatch } from "react-redux";
import { register, login, getMe, updateProfile, changePassword } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      await register({ email, username, password });
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Registration failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch user data"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  // Returns { success, message } — caller handles toast
  async function handleUpdateProfile({ username, email }) {
    try {
      const data = await updateProfile({ username, email });
      dispatch(setUser(data.user));
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Update failed" };
    }
  }

  // Returns { success, message }
  async function handleChangePassword({ currentPassword, newPassword }) {
    try {
      const data = await changePassword({ currentPassword, newPassword });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Password change failed" };
    }
  }

  function handleLogout() {
    dispatch(setUser(null));
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleUpdateProfile,
    handleChangePassword,
    handleLogout,
  };
}
