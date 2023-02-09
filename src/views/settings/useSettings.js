import React, { useState } from "react";

import { 
  updateUser as updateUserAPI,
  updateUserPassword as updateUserPasswordAPI,
} from "api/user";

import { useAuthContext } from "context/AuthContext";

export default function useSettings() {
  // Context
  const { userData, setUserData, refreshToken, userLogout } = useAuthContext();

  // Local States - to be passed
  const [generalIsUpdating, setGeneralIsUpdating] = useState(false);
  const [passwordIsUpdating, setPasswordIsUpdating] = useState(false);

  async function updateUser(payload) {
    setGeneralIsUpdating(true);
    const res = await updateUserAPI(JSON.stringify(payload));
    if(res.status === 200) {
      setGeneralIsUpdating(false);
      setUserData({
        ...userData,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      });
      return res;
    } else if (res.response?.status === 403) {
      console.log('User Token Expired, Logging out...', res.message ?? res.response.message);
      await userLogout();
    } else {
      setGeneralIsUpdating(false);
      console.log('views/settings/useSettings - updateUser Error: ', res.message ?? res.response?.message);
    }
  }

  async function udpatePassword(payload) {
    setPasswordIsUpdating(true);
    const res = await updateUserPasswordAPI(JSON.stringify(payload));
    if(res.status === 200) {
      setPasswordIsUpdating(false);
      refreshToken();
    } else if (res.response?.status === 403) {
      console.log('User Token Expired, Logging out...', res.message ?? res.response.message);
      await userLogout();
    } else {
      setPasswordIsUpdating(false);
      console.log('views/settings/useSettings - updateUser Error: ', res.message ?? res.response?.message);
    }
    return res;
  }

  return {
    generalIsUpdating,
    passwordIsUpdating,
    updateUser,
    udpatePassword,
  }
}