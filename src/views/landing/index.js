import React from "react";

import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";

import styles from './Landing.module.scss';

export default function Landing() {
  return(
    <Box className={styles['landing__container']}>
      <Typography> Greetings! </Typography>
    </Box>
  );
}