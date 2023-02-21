import { baseURL, del, get, post, put } from './api';

const api = (endpoint, url = baseURL + endpoint) => ({
    get: (setLoader, cb, options) => get(url, setLoader, cb, options),
    getById: (id, setLoader, cb, options) =>
        get(`${url}/${id}`, setLoader, cb, options),
    post: (data, setLoader, cb, options) =>
        post(url, data, setLoader, cb, options),
    put: (id, data, setLoader, cb, options) =>
        put(`${url}/${id}`, data, setLoader, cb, options),
    delete: (id, setLoader, cb, options) =>
        del(`${url}/${id}`, setLoader, cb, options),
});

export default api;