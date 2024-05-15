import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { colors, utilities } from '../../../../styles/utilities';

import CommentCard from '../../../Cards/CommentCard/CommentCard';

const VideoComments = ({ comments }) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.commentsContainer}>
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <CommentCard key={comment._id} avatar={comment.userAvatar} text={comment.text} />
                ))
            ) : (
                <Text style={[utilities.myFontRegular, { color: colors.gray, paddingLeft: 20 }]}>No comments yet</Text>
            )}
        </ScrollView>
    );
};

export default VideoComments;

const styles = StyleSheet.create({
    commentsContainer: {
        flex: 1,
        paddingTop: 16,
        borderTopWidth: 0.5,
        borderTopColor: colors.lightGray,
    },
});
