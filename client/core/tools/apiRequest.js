import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/';

export const sendRequest = async (method, route, body) => {
    const response = await axios.request({
        method: method,
        url: route,
        data: body,
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            Accept: 'application/json',
        },
    });

    return response;
};

export const requestMethods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
};
