// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {
//     HostLivestream,
//     StreamCall,
//     StreamVideo,
//     StreamVideoClient,
//     ViewerLivestream,
// } from '@stream-io/video-react-native-sdk';

// import { useUser } from '../contexts/UserContext';
// import { profilePicturesUrl } from '../core/tools/apiRequest';

// const StreamS = () => {
//     const [call, setCall] = useState(null);
//     const [streamToken, setStreamToken] = useState(null);
//     const [startStream, setStartStream] = useState(false);
//     const [user, setUser] = useState({});
//     const [client, setClient] = useState(null);
//     const [watchMode, setWatchMode] = useState(false);

//     const { currentUser } = useUser();

//     const streamId = 116888991;
//     const apiKey = 'cpt9ax3gakj3';

//     useEffect(() => {
//         if (currentUser && Object.keys(currentUser).length === 0) return;

//         const user = { id: currentUser?.id.toString(), name: currentUser?.name, image: profilePicturesUrl+currentUser?.picture };

//         const getStreamToken = async () => {
//             const token = await AsyncStorage.getItem('streamToken');
//             setStreamToken(token);
//         };

//         getStreamToken();

//         if (!streamToken || Object.keys(user).length === 0) return;

//         console.log('Stream token:', streamToken);
//         console.log('User!:', user.id);

//         streamClient = new StreamVideoClient({
//             apiKey,
//             user,
//             token: streamToken,
//             options: {
//                 logLevel: 'error',
//             },
//         });

//         console.log('Clientsetup:', streamClient);

//         setClient(streamClient);
//     }, [streamId]);

//     const joinCall = async () => {
        
//         console.log('client:', client);
//         try {
//             const call = client.call('livestream', streamId);
//             await call.join({ create: true });
//             setCall(call);
//         } catch (error) {
//             console.error('Error joining call:', error);
//         }
//     };

//     // const handleStreamEnd = async () => {
//     //     try {
//     //         await call.end();
//     //     } catch (error) {
//     //         console.error('Error ending stream:', error);
//     //     }
//     // };

//     if (call === null)
//         return (
//             <View style={styles.liveStreamStartContainer}>
//                 <TouchableOpacity onPress={joinCall} style={styles.callStartBtn}>
//                     <Text style={{ color: 'white' }}>Start Stream</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => {
//                         setWatchMode(true);
//                         joinCall();
//                     }}
//                     style={styles.callJoinBtn}
//                 >
//                     <Text style={{ color: 'white' }}>Watch Stream</Text>
//                 </TouchableOpacity>
//             </View>
//         );

//     return (
//         <StreamVideo client={client}>
//             <StreamCall call={call}>
//                 <SafeAreaView style={{ flex: 1 }}>
//                     {!watchMode ? (
//                         <HostLivestream onStartStreamHandler={() => setStartStream(true)} />
//                     ) : (
//                         <ViewerLivestream />
//                     )}
//                 </SafeAreaView>
//             </StreamCall>
//         </StreamVideo>
//     );
// };

// export default StreamS;

// const styles = StyleSheet.create({
//     liveStreamStartContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 8,
//     },
//     callStartBtn: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'blue',
//         padding: 10,
//     },
//     callJoinBtn: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'green',
//         padding: 10,
//     },
// });















// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button } from 'react-native';
// import { useCall, useCallStateHooks, useIncallManager, VideoRenderer } from '@stream-io/video-react-native-sdk';

// import InCallManager from 'react-native-incall-manager';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {
//     HostLivestream,
//     StreamCall,
//     StreamVideo,
//     StreamVideoClient,
//     ViewerLivestream,
// } from '@stream-io/video-react-native-sdk';

// import { useUser } from '../contexts/UserContext';
// import { profilePicturesUrl } from '../core/tools/apiRequest';

// const StreamS = () => {
//     const [call, setCall] = useState(null);
//     const [streamToken, setStreamToken] = useState(null);
//     const [startStream, setStartStream] = useState(false);
//     const [user, setUser] = useState({});
//     const [client, setClient] = useState(null);
//     const [watchMode, setWatchMode] = useState(false);
//     // const [streamDisplay, setStreamDisplay] = useState(false);

//     const { currentUser } = useUser();

//     const streamId = 116888991559666;
//     const apiKey = 'cpt9ax3gakj3';

