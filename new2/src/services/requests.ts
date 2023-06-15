import Config from "../config"
import { removeSlash } from "./utils";

const getBaseConfig = (method: any) => ({
  method,
  headers: { 'Content-Type': 'application/json' }
});

export const get = (url: string, options: any = {}) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, { ...getBaseConfig('get'), ...options })

export const post = (url:string, data: any, options: any) =>
  fetch(`${Config.API_URL}/${removeSlash(url)}`, {
    ...getBaseConfig('post'),
    ...options,
    body: JSON.stringify(data)
  }).then(resp => resp.json())
