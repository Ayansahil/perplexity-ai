import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Protected from "../features/auth/components/Protected";
import Layout from "../features/chat/pages/Dashboard";
import HomeView from "../features/chat/pages/HomeView";
import ChatView from "../features/chat/pages/ChatView";
import HistoryPage from "../features/chat/pages/HistoryPage";
import AccountPage from "../features/auth/pages/AccountPage";
import SettingsPage from "../features/chat/pages/SettingsPage";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Protected shell — Layout renders sidebar + topbar + <Outlet />
  {
    path: "/",
    element: (
      <Protected>
        <Layout />
      </Protected>
    ),
    children: [
      { index: true, element: <HomeView /> },
      { path: "chat/:chatId", element: <ChatView /> },
      { path: "history", element: <HistoryPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  // Legacy redirect
  { path: "/dashboard", element: <Navigate to="/" replace /> },
]);
