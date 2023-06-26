import Config from "../config"
import { removeSlash } from "./utils";

const getBaseConfig = (method: any, noContentType = false) => {
  const token = `Token ` + localStorage.getItem("token")?.replaceAll('"', '');
  
  return {
    method,
    headers: noContentType ? {
      'Authorization': token,
    } : {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  }
};

const handleResponse = async (resp: any) => {
  const text = await resp.text()
  if (!resp.ok) {
    throw "error occured"
  }
  try {
    return JSON.parse(text)
  } catch {
    return text;
  }
}

export const get = (url: string, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, { ...getBaseConfig('get'), ...options })
    .then(handleResponse)

export const post = (url: string, data: any = {}, options: any = {}) => {
  return fetch(`${Config.API_URL}/${removeSlash(url)}`, {
    ...getBaseConfig('post'),
    ...options,
    body: (data instanceof FormData) ? data : JSON.stringify(data)
  }).then(handleResponse)
}

export const _delete = (url: string, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, { ...getBaseConfig('delete'), ...options })
    .then(handleResponse)

export const postForm = (url: string, data: any, options: any = {}) => {
  return fetch(`${Config.API_URL}/${removeSlash(url)}`, {
    ...getBaseConfig('post', true),
    ...options,
    body: data
  }).then(handleResponse)
}

export const loadUserInfoApi = () => {
  return get('/user/')
}

export const saveUserInfoApi = (data: any) => {
  return post('/user/', data)
}

export const loadConversationsApi = () => {
  return get('/conversations/');
}

export const newConversationApi = () => {
  return post('/conversations/');
}

export const deleteConversationApi = (conv_id: number) => {
  return _delete(`/conversations/${conv_id}/`);
}

export const loadMessagesApi = (conv_id: number) => {
  return get(`/conversations/${conv_id}/messages`);
}

export const uploadFileApi = (conv_id: number, file: any) => {
  const formData = new FormData();
  formData.append("file", file);

  return postForm(`/conversations/${conv_id}/upload`, formData);
}

export const sendMessageApi = (conv_id: number, message: string) => {
  return post(`/conversations/${conv_id}/messages`, {
    text: message,
  });
}

export const validateTokenAndCreateUser = (id_token: string) => {
  return post('auth/login', {id_token});
};

export const getDatasetSummaryApi = (conv_id: number, file_id: number, file_name: string, wanted: boolean) => {
  return post(`/conversations/${conv_id}/summary/${file_id}`, {file_name, wanted});
}
