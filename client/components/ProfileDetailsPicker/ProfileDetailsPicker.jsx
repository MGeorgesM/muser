import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { colors } from '../../styles/utilities';

const ProfileDetailsPicker = ({ label, items, selectedValue, onValueChange }) => (
    <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
        <Text style={styles.inputTextProfile}>{label}</Text>
        <Picker
            style={{ marginHorizontal: -16, marginBottom: -12, color:colors.lightGray }}
            selectedValue={selectedValue}
            onValueChange={onValueChange}
        >
            <Picker.Item label="Select an option" value="" />
            {items.map((item) => (
                <Picker.Item key={item.id} value={item.id} label={item.name} />
            ))}
        </Picker>
    </View>
);

const styles = StyleSheet.create({
    inputTextProfile: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
    },
});

export default ProfileDetailsPicker;
