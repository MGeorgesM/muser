import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { StreamCall } from '@stream-io/video-react-native-sdk';
import { colors, utilities } from '../../styles/utilities';

import StreamViewer from '../../components/Misc/Streaming/StreamViewer/StreamViewer';
import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';
import useShowBroadcastLogic from './showBroadcastLogic';
import useShowStreamCommentsLogic from './showStreamCommentsLogic';

const ShowBroadcast = ({ route }) => {
    const { showId, showName } = route.params;
    const { call, setCall } = useShowBroadcastLogic(showId);
    const { comments } = useShowStreamCommentsLogic(showId);

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
