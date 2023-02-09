import http from 'utils/http';

export async function loginUser(email, password) {
  try {
    const payload = {
      email: email,
      password: password,
    }
    const res = await http.post('auth/login', payload);
    return res;
  } catch(err) {
    return err;
  }
}

export async function logoutUser() {
  try {
    const res = await http.delete('auth/logout');
    return res;
  } catch(err) {
    return err;
  }
}

export async function refreshUser() {
  try {
    const res = await http.get('auth/refresh');
    return res;
  } catch(err) {
    return err;
  }
}