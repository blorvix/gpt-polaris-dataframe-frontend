import Config from "../config"
import { UploadedFileHowto } from "#/types/chat";
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

export const uploadFileApi__ = (conv_id: number, files: any) => {
  const formData = new FormData();
  for (const file of files)
    formData.append("files[]", file);

  return postFormJson(`/conversations/${conv_id}/upload`, formData);
}

export const saveDataFilesApi = (conv_id: number, howtos: UploadedFileHowto[]) => {
  return postJson(`/conversations/${conv_id}/save_files`, {
    filelists: howtos
  })
}

export const sendMessageApi = (conv_id: number, message: string) => {
  return postJson(`/conversations/${conv_id}/messages`, {
    content: message,
  });
}

export const regenerateMessageApi = (conv_id: number) => {
  return postJson(`/conversations/${conv_id}/messages/regenerate`);
}

export const forceAddMessageApi = (conv_id: number, role: string, text: string) => {
  return postJson(`/conversations/${conv_id}/force_message`, {
    role,
    text,
  });
}

export const validateTokenAndCreateUser = (id_token: string) => {
  return postJson('auth/login', {id_token});
};

export const getDatasetSummaryApi = (conv_id: number, dataset_id: number, ask: string) => {
  return postJson(`/conversations/${conv_id}/summary/${dataset_id}/ask`, {ask});
}

export const getVizHelpApi = (conv_id: number, dataset_id: number, ask: string) => {
  return postJson(`/conversations/${conv_id}/vizhelp/${dataset_id}/ask`, {ask});
}

export const askCleanupApi = (conv_id: number, dataset_id: number, ask: string) => {
  return postJson(`/conversations/${conv_id}/cleanup/${dataset_id}/ask`, {ask});
}

export const performCleanupApi = (conv_id: number, dataset_id: number, answers: string[]) => {
  return postJson(`/conversations/${conv_id}/cleanup/${dataset_id}/perform`, {answers});
}

export const loadDatasetsApi = () => {
  return getJson(`/datasets/`);
}

export const uploadDatafileApi = (dataset_id: number, file: File, possible: number[]) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append('possible', possible.join(','))
  return postFormJson(`/datasets/${dataset_id}/upload`, formData);
}

export const overwriteDatafileApi = (datafile_id: number, dataset_id: number, decision: string) => {
  return postJson(`/datasets/${dataset_id}/overwrite/${datafile_id}`, { decision })
}

export const createAnotherDatasetApi = (datafile_id: number, create: boolean) => {
  return postJson(`/datasets/create_another_dataset`, {datafile: datafile_id, create: create ? '1' : '0'})
}

export const getDatafilesApi = (dataset_id: number) => {
  return getJson(`/datasets/${dataset_id}/datafiles`)
}

export const getDatafileFirstRowsApi = (datafile_id: number) => {
  return getJson(`/datasets/datafiles/${datafile_id}/first_rows`)
}