//     const stopLivestream = async () => {
//         if (call) {
//             await call.stopLive().catch(console.error);
//             await call.endCall().catch(console.error); // Ensures the call is fully terminated
//             InCallManager.stop(); // Stop InCallManager which manages audio and video resources
//         }
//     };

//     const LivestreamUI = () => {
//         const call = useCall();

//         const { useParticipantCount, useLocalParticipant, useIsCallLive } = useCallStateHooks();

//         const totalParticipants = useParticipantCount();
//         const localParticipant = useLocalParticipant();
//         const isCallLive = useIsCallLive();

//         // Automatically route audio to speaker devices as relevant for watching videos.
//         useEffect(() => {
//             InCallManager.start({ media: 'video' });
//             return () => InCallManager.stop();
//         }, []);

//         return (
//             <View style={styles.flexed}>
//                 <Text style={styles.text}>Live: {totalParticipants}</Text>
//                 <View style={styles.flexed}>
//                     {localParticipant && <VideoRenderer participant={localParticipant} trackType="videoTrack" />}
//                 </View>
//                 <View style={styles.bottomBar}>
//                     {isCallLive ? (
//                         <Button onPress={stopLivestream} title="Stop Livestream" />
//                     ) : (
//                         <Button
//                             onPress={() => {
//                                 call?.goLive();
//                             }}
//                             title="Start Livestream"
//                         />
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     useEffect(() => {
//         if (currentUser && Object.keys(currentUser).length === 0) return;

//         const user = {
//             id: currentUser?.id.toString(),
//             name: currentUser?.name,
//             image: profilePicturesUrl + currentUser?.picture,
//         };

//         const getStreamToken = async () => {
//             const token = await AsyncStorage.getItem('streamToken');
//             setStreamToken(token);
//         };

//         getStreamToken();

//         if (!streamToken || Object.keys(user).length === 0) return;

//         console.log('Stream token:', streamToken);
//         console.log('User!:', user.id);

//         streamClient = new StreamVideoClient({
//             apiKey,
//             user,
//             token: streamToken,
//             options: {
//                 logLevel: 'debug',
//             },
//         });

//         console.log('Clientsetup:', streamClient);

//         setClient(streamClient);

//     }, [currentUser, streamId]);

//     const joinCall = async () => {
//         console.log('client:', client);
//         try {
//             const call = client.call('livestream', streamId);
//             await call.join({ create: true });
//             setCall(call);
//         } catch (error) {
//             console.error('Error joining call:', error);
//         }
//     };

//     // const handleStreamEnd = async () => {
//     //     try {
//     //         await call.end();
//     //     } catch (error) {
//     //         console.error('Error ending stream:', error);
//     //     }
//     // };

//     const handleEnd = async () => {};

//     if (call === null)
//         return (
//             <View style={styles.liveStreamStartContainer}>
//                 <TouchableOpacity onPress={joinCall} style={styles.callStartBtn}>
//                     <Text style={{ color: 'white' }}>Start Stream</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => {
//                         setWatchMode(true);
//                         joinCall();
//                     }}
//                     style={styles.callJoinBtn}
//                 >
//                     <Text style={{ color: 'white' }}>Watch Stream</Text>
//                 </TouchableOpacity>
//             </View>
//         );

//     return (
//         <StreamVideo client={client}>
//             <StreamCall call={call}>
//                 <SafeAreaView style={{ flex: 1 }}>
//                     {!watchMode ? (
//                         <LivestreamUI />
//                     ) : (
//                         // <HostLivestream
//                         //     onStartStreamHandler={() => setStartStream(true)}
//                         //     onEndStreamHandler={handleEnd}
//                         // />
//                         <ViewerLivestream />
//                     )}
//                 </SafeAreaView>
//             </StreamCall>
//         </StreamVideo>
//     );
// };

// export default StreamS;

// const styles = StyleSheet.create({
//     liveStreamStartContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 8,
//     },
//     callStartBtn: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'blue',
//         padding: 10,
//     },
//     callJoinBtn: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'green',
//         padding: 10,
//     },
//     flexed: {
//         flex: 1,
//     },
//     text: {
//         alignSelf: 'center',
//         color: 'white',
//         backgroundColor: 'blue',
//         padding: 6,
//         margin: 4,
//     },
//     bottomBar: {
//         alignSelf: 'center',
//         margin: 4,
//     },
// });
