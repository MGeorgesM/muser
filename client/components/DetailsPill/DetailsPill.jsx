import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const DetailsPill = ({ label, item, handlePress }) => {
    const [selected, setSelected] = useState(false);

    return (
        <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.inputTextProfile}>{label}</Text>
            <TouchableOpacity style={[styles.detailPill]}>
                <Text style={styles.detail}>Music Genres</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DetailsPill;

const styles = StyleSheet.create({
    detailPill: {
        borderRadius: 24,
        paddingVertical: 2,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },

    detail: {
        color: 'white',
    },
});
