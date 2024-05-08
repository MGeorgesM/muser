import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Dimensions,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
} from 'react-native';

import { colors, utilities } from '../../styles/utilities';

import PrimaryBtn from '../Elements/PrimaryBtn';

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
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.bottomStickView}>
                    <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                        <View>
                            <Text style={[styles.modalTitle, { color: colors.primary, marginBottom:-3 }]}>Muser Ai</Text>
                            <Text style={[utilities.textCenter, utilities.myFontRegular, {marginBottom:32}]}>
                                Your Band Formed Effortlessly
                            </Text>
                        </View>
                        <TextInput
                            style={[utilities.inputText]}
                            onChangeText={setUserInput}
                            placeholderTextColor={colors.gray}
                            value={userInput}
                            placeholder="Enter your thoughts here..."
                        />
                        <PrimaryBtn text={'Match'} marginBottom={16} handlePress={handlePress} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
        height: 0.35 * height,
        paddingHorizontal: 20,
        paddingBottom:32,
        justifyContent: 'space-between',
        backgroundColor: colors.bgOffDark,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopRightRadius: utilities.borderRadius.xl,
    },

    modalTitle: {
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        color: colors.white,
        fontSize: 24,
    },
});
