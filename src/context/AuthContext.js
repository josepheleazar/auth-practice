import React, { createContext, useContext, useEffect, useState } from 'react';

import { isNil } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';

import { ENV_VAR } from 'configs';
import { logoutUser, refreshUser } from 'api/auth';

const AuthContext = createContext({});

function AuthProvider(props) {
  const { children } = props;

  // Local States - to be passed
  const [userData, setUserData] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    window.addEventListener("storage", checkToken());
    window.addEventListener(
      "load",
      () => (
        refreshToken()
          .then(
            navigate(ENV_VAR + path + location.search ?? ''), 
          ),
        false
      )
    );                  
  }, []);

  // Functions
  function checkToken() {
    if(!isNil(localStorage.getItem('userToken'))) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }

  async function refreshToken() {
    if(!isNil(localStorage.getItem('userToken'))) {
      setIsAuth(true);
      try {
        const res = await refreshUser();
        if(res.status === 200) {
          setUserData(res.data.data);
          localStorage.setItem('userToken', res.data.data.token);
        } else if (res.response?.data?.message === 'jwt expired') {
          console.log('User Token Expired, Logging out...', res.message ?? res.response.message);
          await userLogout();
        } else {
          console.log('Context - refreshToken Error:', res.message ?? res.response?.message);
          await userLogout();
        }
      } catch(err) {
        console.log('Cannot refresh user. Logging out...', err);
        await userLogout();
      }
    } else {
      setIsAuth(false);
    }
  }

  async function userLogout() {
    const res = await logoutUser();
    if(res.status === 200) {
      // customMessage('success', 'User logged out successfully'); // BUG CAN'T SHOW MODAL
      console.log('User logged out successfully');
    } else {
      console.log('PageHeader - handleLogoutClick Error: ', res.message ?? res.response?.message);
    }
    localStorage.clear();
    window.location.reload(false);
    navigate('/');
  }

  return(
    <AuthContext.Provider
      value={{
        isAuth,
        userData,
        checkToken,
        refreshToken,
        setIsAuth,
        setUserData,
        userLogout,
      }}
    >
      { children }
    </AuthContext.Provider>
  )
}

function useAuthContext() {
  return useContext(AuthContext);
};

export {
  AuthContext,
  AuthProvider,
  useAuthContext,
}