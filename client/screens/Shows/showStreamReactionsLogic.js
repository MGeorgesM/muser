import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../contexts/UserContext';
import { fireStoreDb } from '../../config/firebase';
import { collection, query, onSnapshot, serverTimestamp, orderBy, doc, addDoc, setDoc } from 'firebase/firestore';

export const useShowStreamReactionsLogic = (show) => {
    const { currentUser } = useUser();
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState('');
    const [videoIsLiked, setVideoIsLiked] = useState(false);

    useEffect(() => {
        let unsubscribeComments;

        const fetchComments = async () => {
            unsubscribeComments = await setupCommentsListener(show.id);
        };

        fetchComments();

        return () => {
            if (unsubscribeComments) {
                unsubscribeComments();
            }
        };
    }, [show.id]);

    const setupCommentsListener = async (showId) => {
        const commentsRef = collection(fireStoreDb, 'shows', showId.toString(), 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribeComments = onSnapshot(q, (snapshot) => {
            const fetchedComments = snapshot.docs.map((doc) => ({
                _id: doc.id,
                text: doc.data().text,
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                userAvatar: doc.data().userAvatar,
                userId: doc.data().userId,
            }));
            setComments(fetchedComments);
        });

        return unsubscribeComments;
    };

    const createShowAndComments = async (initialComment) => {
        const newShowRef = doc(collection(fireStoreDb, 'shows'));
        const commentsRef = collection(newShowRef, 'comments');
        try {
            await addDoc(commentsRef, {
                text: initialComment,
                createdAt: serverTimestamp(),
                userAvatar: currentUser.picture,
                userId: currentUser.id,
            });

            await setDoc(newShowRef, {
                showId: show.id,
                createdAt: serverTimestamp(),
            });
        } catch (error) {}
    };

    const onSend = useCallback(
        async (comment) => {
            let showRef = doc(fireStoreDb, 'shows', show.id.toString());

            if (!showRef) {
                await createShowAndComments(comment);
            } else {
                const commentsRef = collection(showRef, 'comments');

                await addDoc(commentsRef, {
                    text: comment,
                    createdAt: serverTimestamp(),
                    userAvatar: currentUser.picture,
                    userId: currentUser.id,
                });
            }
        },
        [fireStoreDb, show.id, currentUser.id]
    );

    const handleLike = async () => {
        if (videoIsLiked) return;
        setVideoIsLiked(!videoIsLiked);
        await onSend('❤');
    };

    const handlePostComment = () => {
        if (userComment.trim()) {
            onSend(userComment);
            setUserComment('');
        }
    };

    return {
        onSend,
        comments,
        handleLike,
        userComment,
        videoIsLiked,
        setUserComment,
        handlePostComment,
    };
};

export default useShowStreamReactionsLogic;
