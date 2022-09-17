import { AxiosInstance, AxiosStatic } from "axios";

export const initAxiosMiddleware = (axios: AxiosStatic | AxiosInstance) => {
  axios.interceptors.response.use(undefined, err => {
    const { config } = err;
  
    if (!config?.retry) {
      return Promise.reject(err);
    }
    
    config.retry -= 1;
  
    return new Promise((resolve) => resolve(axios(config)));
  });
};
