import apiClient from "@/lib/api.client";
import { useAppStore } from "@/store";
import { LOGIN_WITH_INTEGACC_ROUTE } from "@/utils/constants";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const IntegrationAccc = () => {
  const { email } = useParams();
  const { userInfo, setSelectedChatData, setSelectedChatType } = useAppStore();

  const navigation = useNavigate();
  const handleLogin = async () => {
    try {
      const { data } = await apiClient.post(LOGIN_WITH_INTEGACC_ROUTE, {
        email,
      });

      if (userInfo._id === data.data._id) {
        navigation("/chat");
      }
      if (data.data._id) {
        setSelectedChatData(data.data);
        setSelectedChatType("contact");
      }
      navigation("/chat");
    } catch (error) {
      navigation(-1);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className="bg-[#1b1c24] w-full h-screen flex justify-center items-center">
      <Loader2 size={80} className="text-white animate-spin" />
    </div>
  );
};

export default IntegrationAccc;
