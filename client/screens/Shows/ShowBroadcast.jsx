import React, { useEffect, useState } from 'react';
import { View, SafeAreaView } from 'react-native';

import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

import { StreamCall } from '@stream-io/video-react-native-sdk';
import { colors, utilities } from '../../styles/utilities';

import { fireStoreDb } from '../../config/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

import StreamViewer from '../../components/Misc/Streaming/StreamViewer/StreamViewer';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';

const ShowBroadcast = ({ route }) => {
    const { showId, showName } = route.params;

    return call ? (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1, marginTop: 64, position: 'relative' }}>
                    <StreamViewer showName={showName} setCall={setCall} comments={comments} />
                </SafeAreaView>
            </StreamCall>
        </View>
    ) : (
        <LoadingScreen />
    );
};

export default ShowBroadcast;
