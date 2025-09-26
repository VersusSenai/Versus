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
          await api.post("/auth/refresh-token",
            {},
            { withCredentials: true }
          )
            return api(originalRequest);
            
          } 
          catch (err) {
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