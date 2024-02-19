// api.ts
import axios, { AxiosError } from 'axios';
import https from 'https';

// api.ts
// api.ts
const api = axios.create({
  baseURL: 'https://marsworld.co.in/api/hr/',
});

const attendanceApi = axios.create({
  baseURL: 'https://marsworld.co.in/face',
});


export type RequestError = AxiosError & {
  response: {
    data: {
      success: boolean;
      message?: string;
      error?: any;
    };
  };
};

interface IShowErrorMessage {
  error: RequestError;
}

export const showErrorMessage = (data: IShowErrorMessage) => {
  const { error } = data || {};

  let message;
  if (
    Array.isArray(error?.response?.data?.message) &&
    error?.response?.data?.message.length > 0
  ) {
    message = error?.response?.data?.message[0];
  } else {
    message = error?.response?.data?.message || data?.error?.message || 'Something went wrong';
  }

  // You can use react-toastify or any other error handling mechanism here
  console.error(message);
};

export default api;
