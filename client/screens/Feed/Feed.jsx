import React from 'react';
import { StyleSheet, FlatList, View, RefreshControl } from 'react-native';

import { colors } from '../../styles/utilities';
import { BrainCog, MessageCirclePlus } from 'lucide-react-native';

import LoadingScreen from '../../components/Misc/LoadingScreen/LoadingScreen';
import AiMatchMakingModal from '../../components/Modals/AiMatchMakingModal';
import FloatingActionButton from '../../components/Misc/FloatingActionButton/FloatingActionButton';
import useFeedLogic from './feedLogic';

const Feed = () => {
    const {
        users,
        listData,
        getUsers,
        userInput,
        renderItem,
        loadingState,
        modalVisible,
        matchedUsers,
        setUserInput,
        handleProceed,
        setModalVisible,
        setLoadingState,
        handleChatInititation,
    } = useFeedLogic();

    return (users && users.length === 0) || loadingState.isLoading ? (
        <LoadingScreen />
    ) : (
        <>
            <View style={styles.listContainer}>
                <FlatList
                    data={listData()}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.cardsContainer}
                    refreshControl={
                        <RefreshControl
                            colors={[colors.white]}
                            progressBackgroundColor={colors.primary}
                            refreshing={loadingState.isRefreshing}
                            onRefresh={() => {
                                setLoadingState((prevState) => ({ ...prevState, isRefreshing: true }));
                                getUsers();
                            }}
                        />
                    }
                />
            </View>
            <AiMatchMakingModal
                userInput={userInput}
                setUserInput={setUserInput}
                modalVisible={modalVisible}
                handlePress={handleProceed}
                setModalVisible={setModalVisible}
            />
            <FloatingActionButton
                icon={BrainCog}
                handlePress={() => setModalVisible(true)}
                isLoading={loadingState.isAiLoading}
            />
            {matchedUsers && matchedUsers.length > 0 && (
                <FloatingActionButton
                    icon={MessageCirclePlus}
                    handlePress={handleChatInititation}
                    bottom={88}
                    primary={false}
                />
            )}
        </>
    );
};

export default Feed;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 8,

        borderColor: 'white',
        borderWidth: 0.5,
    },

    listContainer: {
        flex: 1,
        backgroundColor: colors.bgDark,
        paddingHorizontal: 14,
    },

    welcomeDisplay: {
        marginBottom: -2,
        color: 'white',
    },

    cardsContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddding: 0,
    },
});
