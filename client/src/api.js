import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {

      const { status } = error.response;
      if (status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await axios.post(
            "http://localhost:8080/auth/refresh-token",
            {},
            { withCredentials: true }
          ).then((res) => {
            console.log(res)
              return api(originalRequest);
            
          });
          } catch (err) {
            console.log(err)
            if(err.response && err.response.status === 400 || err.response.status === 401){
              window.location.href = "/login";
            }
            return Promise.reject(err);
          }
      }
    }
  }

)



export default api;