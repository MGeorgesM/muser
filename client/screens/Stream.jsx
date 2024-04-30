import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import { Heart, Play, PlayIcon } from 'lucide-react-native';
import { utilities } from '../styles/utilities';
import BackBtn from '../components/Elements/BackBtn';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';

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
    };

    const [bandMembers, setBandMembers] = useState(show.band.members);
    
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
            <View style={{ alignItems: 'flex-start', padding: 20 }}>
                <Text
                    style={[utilities.textCenter, utilities.textXL, utilities.textBold, { fontFamily: 'Montserrat' }]}
                >
                    Live Now
                </Text>
                <Text style={[utilities.textCenter, { fontSize: 16, color: 'gray' }]}>Live from the Venue</Text>
            </View>
            <View style={[{ paddingHorizontal: 20 }]}>
                <Text style={[utilities.textM, utilities.textBold, { fontFamily: 'Montserrat' }]}>Band</Text>

                {bandMembers.map((member) => (
                    <BandMemberCard key={member.id} member={member} />
                ))}
            </View>
        </View>
    );
};

export default Live;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({});
