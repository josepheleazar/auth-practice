import React, { useState } from "react";

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { registerUser } from "api/user";
import { useMessageContext } from "context/MessageContext";

import styles from './Register.module.scss';

export default function Register() {
  const navigate = useNavigate();

  // Context
  const { contextHolder, customMessage } = useMessageContext();

  // Local States
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);

  // Functions
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Setting of variables
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    // Validations
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(email)) {
      setEmailErrorMessage('Email invalid');
      return;
    } 
    if(password !== confirmPassword) {
      setPasswordErrorMessage('Password mismatched');
      return;
    }
    
    // Action
    const res = await registerUser(payload);
    if(res.status === 200) {
      customMessage('error', 'Registration completed. Please log in to verify your credentials.'); // BUG CAN'T SHOW MODAL
      setEmailErrorMessage(null);
      setPasswordErrorMessage(null);
      navigate("/login");
    } else {
      customMessage('error', 'Register failed, please try again');
      console.log('Views/Register - handleSubmit Failed: ', res);
    }
  }

  // Main Function
  return(
    <Box className={styles['register__container']}>
      { contextHolder }
      <Box
        component="form"
        onSubmit={handleSubmit}
        padding={{ xs: 3, md: 1 }}
      >
        <TextField
          autoFocus
          fullWidth
          id="firstName"
          name="firstName"
          placeholder="First Name"
          required
          sx={{ zIndex: 2, mb: 2}}
        />
        <TextField
          autoFocus
          fullWidth
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          required
          sx={{ zIndex: 2, mb: 2}}
        />
        <TextField
          autoComplete="email"
          autoFocus
          error={!!emailErrorMessage}
          fullWidth
          helperText={emailErrorMessage}
          id="email"
          name="email"
          placeholder="Email Address"
          required
          sx={{ zIndex: 2, }}
        />
        <TextField
          error={!!passwordErrorMessage}
          fullWidth
          id="password"
          margin="normal"
          name="password"
          placeholder="Password"
          required
          type="password"
        />
        <TextField
          error={!!passwordErrorMessage}
          fullWidth
          helperText={passwordErrorMessage}
          id="confirmPassword"
          margin="normal"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          type="password"
        />
        <Button
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          type="submit"
          variant="contained"
        >
          Register
        </Button>
        <Grid container>
          <Grid item xs>
            &nbsp;
          </Grid>
          <Grid item>
            <Link to='/login'>
              {"Already have an account? Log in"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}