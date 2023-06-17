import Config from "../config"
import { removeSlash } from "./utils";

const getBaseConfig = (method: any) => ({
  method,
  headers: { 'Content-Type': 'application/json' }
});

export const get = (url: string, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, { ...getBaseConfig('get'), ...options })
    .then(resp => resp.json())

export const post = (url: string, data: any, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, {
    ...getBaseConfig('post'),
    ...options,
    body: (data instanceof FormData) ? data : JSON.stringify(data)
  }).then(resp => resp.json())

export const loadConversationsApi = () => {
  return get('/conversations');
}

export const uploadFileApi = (conv_id: number, file: any) => {
  const formData = new FormData();
  formData.append("file", file);

  return post(`/conversations/${conv_id}/upload`, formData);
}

export const sendMessageApi = (conv_id: number, message: string) => {
  return post(`/conversations/${conv_id}/message`, {
    prompt: message,
  });
}
