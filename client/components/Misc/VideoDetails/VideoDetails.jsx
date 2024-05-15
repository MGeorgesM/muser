import React from 'react';
import { Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, utilities } from '../../../styles/utilities';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import BandMemberCard from '../../Cards/BandMemberCard/BandMemberCard';

const VideoDetails = ({ show }) => {
    const navigation = useNavigation();
    return (
        <>
            <View style={styles.videoDetailsContainer}>
                <View>
                    <Text style={[utilities.textLeft, utilities.textL, utilities.myFontBold]}>
                        {`${show.band?.name}`}
                    </Text>
                    <Text style={[utilities.textM, utilities.myFontRegular, { color: colors.gray }]}>
                        {`Live at ${show.venue?.venue_name} - ${show.venue.location?.name}`}
                    </Text>
                </View>
                <Pressable onPress={handleLike}>
                    <Heart size={24} color={colors.primary} fill={videoIsLiked ? colors.primary : colors.bgDark} />
                </Pressable>
            </View>
            <View style={[{ paddingLeft: 20 }]}>
                <Text style={[utilities.textM, utilities.myFontBold, { marginBottom: 8 }]}>Band</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {show.band.members.map((member) => (
                        <BandMemberCard
                            key={member.id}
                            entity={member}
                            handlePress={() => {
                                navigation.navigate('Feed', {
                                    screen: 'ProfileDetails',
                                    params: { userId: member.id },
                                });
                            }}
                        />
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

export default VideoDetails;

const styles = StyleSheet.create({
    videoDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
});
