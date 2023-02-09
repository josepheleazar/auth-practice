import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { isNil } from "lodash";

import useSettings from "./useSettings";

import { useAuthContext } from "context/AuthContext";
import { useMessageContext } from "context/MessageContext";

import styles from './Settings.module.scss';

export default function Settings() {
  // Context
  const { userData, userLogout } = useAuthContext();
  const { contextHolder, customMessage } = useMessageContext();

  // Custom Hook
  const {
    generalIsUpdating,
    passwordIsUpdating,
    updateUser,
    udpatePassword,
  } = useSettings();

  // Local States
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [fieldErrorMessage, setFieldErrorMessage] = useState(null);
  const [generalIsEditable, setGeneralIsEditable] = useState(false);
  const [generalData, setGeneralData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
  const [passwordIsEditable, setPasswordIsEditable] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
    if(!isNil(userData)) {
      setGeneralData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      })
    }
  }, [userData])
  
  // Functions
  function resetLocalStates() {
    setEmailErrorMessage(null);
    setPasswordErrorMessage(null);
    setFieldErrorMessage(null);
    setGeneralData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    })
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleCancel = () => {
    resetLocalStates();
    setGeneralIsEditable(false);
    setPasswordIsEditable(false);
  }

  const handleEditClick = (e) => {
    resetLocalStates();
    if(e.target.name === 'general') {
      setGeneralIsEditable(!generalIsEditable);
      if(passwordIsEditable) setPasswordIsEditable(!passwordIsEditable);
    } else {
      setPasswordIsEditable(!passwordIsEditable);
      if(generalIsEditable) setGeneralIsEditable(!generalIsEditable);
    }
  }

  const handleSubmit = async (e) => {
    if(e.target.name === 'general') {
      if (generalData.email === '') {
        setEmailErrorMessage('Field cannot be empty');
        return;
      }
      const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regEmail.test(generalData.email)) {
        setEmailErrorMessage('Email invalid');
        return;
      } 
      if (generalData.firstName === '' || generalData.lastName === '') {
        setFieldErrorMessage('Field/s cannot be empty');
        return;
      } 
      try {
        const res = await updateUser(generalData);
        if(res.status === 200) {
          customMessage('success', 'User profile updated');
          resetLocalStates();
          setGeneralIsEditable(false);
        } else if (res.response?.status === 403) {
          console.log('User Token Expired, Logging out...', res.message ?? res.response?.message);
          await userLogout();
        } else {
          console.log('views/settings/index - handleSubmit Error: ', res.message ?? res.response?.message);
        }
      } catch(err) {
        console.log('views/settings/index - handleSubmit Error: ', err);
      }
    } else {
      try {
        const res = await udpatePassword(passwordData);
        if (passwordData.oldPassword === '') {
          setFieldErrorMessage('Field/s cannot be empty');
          return;
        } 
        if (passwordData.newPassword === '' || passwordData.confirmPassword === '') {
          setPasswordErrorMessage('Field/s cannot be empty');
          return;
        }
        if(res.status === 200) {
          resetLocalStates();
          customMessage('success', 'Password updated');
          setPasswordIsEditable(false);
        } else if (res.response?.status === 403) {
          console.log('User Token Expired, Logging out...', res.message ?? res.response?.message);
          await userLogout();
        } else if (res.response?.data?.message === 'Old password is password is incorrect') {
          customMessage('error', 'Old password is password is incorrect');
        } else if (res.response?.data?.message === 'Password and confirm password do not match') {
          setPasswordErrorMessage('Password mismatched');
          return;
        } else {
          console.log('views/settings/index - handleSubmit Error: ', res.message ?? res.response?.message);
        }
      } catch(err) {
        console.log('views/settings/index - handleSubmit Error: ', err);
      }
    }
  }

  const handleInputOnChange = (e) => {
    const {
      name,
      value,
    } = e.target;
    
    if(name === 'firstName' || name === 'lastName' || name === 'email') {
      setGeneralData({...generalData, [name]: value});
    } else {
      setPasswordData({...passwordData, [name]: value});
    }
  }
  
  return(
    <Box className={styles['settings__container']}>
      {contextHolder}
      <Box className={styles['settings__container-with-divider--medium']}>
        <Typography variant="h4"> Settings </Typography>
      </Box>
      <Box className={styles['settings__container-with-divider--thin']}>
        <Box className={styles['settings__title-container-with-button']}>
          <Typography variant="h5"> General Account </Typography>
          {
            !generalIsEditable ? (
              <Button name="general" variant="contained" onClick={handleEditClick}> Edit </Button>
            ) : null 
          }
        </Box>
        <Box 
          className={
            generalIsEditable ? ( 
              styles['settings__item-container-with-input--space-between']
            ) : (
              styles['settings__item-container-with-input--flex-start']
            )
          }
        >
          <Typography variant="h6"> First Name: </Typography>
          {
            generalIsEditable ? (
              <TextField 
                className={styles['textfield']}
                error={!!fieldErrorMessage}
                helperText={fieldErrorMessage}
                name='firstName'
                onChange={handleInputOnChange}
                required
                size='small'
                value={generalData.firstName}
              /> 
            ) : (
              <Typography variant="h6"> {userData.firstName} </Typography> 
            )
          }
        </Box>
        <Box 
          className={
            generalIsEditable ? ( 
              styles['settings__item-container-with-input--space-between']
            ) : (
              styles['settings__item-container-with-input--flex-start']
            )
          }
        >
          <Typography variant="h6"> Last Name: </Typography>
          {
            generalIsEditable ? (
              <TextField
                className={styles['textfield']}
                error={!!fieldErrorMessage}
                helperText={fieldErrorMessage}
                name='lastName'
                onChange={handleInputOnChange}
                required
                size='small'
                value={generalData.lastName}
              /> 
            ) : (
              <Typography variant="h6"> {userData.lastName} </Typography> 
            )
          }
        </Box>
        <Box 
          className={
            generalIsEditable ? ( 
              styles['settings__item-container-with-input--space-between']
            ) : (
              styles['settings__item-container-with-input--flex-start']
            )
          }
        >
          <Typography variant="h6"> Email: </Typography>
          {
            generalIsEditable ? (
              <TextField
                className={styles['textfield']}
                error={!!emailErrorMessage}
                helperText={emailErrorMessage}
                name='email'
                onChange={handleInputOnChange}
                size='small'
                value={generalData.email}
              /> 
            ) : (
              <Typography variant="h6"> {userData.email} </Typography> 
            )
          }
        </Box>
        {
          generalIsEditable ? (
            <Box className={styles['settings__button-container--flex-end']}>
              <Button variant="outlined" onClick={handleCancel}> Cancel </Button>
              {
                generalIsUpdating ? (
                  <Button variant="contained" disabled> <CircularProgress size={'1.5rem'} /> </Button>
                ) : (
                  <Button name="general" variant="contained" onClick={handleSubmit}> Save </Button>
                )
              }
            </Box>
          ) : (
            null
          )
        }
      </Box>
      <Box className={styles['settings__container-with-divider--thin']}>
        <Box className={styles['settings__title-container-with-button']}>
          <Typography variant="h5"> Password </Typography>
          { !passwordIsEditable ? <Button name="password" variant="contained" onClick={handleEditClick}> Change Password </Button> : null }
        </Box>
        {
          passwordIsEditable ? (
            <div>
              <Box className={styles['settings__item-container-with-input--space-between']}>
                <Typography variant="h6"> Old Password: </Typography>
                <TextField
                  className={styles['textfield']}
                  error={!!fieldErrorMessage}
                  helperText={fieldErrorMessage}
                  name='oldPassword'
                  onChange={handleInputOnChange} 
                  size='small'
                  type="password"
                  value={passwordData.oldPassword}
                /> 
              </Box>
              <Box className={styles['settings__item-container-with-input--space-between']}>
                <Typography variant="h6"> New Password: </Typography>
                <TextField
                  className={styles['textfield']}
                  error={!!passwordErrorMessage}
                  name='newPassword'
                  onChange={handleInputOnChange} 
                  size='small'
                  type="password"
                  value={passwordData.newPassword}
                /> 
              </Box>
              <Box className={styles['settings__item-container-with-input--space-between']}>
                <Typography variant="h6"> Confirm Password: </Typography>
                <TextField
                  className={styles['textfield']}
                  error={!!passwordErrorMessage}
                  helperText={passwordErrorMessage}
                  name='confirmPassword'
                  onChange={handleInputOnChange}
                  type="password"
                  size='small'
                  value={passwordData.confirmPassword}
                /> 
              </Box>              
              <Box className={styles['settings__button-container--flex-end']}>
                <Button variant="outlined" onClick={handleCancel}> Cancel </Button>
                {
                  passwordIsUpdating ? (
                    <Button variant="contained" disabled> <CircularProgress size={'1.5rem'} /> </Button>
                  ) : (
                    <Button name="password" variant="contained" onClick={handleSubmit}> Save </Button>
                  )
                }
              </Box>
            </div>
          ) : (
            null
          )
        }
      </Box>
    </Box>
  );
}