import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/';

export const sendRequest = async (method, route, body) => {
    const token = await AsyncStorage.getItem('token');
    console.log('token in request', token);
    const response = await axios.request({
        method: method,
        url: route,
        data: body,
        headers: {
            Authorization: `Bearer ${token}`,
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
