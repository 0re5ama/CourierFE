import { baseURL, get, post } from '../api';
import api from '../genericService';

export default {
    role: api('/security/role'),
    user: api('/security/User'),
    application: () => get(baseURL + '/security/application'),
    applicationwithmod: () => get(baseURL + '/security/application/appwithmod'),
    moduleFunction: (id) => get(baseURL + '/security/module/' + id),
    officeWithUser: (id, setLoader) =>
        get(baseURL + '/security/Office/officeUser/' + id, setLoader),
    office: api('/Office'),
    login: (data) => post(baseURL + '/Auth/authenticate', data),
    currentUser: (options) => get(baseURL + '/Auth', options),
    enum: {
        officeType: () => get(baseURL + '/officeType'),
        status: () => get(baseURL + '/Status'),
    },
    menu: () => get(baseURL + '/Security/Menu'),
};
