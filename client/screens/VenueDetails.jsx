import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';

import { setSelectedVenue } from '../store/Venues';
import { useSelector, useDispatch } from 'react-redux';

import { Play, ChevronLeft, ChevronRight } from 'lucide-react-native';

import { utilities, colors } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';
import BackBtn from '../components/BackBtn';

const VenueDetails = ({ route, navigation }) => {
    // const { entity: venue } = route.params;

    const shows = [
        {
            id: 2,
            name: 'The Architects Show',
            description:
                'Sed rem ex iure aut. Saepe magnam cumque et. Vel commodi ea voluptatem mollitia vel sed amet.',
            picture: 'show.jpg',
            date: '2024-07-18 08:56:02',
        },
        {
            id: 3,
            name: 'The Architects Show',
            description:
                'Sed rem ex iure aut. Saepe magnam cumque et. Vel commodi ea voluptatem mollitia vel sed amet.',
            picture: 'show.jpg',
            date: '2024-07-18 08:56:02',
        },
        {
            id: 4,
            name: 'The Architects Show',
            description:
                'Sed rem ex iure aut. Saepe magnam cumque et. Vel commodi ea voluptatem mollitia vel sed amet.',
            picture: 'show.jpg',
            date: '2024-07-18 08:56:02',
        },
        {
            id: 5,
            name: 'The Architects Show',
            description:
                'Sed rem ex iure aut. Saepe magnam cumque et. Vel commodi ea voluptatem mollitia vel sed amet.',
            picture: 'show.jpg',
            date: '2024-07-18 08:56:02',
        },
    ];
    const venue = {
        id: 12,
        name: 'Paloma',
        email: 'dayna.watsica@example.com',
        about: 'Aliquam temporibus sint sint omnis tempore et sit. Velit molestias impedit autem et ut occaecati corrupti temporibus.',
        picture: 'venue.jpg',
        location: {
            id: 5,
            name: 'Saida',
        },
        genres: [],
        instrument: null,
        availability: {
            id: 3,
            name: 'Evenings',
        },
        experience: null,
        role: {
            id: 2,
            name: 'venue',
        },
        venueType: {
            id: 1,
            name: 'pub',
        },
    };
    const imageUrl = `${profilePicturesUrl + venue.picture}`;

    useEffect(() => {
        const getVenueDetails = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, `users/${venue.id}`, null);
                if (response.status !== 200) throw new Error('Failed to fetch venue details');
                console.log(response.data);
                dispatch(setSelectedVenue(response.data));
            } catch (error) {
                console.log('Error fetching venue details:', error);
            }
        };

        const getVenueShows = async () => {
            try {
                const response = await sendRequest(requestMethods.GET, `venues/${venue.id}/shows.set`, null);
                if (response.status !== 200) throw new Error('Failed to fetch venue shows');
                console.log(response.data);
                //Set venue shows
            } catch (error) {
                console.log('Error fetching venue shows:', error);
            }
        };
        getVenueDetails();
    }, [venue]);


    return (
        <View style={styles.container}>
            <BackBtn />
            <View>
                <Image source={{ uri: imageUrl }} style={[styles.venueImage, styles.borderRadiusBottom]} />

                <View style={[utilities.overlay, styles.borderRadiusBottom, { height: 96 }]}>
                    <Text style={[utilities.textL, utilities.textBold, { color: 'white' }]}>{venue.name}</Text>
                    <Text
                        style={[utilities.textS, { color: colors.offWhite }]}
                    >{`${venue.location.name},Lebanon`}</Text>
                </View>
            </View>
            <View style={[utilities.container]}>
                <Text style={[utilities.textM, utilities.textBold, { marginVertical: 18 }]}>Upcoming Shows</Text>
                <FlatList
                    data={shows}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ShowCard entity={item} navigation={navigation} />}
                    showsVerticalScrollIndicator={false}
                />
                <TouchableOpacity style={[utilities.primaryBtn, { marginVertical: 20 }]}>
                    <Text style={[utilities.primaryBtnText]}>Book your Show!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VenueDetails;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    borderRadiusBottom: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    venueImage: {
        width: '100%',
        height: height * 0.5,
        resizeMode: 'cover',
        position: 'relative',
    },
});
