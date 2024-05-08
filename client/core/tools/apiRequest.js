import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = 'http://192.168.1.102:8000/api/';

export const sendRequest = async (method, route, body) => {
    const token = await AsyncStorage.getItem('token');
    
    try {
        const response = await axios.request({
            method: method,
            url: route,
            data: body,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.log('AXIOS Error during HTTP request:', error);
        if (error.response) {
            console.log('AXIOS Response error:', error.response.data);
        }
        throw error;
    }
};

export const requestMethods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

export const defaultAvatar = 'http://192.168.1.102:8000/default/logowhite.png';
export const showsPicturesUrl = 'http://192.168.1.102:8000/show_pictures/';
export const profilePicturesUrl = 'http://192.168.1.102:8000/profile_pictures/';
