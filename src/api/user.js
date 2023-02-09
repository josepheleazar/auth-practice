import http from 'utils/http';

export async function registerUser(payload) {
  // payload = {
  //   firstName: string
  //   lastName: string
  //   email: string
  //   password: string
  // }
  try {
    const res = await http.post('user/signup', payload);
    return res;
  } catch(err) {
    return err;
  }
}

export async function updateUser(payload) {
  // payload = {
  //   firstName: string
  //   lastName: string
  //   email: string
  // }
  try {
    const res = await http.put('user/', payload);
    return res;
  } catch(err) {
    return err;
  }
}
export async function updateUserPassword(payload) {
  // payload = {
  //   oldPassword: string
  //   newPassword: string
  //   confirmPassword: string
  // }
  try {
    const res = await http.put('user/password', payload);
    return res;
  } catch(err) {
    return err;
  }
}