import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Dimensions,
    TextInput,
    Pressable,
    FlatList,
    TouchableWithoutFeedback,
} from 'react-native';

import { colors, utilities } from '../../styles/utilities';

import BandMemberCard from '../../components/Cards/BandMemberCard/BandMemberCard';
import PrimaryBtn from '../Elements/PrimaryBtn';

const ChatModal = ({ data, title, handlePress, modalVisible, setModalVisible, buttonText = 'Add', input = false }) => {
    const [userInput, setUserInput] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);

    const handleMemberSelect = (member) => {
        setSelectedMember(member);
    };

    const handleSubmit = () => {
        if (input) {
            handlePress(userInput);
        } else {
            handlePress(selectedMember);
        }
    };
    
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
                    <View
                        style={[
                            styles.modalView,
                            { justifyContent: data && data.length > 0 ? 'space-between' : 'center' },
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={styles.modalTitle}>{title}</Text>
                        {input ? (
                            <>
                                <TextInput
                                    style={[utilities.inputText, { marginBottom: 0 }]}
                                    onChangeText={setUserInput}
                                    placeholderTextColor={colors.gray}
                                    value={userInput}
                                    placeholder="As usual... be creative!"
                                />
                            </>
                        ) : data && data.length > 0 ? (
                            <>
                                <FlatList
                                    data={data}
                                    renderItem={({ item }) => (
                                        <BandMemberCard
                                            entity={item}
                                            isSelected={item.id === selectedMember?.id}
                                            handlePress={() => handleMemberSelect(item)}
                                        />
                                    )}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 8 }}
                                />
                            </>
                        ) : (
                            <Text
                                style={[
                                    utilities.textCenter,
                                    utilities.myFontRegular,
                                    utilities.textM,
                                    { color: colors.white, marginBottom: 12 },
                                ]}
                            >
                                No Connections Yet!
                            </Text>
                        )}
                        <PrimaryBtn
                            text={buttonText}
                            marginBottom={16}
                            marginTop={16}
                            handlePress={handleSubmit}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ChatModal;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    bottomStickView: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    modalView: {
        elevation: 2,
        paddingVertical: 32,
        height: 'auto',
        paddingHorizontal: 20,
        backgroundColor: colors.bgOffDark,
        borderTopLeftRadius: utilities.borderRadius.xl,
        borderTopRightRadius: utilities.borderRadius.xl,
    },

    modalTitle: {
        marginBottom: 32,
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
