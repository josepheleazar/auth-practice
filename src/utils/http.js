import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1/',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(function(config) {
  const token = localStorage.getItem('userToken');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
})

// axiosInstance.interceptors.response.use(function(response) {
//   if(response.status === 200) {
//     return Promise.resolve(response);
//   } else if(reponse)
//   if()
//   return Promise.resolve(response);
// }, function(error){
//   return Promise.reject(error);
// })



export default axiosInstance;