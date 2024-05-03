import React, { useEffect } from 'react';

import { setVenues } from '../store/Venues';
import { useSelector, useDispatch } from 'react-redux';

import { requestMethods, sendRequest } from '../core/tools/apiRequest';

import ModalHigh from '../components/Modals/ModalHigh';
import ShowVenueCard from '../components/ShowVenueCards/ShowVenueCard';

const Venues = ({ navigation }) => {
    const dispatch = useDispatch();
    const venues = useSelector((global) => global.venuesSlice.venues);

    useEffect(() => {
        const getVenues = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, 'users/type/venue', null);
                if (response.status !== 200) throw new Error('Failed to fetch venues');
                dispatch(setVenues(response.data));
            } catch (error) {
                console.log('Error fetching venues:', error);
            }
        };
        getVenues();
    }, []);

    return (
        <ModalHigh
            title="Venues"
            navigation={navigation}
            items={venues}
            renderItem={({ item }) => (
                <ShowVenueCard entity={item} handleNavigation={() => navigation.navigate('VenueDetails', { item })} />
            )}
        />
    );
};

export default Venues;