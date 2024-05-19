import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { sendRequest, requestMethods } from '../../../core/tools/apiRequest';

const useVenueDetailsLogic = (show, venue, switchView) => {
    const navigation = useNavigation();
    const [switchHandler, setSwitchHandler] = useState(switchView ? true : false);
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(show);

    useEffect(() => {
        show && setSelectedShow(show);
        venue && getVenueShows();
    }, [venue, show, switchView]);

    const getVenueShows = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, `shows?venue_id=${venue.id}&status=set`, null);
            if (response.status !== 200) throw new Error('Failed to fetch venue shows');

            setShows(response.data);
        } catch (error) {
            console.log('Error fetching venue shows:', error);
        }
    };

    const handleProceed = () => {
        switchView
            ? navigation.navigate('Live', {
                  screen: 'StreamBroadcast',
                  params: {
                      showId: show.id,
                      showName: `${show.band.name} @ ${show.venue.venue_name}`,
                  },
              })
            : navigation.navigate('ShowDetails', { venueId: venue.id, venueName: venue.venueName });
    };

    const handleMemberCardPress = (memberId) => {
        navigation.navigate('Feed', {
            screen: 'ProfileDetails',
            params: {
                userId: memberId,
                onBackPress: () =>
                    navigation.navigate('Venues', { screen: 'VenueDetails', params: { switchHandler: true } }),
            },
        });
    };

    const handleBackBtn = () => {
        switchView ? navigation.navigate('Live', { screen: 'Streams' }) : setSwitchHandler(!switchHandler);
    };

    return {
        shows,
        selectedShow,
        switchHandler,
        handleProceed,
        handleBackBtn,
        setSelectedShow,
        setSwitchHandler,
        handleMemberCardPress,
    };
};

export default useVenueDetailsLogic;
