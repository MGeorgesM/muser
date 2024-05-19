import React from 'react';
import { View, FlatList } from 'react-native';
import { colors, utilities } from '../../../styles/utilities';

import ChatCard from '../../../components/Cards/ChatCard/ChatCard';
import LoadingScreen from '../../../components/Misc/LoadingScreen/LoadingScreen';
import useChatsOverviewLogic from './chatsOverviewLogic';

const ChatsOverview = ({ navigation }) => {
    const { chats, isLoading } = useChatsOverviewLogic();
    return isLoading ? (
        <View style={[utilities.container, { backgroundColor: colors.bgDark }]}>
            <LoadingScreen />
        </View>
    ) : chats && chats.length > 0 ? (
        <View style={[utilities.darkContainer]}>
            <FlatList
                style={[utilities.flexed]}
                data={chats}
                renderItem={({ item }) => <ChatCard chat={item} navigation={navigation} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    ) : (
        <LoadingScreen message={'Start Connecting!'} />
    );
};

export default ChatsOverview;
