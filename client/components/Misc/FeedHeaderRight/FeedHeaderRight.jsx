import React from 'react';
import { Mail } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

const FeedHeaderRight = () => {
    return (
        <View style={styles.feedHeaderRight}>
            <Mail size={20} color="white" />
        </View>
    );
};

export default FeedHeaderRight;

const styles = StyleSheet.create({
    feedHeaderRight: {
        marginRight: 16,
        height: 42,
        width: 42,
        borderRadius: 21,
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
