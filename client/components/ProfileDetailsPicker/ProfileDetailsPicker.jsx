import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { colors } from '../../styles/utilities';

const ProfileDetailsPicker = ({ label, items, selectedValue, onValueChange }) => (
    <View style={{ borderBottomWidth: 0.5, marginBottom: 20, borderBottomColor: colors.white }}>
        <Text style={styles.inputTextProfile}>{label}</Text>
        <Picker
            style={{
                marginHorizontal: -16,
                marginBottom: -12,
                color: colors.lightGray,
                borderColor: colors.lightGray,
                borderWidth: 1,
            }}
            selectedValue={selectedValue}
            dropdownIconColor={colors.white}
            onValueChange={onValueChange}
        >
            <Picker.Item label="Select an option" value="" color="black"/>
            {items.map((item) => (
                <Picker.Item
                    key={item.id}
                    value={item.id}
                    label={item.name}
                    color="black"
                />
            ))}
        </Picker>
    </View>
);

const styles = StyleSheet.create({
    inputTextProfile: {
        color: colors.white,
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'left',
    },
});

export default ProfileDetailsPicker;
