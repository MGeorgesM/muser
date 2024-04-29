import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';
import { colors, utilities } from '../../styles/utilities';

const ModalHigh = ({ title, navigation, items, renderItem }) => {
    return (
        <View style={styles.main}>
            <View style={[utilities.container, styles.overviewContainer]}>
                <View style={[utilities.flexRow, utilities.center, { marginBottom: 24 }]}>
                    <ChevronLeft
                        size={24}
                        color="black"
                        style={{ position: 'absolute', left: 0 }}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={[utilities.textL, utilities.textBold]}>{title}</Text>
                </View>

                <FlatList data={items} keyExtractor={(item) => item.name} renderItem={renderItem}></FlatList>
            </View>
        </View>
    );
};

export default ModalHigh;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.darkGray,
    },
    overviewContainer: {
        marginTop: 64,
        backgroundColor: 'white',
        borderTopEndRadius: utilities.borderRadius.xl,
        borderTopLeftRadius: utilities.borderRadius.xl,
        paddingTop: 24,
    },
});
