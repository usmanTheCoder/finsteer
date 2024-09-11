import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: toast.ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showSuccessNotification = (message: string) => {
  toast.success(message, { ...defaultOptions, type: toast.TYPE.SUCCESS });
};

export const showErrorNotification = (message: string) => {
  toast.error(message, { ...defaultOptions, type: toast.TYPE.ERROR });
};

export const showWarningNotification = (message: string) => {
  toast.warn(message, { ...defaultOptions, type: toast.TYPE.WARNING });
};

export const showInfoNotification = (message: string) => {
  toast.info(message, { ...defaultOptions, type: toast.TYPE.INFO });
};

export const showDefaultNotification = (message: string) => {
  toast(message, defaultOptions);
};