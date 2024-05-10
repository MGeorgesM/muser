import React, { useEffect, useState } from 'react';

import { setShows } from '../store/Shows';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../contexts/UserContext';

import { sendRequest, requestMethods } from '../core/tools/apiRequest';

import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

import ModalHigh from '../components/Modals/ModalHigh';
import ShowVenueCard from '../components/Cards/ShowVenueCards/ShowVenueCard';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';

const Streams = ({ navigation }) => {
    const dispatch = useDispatch();

    const [userIsVenue, setUserIsVenue] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

    const { currentUser } = useUser();

    const shows = useSelector((global) => global.showsSlice.shows);

    useEffect(() => {
        currentUser.role.id === 2 ? setUserIsVenue(true) : setUserIsVenue(false);

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

        getShows();
    }, [currentUser]);

    // const createCall = async () => {
    //     console.log('Creating call');

    //     if (!client) {
    //         console.log('No client found');
    //         return;
    //     }
    //     console.log('Client Found!');
    //     try {
    //         const call = client.call('livestream', selectedShow.id);
    //         await call.join({ create: true });
    //         setCall(call);
    //     } catch (error) {
    //         console.error('Error joining call:', error);
    //     }

    //     setViewer(false);
    // };

    const handleCardPress = (show) => {
        if (userIsVenue) {
            if (selectedShow && selectedShow.id === show.id) {
                navigation.navigate('StreamBroadcast', {
                    showId: selectedShow.id,
                    showName: `${show.band.name} @ ${show.venue.name}`,
                });
            } else {
                setSelectedShow(show);
            }
        } else {
            navigation.navigate('StreamView', { show });
        }
    };

    return shows && shows.length > 0 ? (
        <ModalHigh
            title="Upcoming Shows"
            navigation={navigation}
            items={shows}
            renderItem={({ item }) => (
                <ShowVenueCard
                    key={item.id}
                    entity={item}
                    handlePress={() => handleCardPress(item)}
                    isSelected={item.id === selectedShow?.id}
                />
            )}
        />
    ) : (
        <LoadingScreen />
    );
};

export default Streams;
