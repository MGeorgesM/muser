import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { colors, utilities } from '../styles/utilities';

import chatsData from '../core/tools/fakeChats';





const ChatOverview = ({ navigation }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
        headerTitle: 'Chats',
    });
  })


  console.log(chatsData)
    const ChatCard = ({ chat }) => {
        return (
            <TouchableOpacity
                style={styles.chatCardContainer}
                onPress={() => navigation.navigate('ChatDetails', { chat })}
            >
                <View style={[utilities.flexRow, utilities.center]}>
                    <Image source={chat.photo} style={styles.photo} />
                    <View>
                        <Text style={[utilities.textM, utilities.textBold, { color: colors.black }]}>{chat.username}</Text>
                        <Text style={[utilities.textXS, { color: colors.gray }]}>
                            {chat.lastMessage.text}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={[utilities.textXS, { color: colors.gray }]}>{chat.lastMessage.createdAt}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList style={utilities.container}
         data={chatsData}
         renderItem={({ item }) => <ChatCard chat={item} />}
         keyExtractor={item => item.username}>
        </FlatList>
    );
};

export default ChatOverview;

const styles = StyleSheet.create({
    chatCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
    photo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
});
