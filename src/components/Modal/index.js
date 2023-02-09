import React from "react";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '80vw', md: '40vw' },
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '20px',
  boxShadow: 24,
  p: 2,
};

export default function CustomModal(props) {
  const {
    children,
    open,
    setOpen,
  } = props;

  const handleClose = () => setOpen(false);

  return(
    <Modal 
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        { children }
      </Box>
    </Modal>
  )
}