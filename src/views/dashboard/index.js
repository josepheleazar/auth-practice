import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from '@mui/material/Paper';
import { isEmpty } from "lodash";
import moment from "moment";

import usePosts from "./usePosts";

import CustomModal from "components/Modal";
import { useMessageContext } from "context/MessageContext";

import styles from './Dashboard.module.scss';

import { useLocation, useSearchParams } from 'react-router-dom';

import QueryString from "qs";

export default function Dashboard() {
  const location = useLocation();

  // Context
  const { contextHolder, customMessage } = useMessageContext();

  // Custom Hook
  const {
    postMeta,
    posts,
    isCreating,
    isLoading,
    isUpdating,
    isDeleting,
    query,
    createPost,
    getPosts,
    updatePost,
    deletePost,
    setQuery,
  } = usePosts();

  // Local States
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [modalType, setModalType] = useState('create');
  const [searchParams, setSearchparams] = useSearchParams();
  
  useEffect(() => {
    if(location.search !== ''){
      const offset = Number(searchParams.get('offset'));
      const limit = Number(searchParams.get('limit'));
      const order = searchParams.get('order');
      const orderBy = searchParams.get('orderBy');

      setQuery({
        ...query,
        limit: limit > 0 ? limit : query.limit,
        offset: offset > 0 ? offset : query.offset,
        order: order ?? query.order,
        orderBy: orderBy ?? query.orderBy,
      });
    } 
  }, [location.search]);

  // Functions
  const handleChangePage = async (event, offset) => {
    setSearchparams({
      offset: offset,
    })
    setQuery({
      ...query,
      offset: offset,
    });
    
    setPage(offset);
  };

  // Functions for New
  const handleAddClick = () => {
    setModalType('create');
    setOpenModal(true);
  }

  // Functions For Edit
  const handleEditClick = (event) => {
    setModalType('edit');
    setSelectedID(event.target.name);
    setOpenModal(true);
  };

  // Functions For Delete
  function handleDeleteClick(event) {
    setModalType('delete');
    setSelectedID(event.target.name);
    setOpenModal(true);
  };

  // General Functions for Forms in Modal
  const handleCancel = () => setOpenModal(false);

  const handleSubmit = async (e) => {
    switch(modalType) {
      case 'create': {
        e.preventDefault();
        const title = e.target.title.value;
        const message = e.target.message.value;
        const payload = { 
          title: title, 
          message: message,
        };
        try {
          const res = await createPost(payload);
          if(res.status === 200) {
            customMessage('success', 'Post created');
            setOpenModal(false);
          } else {
            customMessage('error', 'Error: ' + res.message ?? res.response?.message);
          }
        } catch(err) {
          customMessage('error', 'Error: Post creation failed');
          console.log(err);
        }
        break;
      }
      case 'edit': {
        e.preventDefault();
        const title = e.target.title.value;
        const message = e.target.message.value;
        const payload = { 
          title: title, 
          message: message,
        };
        try {
          const res = await updatePost(selectedID, payload);
          if(res.status === 200) {
            customMessage('success', 'Post updated');
            setOpenModal(false);
          } else {
            customMessage('error', 'Error: ' + res.message ?? res.response?.message);
          }
        } catch(err) {
          customMessage('error', 'Error: Post update failed');
          console.log(err);
        }
        break;
      }
      case 'delete': {
        e.preventDefault();
        try {
          const res = await deletePost(selectedID);
          if(res.status === 200) {
            customMessage('success', 'Post deleted');
            setOpenModal(false);
          } else {
            customMessage('error', 'Error: ' + res.message ?? res.response?.message);
          }
        } catch(err) {
          customMessage('error', 'Error: Post deletion failed');
          console.log(err);
        }
        break;
      }
    }
  }

  function RenderModal() {
    switch(modalType) {
      case 'create': {
        return(
          <form className={styles['dashboard__form-container']} onSubmit={handleSubmit}>
            <Box className={styles['dashboard__forms__label-input-container']}>
              <Typography> Title: </Typography>
              <TextField type='text' name='title' className={styles['textfield']} required />
            </Box>
            <Box className={styles['dashboard__forms__label-input-container']}>
              <Typography> Message: </Typography>
              <TextField type='text' name='message' className={styles['textfield']} required />
            </Box>
            <footer>
              <Box className={styles['dashboard__actions-footer-container']}>
                <Button variant="outlined" className={styles['warning']} onClick={handleCancel}> Cancel </Button>
                {
                  isCreating ? (
                    <Button variant="contained" type='submit' disabled> <CircularProgress size={'1rem'} /> </Button>
                  ) : (
                    <Button variant="contained" type='submit'> Add </Button>
                  )
                }
              </Box>
            </footer>
          </form>
        );
      }
      case 'edit': {
        return(
          <form className={styles['dashboard__form-container']} onSubmit={handleSubmit}>
            <Box className={styles['dashboard__forms__label-input-container']}>
              <Typography> Title: </Typography>
              <TextField 
                type='text'
                name='title'
                className={styles['textfield']}
                defaultValue={posts[posts.findIndex(post => post.postId === selectedID)].title}
                required
              />
            </Box>
            <Box className={styles['dashboard__forms__label-input-container']}>
              <Typography> Message: </Typography>
              <TextField
                type='text'
                name='message'
                className={styles['textfield']}
                defaultValue={posts[posts.findIndex(post => post.postId === selectedID)].message}
                required
              />
            </Box>
            <footer>
              <Box className={styles['dashboard__actions-footer-container']}>
                <Button variant="outlined" className={styles['warning']} onClick={handleCancel}> Cancel </Button>
                {
                  isUpdating ? (
                    <Button variant="contained" type='submit' disabled> <CircularProgress size={'1rem'} /> </Button>
                  ) : (
                    <Button variant="contained" type='submit'> Save </Button>
                  )
                }
              </Box>
            </footer>
          </form>
        );
      }
      case 'delete': {
        return(
          <form className={styles['dashboard__form-container']} onSubmit={handleSubmit}>
            <Typography> Are you sure you want to delete this post? </Typography>
              
            <footer>
              <Box className={styles['dashboard__actions-footer-container']}>
                <Button variant="outlined" className={styles['warning']} onClick={handleCancel}> Cancel </Button>
                {
                  isDeleting ? (
                    <Button variant="contained" type='submit' disabled> <CircularProgress size={'1rem'} /> </Button>
                  ) : (
                    <Button variant="contained" type='submit'> Yes </Button>
                  )
                }
              </Box>
            </footer>
          </form>
        );
      }
    }
  }

  return(
    <>
      { contextHolder }
      {
        isLoading ? (
          <Box className={styles['dashboard__loading__container']}>
            <CircularProgress />
          </Box>
        ) : (
          <Box className={styles['dashboard__container']}>
            <CustomModal children={RenderModal()} open={openModal} setOpen={setOpenModal} />
            <Box className={styles['dashboard__button-container']}>
              <Button variant="contained" onClick={handleAddClick}> Add post </Button>
            </Box>
            <TableContainer component={Paper} sx={{ minHeight: '80vh', marginBottom: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell> ID </TableCell>
                    <TableCell> Title </TableCell>
                    <TableCell> Message </TableCell>
                    <TableCell> Created At </TableCell>
                    <TableCell> Updated At </TableCell>
                    <TableCell> Actions </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    isEmpty(posts) ? (
                      <TableRow> 
                        <TableCell 
                          align={'center'}
                          colSpan={6}
                          height={'100vh'}
                          width={'100%'}
                        >
                          No Posts Found
                        </TableCell>
                      </TableRow> 
                    ) : (
                      posts.map((post) => (
                        <TableRow
                          key={post.postId}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell> {post.postId} </TableCell>
                          <TableCell> {post.title} </TableCell>
                          <TableCell> {post.message} </TableCell>
                          <TableCell> {moment(post.createdAt).format('LLLL')} </TableCell>
                          <TableCell> {moment(post.updateAt).format('LLLL')}  </TableCell>
                          <TableCell> 
                            <Box className={styles['dashboard__actions-container']}>
                              <Button name={post.postId} variant="contained" onClick={handleEditClick}> Edit </Button>
                              <Button name={post.postId} variant="contained" onClick={handleDeleteClick} className={styles['warning']}> Delete </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Box className={styles['dashboard__button-container']}>
              <TablePagination
                component="div"
                count={Number(postMeta?.totalRows) || 0}
                page={query.offset}
                onPageChange={handleChangePage}
                rowsPerPage={query.limit}
                rowsPerPageOptions={[]}
              />
            </Box>
          </Box>
        )
      }
    </>
  );
}