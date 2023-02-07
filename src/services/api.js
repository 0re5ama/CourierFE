import { request } from '@umijs/max';
import { notification } from 'antd';
const loginPath = '/user/login';

export const baseURL = process.env.baseURL || 'https://localhost:7270/api';
export async function get(url, setLoader, cb = () => {}, options) {
    const token = localStorage.getItem('token');
    try {
        if (setLoader) setLoader(true);
        const res = await request(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            ...options,
        });
        cb(res?.data);
        if (setLoader) setLoader(false);
        return res || {};
    } catch (ex) {
        console.log(ex);
        switch (ex.response.status) {
            case 500:
            case 404:

            case 401:
                notification['error']({
                    message: 'Error',
                    description: ex.response.statusText,
                });

            default:
                break;
        }
        return null;
    }
}

export async function post(url, data, setLoader, cb = () => {}, options = {}) {
    const token = localStorage.getItem('token');

    try {
        if (setLoader) setLoader(true);
        const res = await request(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            data,
            ...options,
        });
        cb(res?.data);
        if (setLoader) setLoader(false);
        if (res.message)
            notification[res.isSuccess ? 'success' : 'error']({
                message: res.message,
            });
        return res || {};
    } catch (ex) {
        console.log(ex);
        switch (ex.response.status) {
            case 500:
            case 404:

            case 401:
                notification['error']({
                    message: 'Error',
                    description: ex.response.statusText,
                });

            default:
                break;
        }
        return null;
    }
}

export async function put(url, data, setLoader, cb = () => {}, options = {}) {
    const token = localStorage.getItem('token');

    try {
        if (setLoader) setLoader(true);
        const res = await request(url, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            data,
            ...options,
        });
        cb(res?.data);
        if (setLoader) setLoader(false);
        if (res.message)
            notification[res.isSuccess ? 'success' : 'error']({
                message: res.message,
            });
        return res || {};
    } catch (ex) {
        console.log(ex);
        switch (ex.response.status) {
            case 500:
            case 404:

            case 401:
                notification['error']({
                    message: 'Error',
                    description: ex.response.statusText,
                });

            default:
                break;
        }
        return null;
    }
}

export async function del(url, setLoader, cb = () => {}, options) {
    const token = localStorage.getItem('token');
    try {
        if (setLoader) setLoader(true);
        const res = await request(url, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
            },

            ...options,
        });
        cb(res?.data);
        if (setLoader) setLoader(false);
        return res || {};
    } catch (ex) {
        console.log(ex);
        switch (ex.response.status) {
            case 500:
            case 404:
            case 401:
                notification['error']({
                    message: 'Error',
                    description: ex.response.statusText,
                });
            default:
                break;
        }
    }
}
