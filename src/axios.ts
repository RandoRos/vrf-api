import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create(<AxiosRequestConfig>{
  retry: Number(process.env.AXIOS_RETRY_COUNT),
});

instance.interceptors.response.use(undefined, err => {
  const { config } = err;

  // if we reach retry limit, we still propagate error
  if (!config?.retry) {
    return Promise.reject(err);
  }
  
  config.retry -= 1;

  return new Promise((resolve) => resolve(axios(config)));
});

export default instance;
