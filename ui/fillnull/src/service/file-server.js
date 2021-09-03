import axios from 'axios';
import {Config} from '../config';

const fileClient = axios.create({ baseURL: Config.ftpUrl })

fileClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error.response);
    }
)

fileClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error.response);
    }
)

export const FileServer = {
    file: {
        getText(category, filename) {
            return fileClient.get(`${Config.user}/article/${category}/${filename}.txt`);
        }
    }
}
