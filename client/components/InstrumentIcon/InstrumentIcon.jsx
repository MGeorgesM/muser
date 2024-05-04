import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Guitar, Drum, MicVocal, Piano, KeyboardMusic, TestTubeDiagonal, Speaker } from 'lucide-react-native';

const InstrumentIcon = ({ instrument, color = 'white' }) => {

    switch (instrument.name.toLowerCase()) {
        case 'strings':
            return <Guitar color={color} />;
        case 'percussion':
            return <Drum color={color} />;
        case 'vocals':
            return <MicVocal color={color} />;
        case 'keyboard':
            return <KeyboardMusic color={color} />;
        case 'brass':
            return <TestTubeDiagonal color={color} />;
        case 'bass':
            return <Speaker color={color} />;
        default:
            return <Piano color={color} />;
    }
};

export default InstrumentIcon;

const styles = StyleSheet.create({});
