import React from 'react';
import { StyleSheet, Text, View, Modal, Dimensions, TextInput } from 'react-native';

import { colors, utilities } from '../../styles/utilities';

import PrimaryBtn from '../Elements/PrimaryBtn';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const AiMatchMakingModal = ({ userInput, handlePress, setUserInput, modalVisible, setModalVisible }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >

                <View style={styles.bottomStickView}>

                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>
                            Your Band with <Text style={{ color: colors.primary }}>Muser Ai</Text>
                        </Text>
                        <View>
                            {/* <Text style={[utilities.label]}>What's your muse today?</Text> */}
                            <TextInput
                                style={[utilities.inputText]}
                                onChangeText={setUserInput}
                                placeholderTextColor={colors.gray}
                                value={userInput}
                                placeholder="Enter your thoughts here..."
                            />
                        </View>
                        <PrimaryBtn text={'Match'} marginBottom={24} handlePress={handlePress} />
                    </View>


                </View>

        </Modal>
    );
};

export default AiMatchMakingModal;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    bottomStickView: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    modalView: {
        elevation: 2,
        paddingTop: 32,
        height: 0.3 * height,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        backgroundColor: colors.bgOffDark,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopRightRadius: utilities.borderRadius.xl,
    },

    modalTitle: {
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        color: colors.white,
        fontSize: 20,
    },

    modalTextInput: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: utilities.borderRadius.s,
        width: '100%',
    },
});
