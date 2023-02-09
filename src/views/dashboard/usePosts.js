import React, { useEffect, useState } from "react";
import { 
  createPost as createPostAPI, 
  getPostsWithQuery as getPostAPI,
  updatePost as updatePostAPI,
  deletePost as deletePostAPI,
} from "api/post";

import { useAuthContext } from "context/AuthContext";
import { useSearchParams } from "react-router-dom";

export default function usePosts() {
  // Context
  const { userLogout } = useAuthContext();
  
  // Local States
  const [posts, setPosts] = useState([]);
  const [postMeta, setPostMeta] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
    order: 'ASC',
    orderBy: 'postId',
  });

  // always populate the data using the first 10 rows
  useEffect(() => {
    getPosts(query.limit, query.offset, query.order, query.orderBy);
  }, []);

  // populate the data according to query returned by the dashboard page
  useEffect(() => {
    getPosts(query.limit, query.offset, query.order, query.orderBy);
  }, [query]);

  async function getPosts(limit, offset, order, orderBy) {
    setIsLoading(true);
    const query = {
      limit: limit,
      offset: offset,
      order: order,
      orderBy: orderBy,
    };
    const res = await getPostAPI(query);
    if(res.status === 200) {
      setPostMeta(res.data.meta);
      setPosts(res.data.data);
      setIsLoading(false);
    } else if (res.response?.status === 403) {
      console.log('User Token Expired, Logging out...', res.message ?? res.response?.message);
      await userLogout();
    } else {
      setIsLoading(false);
      console.log('views/dashboard/usePosts - getFirstPost Error: ', res.message ?? res.response?.message);
    }
  }

  async function createPost(payload) {
    setIsCreating(true);
    const res = await createPostAPI(JSON.stringify(payload));
    if(res.status === 200) {
      setIsCreating(false);
      getPosts(10, 0, 'ASC', 'postId');
      return res;
    } else if (res.response?.status === 403) {
      console.log('User Token Expired, Logging out...', res.message ?? res.response?.message);
      await userLogout();
    } else {
      setIsCreating(false);
      console.log('views/dashboard/usePosts - createPost Error: ', res.message ?? res.response?.message);
    }
  }

  async function updatePost(postId, payload) {
    setIsUpdating(true);
    const res = await updatePostAPI(postId, JSON.stringify(payload));
    if(res.status === 200) {
      setIsUpdating(false);
      getPosts(10, 0, 'ASC', 'postId');
      return res;
    } else if (res.response?.status === 403) {
      console.log('User Token Expired, Logging out...', res.message ?? res.response?.message);
      await userLogout();
    } else {
      setIsUpdating(false);
      console.log('views/dashboard/usePosts - updatePost Error: ', res.message ?? res.response?.message);
    }
  }

  async function deletePost(postId) {
    setIsDeleting(true);
    const res = await deletePostAPI(postId);
    if(res.status === 200) {
      setIsDeleting(false);
      getPosts(10, 0, 'ASC', 'postId');
      return res;
    } else if (res.response?.status === 403) {
      console.log('User Token Expired, Logging out...', res.message ?? res.response?.message);
      await userLogout();
    } else {
      setIsDeleting(false);
      console.log('views/dashboard/usePosts - deletePost Error: ', res.message ?? res.response?.message);
    }
  }

  return {
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
  }
}