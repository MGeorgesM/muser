import React, { useEffect, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

import { StreamCall } from '@stream-io/video-react-native-sdk';
import { colors, utilities } from '../../styles/utilities';
import StreamViewer from '../../components/Misc/Streaming/StreamViewer/StreamViewer';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';

const ShowBroadcast = ({ route }) => {
    const { showId, showName } = route.params;
    // const showIdString = showId.toString() + 'TEST78' ?? {};
    const showIdString = 'TEST1122334X';

    const [call, setCall] = useState(null);
    const [viewer, setViewer] = useState(false);

    const client = useStreamVideoClient();

    client && console.log('Client Found!');
    console.log('Show ID:', showIdString);

    useEffect(() => {
        const createCall = async () => {
            console.log('Creating call');

            if (!client) {
                console.log('No client found');
                return;
            }
            console.log('Client Found!');
            try {
                const call = client.call('livestream', showIdString);
                await call.join({ create: true });
                setCall(call);
            } catch (error) {
                console.error('Error joining call:', error);
            }

            setViewer(false);
        };

        createCall();
    }, [showId]);

    return call ? (
        <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
            <StreamCall call={call}>
                <SafeAreaView style={{ flex: 1, marginTop: 64 }}>
                    <StreamViewer viewer={viewer} showName={showName} setCall={setCall} />
                </SafeAreaView>
            </StreamCall>
        </View>
    ) : (
        <LoadingScreen />
    );
};

export default ShowBroadcast;
