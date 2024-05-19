import React from 'react';

import { Guitar, Drum, MicVocal, Piano, KeyboardMusic, TestTubeDiagonal} from 'lucide-react-native';

const InstrumentIcon = ({ instrument, color = 'white', size = 24 }) => {
    switch (instrument?.name?.toLowerCase()) {
        case 'strings':
        case 'guitar':
        case 'bass':
        case 'double bass':
            return <Guitar color={color} size={size} />;
        case 'percussion':
            return <Drum color={color} size={size} />;
        case 'vocals':
            return <MicVocal color={color} size={size} />;
        case 'keyboard':
            return <KeyboardMusic color={color} size={size} />;
        case 'wind':
            return <TestTubeDiagonal color={color} size={size} />;
        default:
            return <Piano color={color} size={size} />;
    }
};

export default InstrumentIcon;
