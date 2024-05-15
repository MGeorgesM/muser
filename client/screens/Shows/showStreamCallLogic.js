import { useEffect, useState } from 'react';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import inCallManager from 'react-native-incall-manager';

export const useShowStreamCallLogic = () => {
    const client = useStreamVideoClient();
    const [call, setCall] = useState(null);
    const [videoIsPlaying, setVideoIsPlaying] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [videoIsMaximized, setVideoIsMaximized] = useState(false);

    useEffect(() => {
        if (!client || call) return;
        return () => {
            if (call) {
                call.leave();
                setCall(null);
                inCallManager.stop();
            }
        };
    }, [client, show.id]);

    const joinCall = async () => {
        if (!client) {
            return;
        }
        try {
            const call = client.call('livestream', showId);
            await call.join({ create: false });
            setCall(call);
            console.log('Call joined!', call);
            call && setVideoIsPlaying(true);
            setControlsVisible(false);
        } catch (error) {
            console.log('Error joining call:', error);
        }
    };

    const handleUserStreamInteraction = () => {
        if (!call) {
            joinCall();
            return;
        } else if (videoIsPlaying) {
            call.leave();
            setVideoIsPlaying(false);
        } else {
            joinCall();
            setVideoIsPlaying(true);
        }
    };

    const handleVideoSizeToggle = () => {
        setVideoIsMaximized(!videoIsMaximized);
    };

    const handleUserTouches = () => {
        setControlsVisible(!controlsVisible);
    };
    return {
        call,
        joinCall,
        videoIsPlaying,
        controlsVisible,
        videoIsMaximized,
        handleUserTouches,
        handleVideoSizeToggle,
        handleUserStreamInteraction,
    };
};

export default useShowStreamCallLogic;
