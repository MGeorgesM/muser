import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = 'http://13.37.46.115/api/';

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

export const sendNotification = async (userIds, body, title = null) => {
    try {
        const response = await sendRequest(requestMethods.POST, `notifications`, {
            userIds,
            title,
            body,
        });

        if (response.status !== 200) throw new Error('Failed to send notification');
    } catch (error) {
        console.log('Error sending notification:', error);
    }
};

export const defaultAvatar = 'http://13.37.46.115/default/logowhite.png';
export const showsPicturesUrl = 'http://13.37.46.115/show_pictures/';
export const profilePicturesUrl = 'http://13.37.46.115/profile_pictures/';
