import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

import { setSelectedVenue } from '../store/Venues';
import { useSelector, useDispatch } from 'react-redux';

import { utilities, colors } from '../styles/utilities';
import { profilePicturesUrl } from '../core/tools/apiRequest';
import { sendRequest, requestMethods } from '../core/tools/apiRequest';

const VenueDetails = ({ route }) => {
    // const { entity: venue } = route.params;
    const shows = [
        {
            id: 2,
            name: 'Architecto ullam tenetur debitis odio illum.',
            description:
                'Sed rem ex iure aut. Saepe magnam cumque et. Vel commodi ea voluptatem mollitia vel sed amet.',
            picture: 'show.jpg',
            date: '2024-07-18 08:56:02',
            duration: 67,
            band_id: 9,
            venue_id: 11,
            status: 'set',
            created_at: '2024-04-28T14:46:56.000000Z',
            updated_at: '2024-04-28T14:46:56.000000Z',
            band: {
                id: 9,
                name: 'Cartwright-Price',
                created_at: '2024-04-28T14:46:56.000000Z',
                updated_at: '2024-04-28T14:46:56.000000Z',
                members: [
                    {
                        id: 3,
                        name: 'Lawrence Hamill Jr.',
                        email: 'odurgan@example.org',
                        about: 'Voluptas illum omnis sunt nulla soluta. Aut illo minima odit nihil impedit. Ea explicabo sit enim magnam.',
                        picture: 'musician.jpg',
                        location_id: 1,
                        availability_id: 4,
                        experience_id: 1,
                        instrument_id: 3,
                        venue_type_id: null,
                        role_id: 1,
                        is_active: 1,
                        created_at: '2024-04-28T14:46:54.000000Z',
                        updated_at: '2024-04-28T14:46:54.000000Z',
                        pivot: {
                            band_id: 9,
                            user_id: 3,
                        },
                    },
                    {
                        id: 10,
                        name: 'Ludwig Glover I',
                        email: 'dolores.zieme@example.com',
                        about: 'Mollitia in nulla ad quisquam sint natus molestiae. Deleniti recusandae fuga qui dolores.',
                        picture: 'musician.jpg',
                        location_id: 1,
                        availability_id: 4,
                        experience_id: 1,
                        instrument_id: 3,
                        venue_type_id: null,
                        role_id: 1,
                        is_active: 1,
                        created_at: '2024-04-28T14:46:54.000000Z',
                        updated_at: '2024-04-28T14:46:54.000000Z',
                        pivot: {
                            band_id: 9,
                            user_id: 10,
                        },
                    },
                    {
                        id: 10,
                        name: 'Ludwig Glover I',
                        email: 'dolores.zieme@example.com',
                        about: 'Mollitia in nulla ad quisquam sint natus molestiae. Deleniti recusandae fuga qui dolores.',
                        picture: 'musician.jpg',
                        location_id: 1,
                        availability_id: 4,
                        experience_id: 1,
                        instrument_id: 3,
                        venue_type_id: null,
                        role_id: 1,
                        is_active: 1,
                        created_at: '2024-04-28T14:46:54.000000Z',
                        updated_at: '2024-04-28T14:46:54.000000Z',
                        pivot: {
                            band_id: 9,
                            user_id: 10,
                        },
                    },
                ],
            },
        },
    ];

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
    }, []);

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
    return (
        <View style={styles.container}>
            <View>
                <Image source={{ uri: imageUrl }} style={[styles.venueImage, styles.borderRadiusBottom]} />

                <View style={[utilities.overlay, styles.borderRadiusBottom, { height: 96 }]}>
                    <Text style={[utilities.textL, utilities.textBold, { color: 'white' }]}>{venue.name}</Text>
                    <Text
                        style={[utilities.textS, { color: colors.offWhite }]}
                    >{`${venue.location.name},Lebanon`}</Text>
                </View>
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
        height: height * 0.55,
        resizeMode: 'cover',
        position: 'relative',
    },
});
