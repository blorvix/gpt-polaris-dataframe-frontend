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

export const get = (url: string, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, { ...getBaseConfig('get'), ...options })
export const getJson = (url: string, options: any = {}) => get(url, options).then(data => data.json())

const post = (url: string, data: any = {}, options: any = {}) => {
  return fetch(`${Config.API_URL}/${removeSlash(url)}`, {
    ...getBaseConfig('post'),
    ...options,
    body: (data instanceof FormData) ? data : JSON.stringify(data)
  })
}
const postJson = (url: string, data: any = {}, options: any = {}) => post(url, data, options).then(data => data.json())

const _delete = (url: string, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, { ...getBaseConfig('delete'), ...options })
const _deleteJson = (url: string, options: any = {}) => _delete(url, options).then(data => data.json())

export const postForm = (url: string, data: any, options: any = {}) => {
  return fetch(`${Config.API_URL}/${removeSlash(url)}`, {
    ...getBaseConfig('post', true),
    ...options,
    body: data
  })
}
const postFormJson = (url: string, data: any, options: any = {}) => postForm(url, data, options).then(data => data.json())

export const loadUserInfoApi = () => {
  return get('/user/')
}

export const saveUserInfoApi = (data: any) => {
  return postJson('/user/', data)
}

export const loadConversationsApi = () => {
  return getJson('/conversations/');
}

export const newConversationApi = () => {
  return postJson('/conversations/');
}

export const getConversationApi = (conv_id: number) => {
  return getJson(`/conversations/${conv_id}/`);
}

export const deleteConversationApi = (conv_id: number) => {
  return _deleteJson(`/conversations/${conv_id}/`);
}

export const loadMessagesApi = (conv_id: number) => {
  return getJson(`/conversations/${conv_id}/messages`);
}

export const uploadFileApi = (conv_id: number, files: any) => {
  const formData = new FormData();
  for (const file of files)
    formData.append("files[]", file);

  return postFormJson(`/conversations/${conv_id}/upload`, formData);
}

export const sendMessageApi = (conv_id: number, message: string) => {
  return postJson(`/conversations/${conv_id}/messages`, {
    text: message,
  });
}

export const validateTokenAndCreateUser = (id_token: string) => {
  return postJson('auth/login', {id_token});
};

export const getDatasetSummaryApi = (conv_id: number, file_id: number, file_name: string, wanted: boolean) => {
  return postJson(`/conversations/${conv_id}/summary/${file_id}`, {file_name, wanted});
}
