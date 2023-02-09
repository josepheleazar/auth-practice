import React from "react";

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { 
  Link,
  useNavigate
} from "react-router-dom";

import { loginUser } from "api/auth";
import { useAuthContext } from 'context/AuthContext';
import { useMessageContext } from "context/MessageContext";

import styles from './Login.module.scss';

export default function Login() {
  const navigate = useNavigate();

  // Context
  const { setUserData } = useAuthContext();
  const { contextHolder, customMessage } = useMessageContext();

  // Functions
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    const res = await loginUser(email, password);
    if(res.status === 200) {
      localStorage.setItem('userToken', res.data.data.token);
      setUserData(res.data.data);
      window.location.reload(); // reload the DOM for components to reflect as auth user
      navigate("/dashboard");
    } else {
      customMessage('error', 'Login failed, please try again');
    }
  }

  // Main Function
  return(
    <Box className={styles['login__container']}>
      { contextHolder }
      <Box component="form" onSubmit={handleSubmit} padding={{ xs: 3, md: 1 }}>
        <TextField
          autoComplete="email"
          autoFocus
          fullWidth
          id="email"
          name="email"
          placeholder="Email Address"
          required
          sx={{ zIndex: 2,}}
        />
        <TextField
          autoComplete="current-password"
          fullWidth
          id="password"
          margin="normal"
          name="password"
          placeholder="Password"
          required
          type="password"
        />
        <Button
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          type="submit"
          variant="contained"
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            &nbsp;
          </Grid>
          <Grid item>
            <Link to='/register'>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}