import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import { Heart, Play, PlayIcon, Send } from 'lucide-react-native';
import { colors, utilities } from '../styles/utilities';
import BackBtn from '../components/Elements/BackBtn';
import BandMemberCard from '../components/BandMemberCard/BandMemberCard';
import { defaultAvatar } from '../core/tools/apiRequest';


import { formatDateString, truncateText } from '../core/tools/formatDate';

const StreamView = ({ navigation, route }) => {

    const { show } = route.params;


    const [bandMembers, setBandMembers] = useState(show.band.members);
    console.log(show);
    if (show) return (
        <View style={{ flex: 1 }}>
            <BackBtn navigation={navigation} />
            <View
                style={[
                    { height: height * 0.5, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
                ]}
            >
                <PlayIcon size={42} color={'white'} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                <View>
                    <Text style={[utilities.textCenter, utilities.textL, utilities.textBold]}>{truncateText(show.name)}</Text>
                    <Text style={[utilities.textM, { color: colors.gray }]}>{show.venue.name}</Text>
                </View>
                <View>
                    <Heart size={24} color={colors.primary} />
                </View>
            </View>
            <View style={[{ paddingLeft: 20 }]}>
                <Text style={[utilities.textM, utilities.textBold, { marginBottom: 8 }]}>Band</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {show.band.members.map((member) => (
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
                <View style={styles.userInputField}>
                    <TextInput
                        placeholder="Write a comment"
                        style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.white }}
                    />
                    <TouchableOpacity>
                        <Send size={24} color={colors.darkGray} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default StreamView;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    commentsContainer: {
        marginTop: 8,
        paddingTop: 24,
        borderTopEndRadius: 36,
        borderTopStartRadius: 36,
        flex: 1,
        border: colors.lightGray,
        borderWidth: 0.25,
        // elevation: 1,
        
    },

    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },

    userInputField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
        height: 48,
        borderTopColor: colors.lightGray,
        borderTopWidth: 1,
    },
});
