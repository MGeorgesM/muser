import { useEffect } from 'react';
import { setVenues } from '../../core/data/store/Venues';
import { useSelector, useDispatch } from 'react-redux';
import { requestMethods, sendRequest } from '../../core/tools/apiRequest';

const useVenuesLogic = () => {
    const dispatch = useDispatch();
    const venues = useSelector((global) => global.venuesSlice.venues);

    useEffect(() => {
        getVenues();
    }, []);

    const getVenues = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, 'users/type/venue', null);
            if (response.status !== 200) throw new Error('Failed to fetch venues');
            dispatch(setVenues(response.data.feedUsers));
        } catch (error) {
            console.log('Error fetching venues:', error);
        }
    };

    return {
        venues,
        getVenues,
    };
};

export default useVenuesLogic;
