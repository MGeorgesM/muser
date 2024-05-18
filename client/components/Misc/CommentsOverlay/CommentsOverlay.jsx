import React, { useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import CommentCard from '../../Cards/CommentCard/CommentCard';

const CommentsOverlay = ({ comments, bottom = 0, left = 0 }) => {
    const scrollViewRef = useRef();

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [comments]);

    return (
        <View style={[styles.commentsContainer, { bottom: comments.length > 1 ? bottom : -32, left: left }]}>
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
            >
                {comments &&
                    comments.length > 0 &&
                    comments.map((comment) => (
                        <CommentCard key={comment._id} avatar={comment.userAvatar} text={comment.text} />
                    ))}
            </ScrollView>
        </View>
    );
};

export default CommentsOverlay;

const styles = StyleSheet.create({
    commentsContainer: {
        opacity: 0.8,
        position: 'absolute',
        height: 130,
        zIndex: 999,
    },
});
