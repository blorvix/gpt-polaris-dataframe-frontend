import { toast } from 'react-toastify';

export const notifyError = (error: string, options?: any) => {
  error = error || 'Something went wrong.';
  console.log(error)
  toast.error(error.toString(), options);
};
