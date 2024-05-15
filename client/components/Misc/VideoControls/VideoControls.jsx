import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Play, Pause, Maximize, MessageSquare, MessageSquareOff } from 'lucide-react-native';

const VideoControls = () => {
    return (
        <Pressable style={StyleSheet.absoluteFill} onPress={handleUserTouches}>
            <Pressable onPress={handleUserStreamInteraction} style={styles.playButton}>
                {!videoIsPlaying ? (
                    <Play size={42} color={'white'} />
                ) : (
                    controlsVisible && <Pause size={42} color={'white'} />
                )}
            </Pressable>
            {videoIsPlaying && controlsVisible && (
                <>
                    <Pressable
                        onPress={handleVideoSizeToggle}
                        style={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            marginTop: 12,
                        }}
                    >
                        <Maximize size={24} color={'white'} />
                    </Pressable>
                    {videoIsMaximized && (
                        <Pressable
                            onPress={() => setReactionsVisible(!reactionsVisible)}
                            style={[styles.reactionsButton, { bottom: 12 }]}
                        >
                            {reactionsVisible ? (
                                <MessageSquare size={24} color={'white'} />
                            ) : (
                                <MessageSquareOff size={24} color={'white'} />
                            )}
                        </Pressable>
                    )}
                </>
            )}
        </Pressable>
    );
};

export default VideoControls;

const styles = StyleSheet.create({
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -21 }, { translateY: -21 }],
    },
    reactionsButton: {
        position: 'absolute',
        right: 12,
        marginTop: 12,
    },
});
