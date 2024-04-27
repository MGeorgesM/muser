import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EditProfilePicker = ({ label, items, selectedValue, onValueChange }) => (
    <View style={{ borderBottomWidth: 0.5, marginBottom: 20 }}>
        <Text style={styles.inputTextProfile}>{label}</Text>
        <Picker
            style={{ marginHorizontal: -16, marginBottom: -12 }}
            selectedValue={selectedValue}
            onValueChange={onValueChange}
        >
            {items.map((item) => (
                <Picker.Item key={item.id} value={item.id} label={item.name} />
            ))}
        </Picker>
    </View>
);

const styles = StyleSheet.create({
    inputTextProfile: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
    },
});

export default EditProfilePicker;
