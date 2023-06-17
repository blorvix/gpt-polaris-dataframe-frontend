import Config from "../config"
import { removeSlash } from "./utils";

const getBaseConfig = (method: any) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ` + localStorage.getItem("token")?.replaceAll('"', '')
  },
});

const handleResponse = (resp: any) => {
  if (!resp.ok) {
    throw resp.text();
  }
  return resp.json();
}

export const get = (url: string, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, { ...getBaseConfig('get'), ...options })
    .then(handleResponse)

export const post = (url: string, data: any, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, {
    ...getBaseConfig('post'),
    ...options,
    body: (data instanceof FormData) ? data : JSON.stringify(data)
  }).then(handleResponse)

export const loadUserInfoApi = () => {
  return get('/user/info')
}

export const loadConversationsApi = () => {
  return get('/conversations/');
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

export const validateTokenAndCreateUser = (id_token: string) => {
  return post('auth/login', {id_token});
};
