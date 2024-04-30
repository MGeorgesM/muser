import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ScrollView } from 'react-native';

import { Heart, Play, PlayIcon } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';
import BackBtn from '../components/Elements/BackBtn';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';
import { defaultAvatar } from '../core/tools/apiRequest';

const Live = () => {
    const show = {
        id: 5,
        name: 'The Jazzy Brazzy',
        description: 'Modi molestias dolore quia',
        picture: 'show.jpg',
        date: '2024-11-20 15:26:31',
        duration: 112,
        band_id: 3,
        venue_id: 14,
        status: 'set',
        created_at: '2024-04-30T10:37:35.000000Z',
        updated_at: '2024-04-30T10:37:35.000000Z',
        band: {
            id: 3,
            name: 'Boyle-Quigley',
            created_at: '2024-04-30T10:37:34.000000Z',
            updated_at: '2024-04-30T10:37:34.000000Z',
            members: [
                {
                    id: 10,
                    name: "Prof. Ernesto O'Keefe",
                    picture: 'musician.jpg',
                    pivot: {
                        band_id: 3,
                        user_id: 10,
                    },
                },
                {
                    id: 9,
                    name: 'Lori King',
                    picture: 'musician.jpg',
                    pivot: {
                        band_id: 3,
                        user_id: 9,
                    },
                },
                {
                    id: 6,
                    name: 'Roselyn Willms',
                    picture: 'musician.jpg',
                    pivot: {
                        band_id: 3,
                        user_id: 6,
                    },
                },
            ],
        },
        venue: {
            id: 2,
            name: 'The Venue',
        },
    };

    const [bandMembers, setBandMembers] = useState(show.band.members);
    console.log(show.band.members);
    return (
        <View style={{ flex: 1 }}>
            <BackBtn />
            <View
                style={[
                    { height: height * 0.5, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
                ]}
            >
                <PlayIcon size={42} color={'white'} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                <View>
                    <Text
                        style={[
                            utilities.textCenter,
                            utilities.textL,
                            utilities.textBold,
                        ]}
                    >
                        {show.name}
                    </Text>
                    <Text style={[utilities.textM, { color: colors.gray }]}>{show.venue.name}</Text>
                </View>
                <View>
                    <Heart size={24} color={colors.primary} />
                </View>
            </View>
            <View style={[{ paddingHorizontal: 20 }]}>
                <Text style={[utilities.textM, utilities.textBold, { marginBottom: 8 }]}>
                    Band
                </Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {bandMembers.map((member) => (
                        <BandMemberCard key={member.id} entity={member} />
                    ))}
                </ScrollView>
            </View>
            <View style={styles.commentsContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 }}
                    >
                        <Image source={defaultAvatar} style={styles.commentAvatar}></Image>
                        <Text style={[utilities.textS]}>This is a user comment on the live stream</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Live;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    commentsContainer: {
        marginTop: 24,
        paddingTop: 24,
        borderTopEndRadius: 36,
        borderTopStartRadius: 36,
        flex: 1,
        elevation: 1,
    },

    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
});
