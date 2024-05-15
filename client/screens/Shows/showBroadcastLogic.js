import { useState } from 'react';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';

const useShowBroadcastLogic = () => {
    const [call, setCall] = useState(null);
    const client = useStreamVideoClient();

    const createCall = async () => {
        if (!client) return;
        try {
            const call = client.call('livestream', showIdString);
            await call.join({ create: true });
            setCall(call);
        } catch (error) {
            console.error('Error joining call:', error);
        }
    };

    return {
        call,
        createCall,
    };
};

export default useShowBroadcastLogic;
