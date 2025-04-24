import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import apiClient from "./lib/api.client";
import { GET_USER_INFO } from "./utils/constants";
import IntegrationAccc from "./pages/integration-acc";
import { Loader2 } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to={"/auth"} />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to={"/chat"} /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await apiClient.get(GET_USER_INFO);
        if (data && data._id) {
          setUserInfo(data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setIsLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (isLoading) {
    return (
      <div className="bg-[#1b1c24] w-full h-screen flex justify-center items-center">
        <Loader2 size={80} className="text-white animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="/integration-account/:email" element={<IntegrationAccc />} />
      <Route path="*" element={<Navigate to={"/auth"} />} />
    </Routes>
  );
};

export default App;
