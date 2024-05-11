import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

import DetailsPill from '../Elements/DetailsPill/DetailsPill';
import ProfileDetailsPicker from '../ProfileDetailsPicker/ProfileDetailsPicker';

import { colors } from '../../styles/utilities';

const { styles } = require('./styles');

const UserInfoForm = ({ userInfo, setUserInfo, handlePress, profileProperties }) => {
    return (
        <View>
            <Text style={styles.inputTextProfile}>{userInfo.role_id == 2 ? 'Description' : 'Bio'}</Text>
            <TextInput
                key={'about'}
                placeholder="Tell us about yourself!"
                placeholderTextColor={colors.gray}
                cursorColor={colors.primary}
                style={{ marginBottom: 20, color: colors.lightGray }}
                value={userInfo.about}
                onChangeText={(text) => setUserInfo((prev) => ({ ...prev, about: text }))}
            />
            {userInfo.role_id == 2 && (
                <>
                    <Text style={styles.inputTextProfile}>Venue Name</Text>
                    <TextInput
                        key={'venue_name'}
                        placeholder="Venue Name"
                        placeholderTextColor={colors.gray}
                        cursorColor={colors.primary}
                        style={{ marginBottom: 20 }}
                        value={userInfo.venue_name}
                        onChangeText={(text) => setUserInfo((prev) => ({ ...prev, venue_name: text }))}
                    />
                </>
            )}
            <View>
                <Text style={styles.inputTextProfile}>{userInfo.role_id == 2 ? 'Description' : 'Bio'}</Text>
                <TextInput
                    key={'about'}
                    placeholder="Tell us about yourself!"
                    placeholderTextColor={colors.gray}
                    cursorColor={colors.primary}
                    style={{ marginBottom: 20, color: colors.lightGray }}
                    value={userInfo.about}
                    onChangeText={(text) => setUserInfo((prev) => ({ ...prev, about: text }))}
                />
                {userInfo.role_id == 2 && (
                    <>
                        <Text style={styles.inputTextProfile}>Venue Name</Text>
                        <TextInput
                            key={'venue_name'}
                            placeholder="Venue Name"
                            placeholderTextColor={colors.gray}
                            cursorColor={colors.primary}
                            style={{ marginBottom: 20 }}
                            value={userInfo.venue_name}
                            onChangeText={(text) => setUserInfo((prev) => ({ ...prev, venue_name: text }))}
                        />
                    </>
                )}

                <View>
                    {Object.keys(profileProperties).map((key) => {
                        if (key === 'Music Genres') {
                            return (
                                <View key={profileProperties[key]}>
                                    <Text style={styles.inputTextProfile}>Music Genres</Text>
                                    <View style={styles.genresContainer}>
                                        {profileProperties[key] &&
                                            profileProperties[key].length > 0 &&
                                            profileProperties[key].map((genre) => (
                                                <DetailsPill
                                                    key={genre.id.toString()}
                                                    item={genre}
                                                    handlePress={handlePress}
                                                    isSelected={userInfo.genres.includes(genre.id)}
                                                />
                                            ))}
                                    </View>
                                </View>
                            );
                        }
                        return (
                            <ProfileDetailsPicker
                                key={key}
                                label={key}
                                items={profileProperties[key]}
                                selectedValue={
                                    key === 'Venue Type'
                                        ? userInfo['venue_type_id']
                                        : userInfo[key.toLowerCase() + '_id']
                                }
                                onValueChange={(value) => handlePickerChange(key, value)}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default UserInfoForm;
