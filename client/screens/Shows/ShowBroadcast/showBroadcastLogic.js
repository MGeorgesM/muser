import { useEffect, useState } from 'react';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

const useShowBroadcastLogic = (showId) => {
    const [call, setCall] = useState(null);
    const client = useStreamVideoClient();

    useEffect(() => {
        if (client && !call) {
            createCall();
        }
    }, [client, call]);

    const createCall = async () => {
        if (!client) return;
        try {
            const call = client.call('livestream', showId);
            await call.join({ create: true });
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }
    };

    return {
        call,
        setCall,
        createCall,
    };
};

export default useShowBroadcastLogic;
