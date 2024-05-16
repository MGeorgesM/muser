import { useEffect } from 'react';
import { setShows } from '../../store/Shows';
import { useUser } from '../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { sendRequest, requestMethods } from '../../core/tools/apiRequest';

const useShowsLogic = () => {
    const dispatch = useDispatch();
    const { currentUser } = useUser();
    const userIsVenue = currentUser?.role === 'venue';
    const shows = useSelector((global) => global.showsSlice.shows);

    useEffect(() => {
        getShows();
    }, [currentUser]);

    const getShows = async () => {
        try {
            const response = await sendRequest(
                requestMethods.GET,
                `shows?status=set${userIsVenue ? `&venue_id=${currentUser.id}` : ''}`,
                null
            );
            if (response.status !== 200) throw new Error('Failed to fetch shows');
            dispatch(setShows(response.data));
        } catch (error) {
            console.log('Error fetching shows:', error);
        }
    };

    const handleCardPress = (show) => {
        userIsVenue
            ? navigation.navigate('Venues', {
                  screen: 'VenueDetails',
                  params: {
                      show: show,
                      switchView: true,
                  },
              })
            : navigation.navigate('StreamView', { show });
    };
    return {
        shows,
        getShows,
        handleCardPress,
    };
};

export default useShowsLogic;
