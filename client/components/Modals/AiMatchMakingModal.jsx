import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AiMatchMakingModal = ({
    userInput,
    handlePress,
    setUserInput,
    modalVisible,
    setModalVisible,
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
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

export default AiMatchMakingModal

const styles = StyleSheet.create({})