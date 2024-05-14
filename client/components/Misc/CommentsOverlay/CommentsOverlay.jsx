import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import CommentCard from '../../Cards/CommentCard/CommentCard';

const CommentsOverlay = ({ comments, bottom = 42, left = 0 }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={[styles.commentsContainer, { bottom: comments.length > 1 ? bottom : 8, left: left }]}
        >
            {comments &&
                comments.length > 0 &&
                comments.map((comment) => (
                    <CommentCard key={comment._id} avatar={comment.userAvatar} text={comment.text} />
                ))}
        </ScrollView>
    );
};

export default CommentsOverlay;

const styles = StyleSheet.create({
    commentsContainer: {
        opacity: 0.8,
        position: 'absolute',
        height: 80,
        zIndex: 999,
    },
});
