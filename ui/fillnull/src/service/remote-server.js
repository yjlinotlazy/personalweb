import axios from 'axios';
import {Config} from '../config';

const client = axios.create({ baseURL: Config.serverUrl });

client.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error.response);
    }
)

client.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error.response);
    }
)

export const Server = {
    article: {
        getAll(category) {
            return client.get(`article/category/${Config.user}/${category}`);
        },
        get(articleId) {
            return client.get(`article/${articleId}`);
        },
        create(data) {
            return client.post('article/create', { ...data, user: Config.user }, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
        },
        update(data) {
            return client.post('article/update', { ...data, user: Config.user }, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
        },
        subCategories(category) {
            return client.get(`article/subcategories/${Config.user}/${category}`);
        },
        delete(articleId) {
            return client.get(`article/delete/${articleId}`)
        }
    },
    image: {
        delete(data) {
            return client.post('image/delete', { ...data, user: Config.user }, {
               headers: {
                   'accept': 'application/json',
                   'Content-Type': 'application/json',
               }
            })
        }
    },
    misc: {
        getCode() {
            return client.get(`misc/${Config.user}`);
        }
    },
    journal: {
        get(date) {
            return client.get(`journal/calender/${Config.user}/${date}`)
        },
        post(date) {
            return client.post(`journal/calender/${Config.user}/${date}`)
        },
    },
    timetable: {
        get(journalId) {
            return client.get(`journal/timetable/${journalId}`)
        },
        post(data) {
            return client.post('journal/timetable', { ...data, user: Config.user }, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
        },
        delete(timetableId) {
            return client.delete(`journal/timetable/${timetableId}`)
        }
    }
}