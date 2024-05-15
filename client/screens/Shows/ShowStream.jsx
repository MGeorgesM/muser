import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native';
import { StreamCall, ViewerLivestream } from '@stream-io/video-react-native-sdk';
import { colors, utilities } from '../../styles/utilities';

import VideoControls from '../../components/Misc/VideoControls/VideoControls';
import VideoDetails from '../../components/Misc/VideoDetails/VideoDetails';
import UserComposer from '../../components/Misc/UserComposer/UserComposer';
import CommentCard from '../../components/Cards/CommentCard/CommentCard';
import CommentsOverlay from '../../components/Misc/CommentsOverlay/CommentsOverlay';

import useKeyboardVisibility from '../../core/tools/keyboardVisibility';
import useShowStreamReactionsLogic from './showStreamReactionsLogic';
import useShowStreamCallLogic from './showStreamCallLogic';

const ShowStream = ({ route }) => {
    const { show } = route.params;
    // const showId = show.id.toString() + 'DEMO' ?? {};
    const keyboardVisible = useKeyboardVisibility();
    const { comments, handleLike, userComment, videoIsLiked, setUserComment, reactionsVisible, handlePostComment } =
        useShowStreamReactionsLogic(show.id);

    const {
        call,
        videoIsPlaying,
        controlsVisible,
        videoIsMaximized,
        handleUserTouches,
        handleVideoSizeToggle,
        handleUserStreamInteraction,
    } = useShowStreamCallLogic(show.id);

    return (
        <View style={utilities.flexed}>
            <View style={[utilities.flexed, { backgroundColor: colors.bgDark }]}>
                <View style={{ flex: 1, position: 'relative' }}>
                    {call ? (
                        <StreamCall call={call}>
                            <View
                                style={{ height: videoIsMaximized ? height * 1 : height * 0.5, position: 'relative' }}
                            >
                                <ViewerLivestream
                                    ViewerLeaveStreamButton={null}
                                    ViewerLivestreamTopView={null}
                                    ViewerLivestreamControls={null}
                                />
                            </View>
                        </StreamCall>
                    ) : (
                        !videoIsMaximized && <View style={styles.maximizedView} />
                    )}
                    <VideoControls
                        videoIsPlaying={videoIsPlaying}
                        controlsVisible={controlsVisible}
                        videoIsMaximized={videoIsMaximized}
                        handleUserTouches={handleUserTouches}
                        handleVideoSizeToggle={handleVideoSizeToggle}
                        handleUserStreamInteraction={handleUserStreamInteraction}
                    />
                </View>
                {!videoIsMaximized && show && (
                    <View style={[!keyboardVisible && utilities.flexed, { backgroundColor: colors.bgDark }]}>
                        <VideoDetails show={show} handleLike={handleLike} videoIsLiked={videoIsLiked} />
                        {!keyboardVisible && (
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.commentsContainer}>
                                {comments && comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <CommentCard
                                            key={comment._id}
                                            avatar={comment.userAvatar}
                                            text={comment.text}
                                        />
                                    ))
                                ) : (
                                    <Text style={[utilities.myFontRegular, { color: colors.gray, paddingLeft: 20 }]}>
                                        No comments yet
                                    </Text>
                                )}
                            </ScrollView>
                        )}
                    </View>
                )}
                {(!videoIsMaximized || reactionsVisible) && (
                    <KeyboardAvoidingView>
                        {videoIsMaximized && reactionsVisible && <CommentsOverlay comments={comments} bottom={48} />}
                        <UserComposer
                            placeholder="Write a comment"
                            value={userComment}
                            onChangeText={setUserComment}
                            onSendPress={handlePostComment}
                            overlay={videoIsMaximized}
                        />
                    </KeyboardAvoidingView>
                )}
            </View>
        </View>
    );
};

export default ShowStream;

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    commentsContainer: {
        flex: 1,
        paddingTop: 16,
        borderTopWidth: 0.5,
        borderTopColor: colors.lightGray,
    },

    maximizedComposer: {
        borderTopWidth: 1,
        borderTopColor: colors.white,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    userInputField: {
        height: 48,
        paddingRight: 20,
        borderTopWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: colors.lightGray,
    },

    maximizedView: {
        height: height * 0.5,
        backgroundColor: colors.bgDarkest,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
