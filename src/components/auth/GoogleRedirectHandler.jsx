import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRedirectResult } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useGoogleLoginMutation } from "../../services/api";
import { toast } from "react-toastify";

const GoogleRedirectHandler = () => {
  const navigate = useNavigate();
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const idToken = await result.user.getIdToken();
          const backendResult = await googleLogin({ token: idToken }).unwrap();
          
          if (backendResult.status && backendResult.data.user) {
            toast.success("Welcome back! Google login successful.");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Firebase Redirect Error:", error);
        if (error.code !== "auth/internal-error" && error.code !== "auth/popup-closed-by-user") {
          toast.error("Failed to sync Google account");
        }
      }
    };

    processRedirect();
  }, [googleLogin, navigate]);

  return null; // مكون صامت يعمل في الخلفية
};

export default GoogleRedirectHandler;
