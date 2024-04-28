import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = 'http://192.168.1.102:8000/api/';

export const sendRequest = async (method, route, body) => {
    const token = await AsyncStorage.getItem('token');
    console.log('Token in sendRequest:', token);
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
    // try {
    // } catch (error) {
    //     // if (error.response) {
    //     //     console.log(error.response.data);
    //     //     console.log(error.response.status);
    //     //     console.log(error.response.headers);
    //     // } else if (error.request) {
    //     //     console.log(error.request);
    //     // } else {
    //     //     console.log('Error', error.message);
    //     // }
    //     // console.log(error.config);

    //     console.log('Error in Request', error);

    //     if (error.response) {
    //         console.log('Error Details', error.response.data.error);
    //         console.log('Errors Details', error.response.data.errors);
    //         console.log('Error Message', error.response.data.message);
    //     }
    // }
};

export const requestMethods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

export const profilePicturesUrl = 'http://192.168.1.102:8000/profile-pictures/';
export const defaultAvatar = require('../../assets/avatar.png');
export const showsPicturesUrl = 'http://192.168.1.102:8000/show-pictures/'
