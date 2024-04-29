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

    const StreamCard = ({ entity }) => {
        const { picture, about, name, location, venueType } = entity;
        const imageUrl = `${profilePicturesUrl + picture}`;
        return (
            <TouchableOpacity style={styles.cardContainer} onPress={navigation.navigate}>
                <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />
                <View style={styles.overlay}>
                    <View>
                        <Text style={[styles.streamName]}>{name}</Text>

                        <Text style={styles.date}>{date || about}</Text>
                    </View>
                    {date && (
                        <View style={styles.avatarsDisplay}>
                            {show.band.members.map((member) => (
                                <Image source={member.avatar} style={{ width: 32, height: 32, borderRadius: 16 }} />
                            ))}
                        </View>
                    )}
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
                    <Text style={[utilities.textL, utilities.textBold]}>Venues</Text>
                </View>

                <FlatList
                    data={venues}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => <StreamCard entity={item} />}
                ></FlatList>
            </View>
        </View>
    );
};

export default Venues;

const styles = StyleSheet.create({
  main: {
      flex: 1,
      backgroundColor: colors.darkGray,
  },
  overviewContainer: {
      marginTop: 64,
      backgroundColor: 'white',
      borderTopEndRadius: utilities.borderRadius.xl,
      borderTopLeftRadius: utilities.borderRadius.xl,
      paddingTop: 24,
  },

  cardContainer: {
      width: '100%',
      height: 180,
      overflow: 'hidden',
      position: 'relative',
      borderRadius: utilities.borderRadius.m,
      marginBottom: 16,
  },
  backgroundImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
  },
  overlay: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
      justifyContent: 'space-between',
  },
  avatarsDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  streamName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
  },
  date: {
      fontSize: 16,
      color: 'white',
  },
});
