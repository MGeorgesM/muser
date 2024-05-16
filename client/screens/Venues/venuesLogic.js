import { useEffect } from 'react';
import { setVenues } from '../../store/Venues';
import { useSelector, useDispatch } from 'react-redux';
import { requestMethods, sendRequest } from '../../core/tools/apiRequest';

const useVenuesLogic = () => {
    const dispatch = useDispatch();
    const venues = useSelector((global) => global.venuesSlice.venues);

    useEffect(() => {
        const getVenues = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'users/type/venue', null);
                if (response.status !== 200) throw new Error('Failed to fetch venues');
                dispatch(setVenues(response.data.feedUsers));
            } catch (error) {
                console.log('Error fetching venues:', error);
            }
        };
        getVenues();
    }, []);
    return {
        venues,
    };
};

export default useVenuesLogic;
