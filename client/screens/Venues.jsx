import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { ChevronLeft } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';
import { requestMethods, sendRequest } from '../core/tools/apiRequest';

const Venues = ({ navigation }) => {
    const dispatch = useDispatch();
    const venues = useSelector((global) => global.venuesSlice.venues);

    useEffect(() => {
        const getVenues = async () => {
            console.log('Fetching venues');
            try {
                const response = await sendRequest(requestMethods.GET, 'users/type/venue', null);
                if (response.status !== 200) throw new Error('Failed to fetch venues');
                dispatch(setVenues(response.data));
            } catch (error) {
                console.log('Error fetching venues:', error);
            }
        };
    }, []);

    const StreamCard = ({ show }) => {
        return (
            <TouchableOpacity style={styles.cardContainer} onPress={navigation.navigate}>
                <Image source={show.imageUrl} style={styles.backgroundImage} />
                <View style={styles.overlay}>
                    <View>
                        <Text style={[styles.streamName]}>{show.name}</Text>

                        <Text style={styles.date}>{show.date}</Text>
                    </View>
                    <View style={styles.avatarsDisplay}>
                        {show.band.members.map((member) => (
                            <Image source={member.avatar} style={{ width: 32, height: 32, borderRadius: 16 }} />
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.main}>
            <View style={[utilities.container, styles.overviewContainer]}>
                <View style={[utilities.flexRow, utilities.center, { marginBottom: 24 }]}>
                    <ChevronLeft
                        size={24}
                        color="black"
                        style={{ position: 'absolute', left: 0 }}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={[utilities.textL, utilities.textBold]}>Shows</Text>
                </View>

                <FlatList
                    data={shows}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => <StreamCard show={item} />}
                ></FlatList>
            </View>
        </View>
    );
};

export default Venues;

const styles = StyleSheet.create({});
