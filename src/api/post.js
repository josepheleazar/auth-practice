import QueryString from 'qs';

import http from 'utils/http';

export async function createPost(payload) {
  // payload = { title: string, message: string }
  try {
    const res = await http.post('post/', payload);
    return res;
  } catch(err) {
    return err;
  }
}

export async function getPostsWithQuery(query) {
  /*
    Query Structure:
    "totalPages": 2,
    "totalRows": 9,
    "limit": "10",
    "offset": 0,
    "order": "DESC",
    "orderBy": "createdAt"
  */
  try {
    const convertedQueryString = QueryString.stringify(query);
    const res = await http.get('post/?' + convertedQueryString);
    return res;
  } catch(err) {
    return err;
  }
}

export async function updatePost(id, payload) {
  // payload = { title?: string, message?: string }
  try {
    const res = await http.put(`post/${id}`, payload);
    return res;
  } catch(err) {
    return err;
  }
}

export async function deletePost(id) {
  try {
    const res = await http.delete(`post/${id}`);
    return res;
  } catch(err) {
    return err;
  }
}