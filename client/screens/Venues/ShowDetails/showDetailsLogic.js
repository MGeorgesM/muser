import React, { useEffect, useState } from 'react';
import { addShow } from '../../../core/data/store/Shows';
import { useDispatch } from 'react-redux';
import { generateHours, durations } from '../../../core/tools/generateDatetime';
import { sendRequest, requestMethods } from '../../../core/tools/apiRequest';

const useShowDetailsLogic = (venueId) => {
    const [switchHandler, setSwitchHandler] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [userBands, setUserBands] = useState([]);
    const [genres, setGenres] = useState([]);
    const [showBooking, setShowBooking] = useState({
        date: '',
        time: '',
        duration: '',
        band_id: '',
        venue_id: venueId,
        picture: '',
        genre_id: '',
    });

    const hours = generateHours();

    const pickerConfig = [
        {
            items: userBands,
            label: 'Band',
            selectedValue: showBooking.band_id,
            key: 'band_id',
        },
        {
            items: genres,
            label: 'Main Genre',
            selectedValue: showBooking.genre_id,
            key: 'genre_id',
        },
        {
            items: hours,
            label: 'Show Time',
            selectedValue: showBooking.time,
            key: 'time',
        },
        {
            items: durations,
            label: 'Duration',
            selectedValue: showBooking.duration,
            key: 'duration',
        },
    ];
    const dispatch = useDispatch();

    useEffect(() => {
        getUserBands();
        getGenres();
    }, []);

    const getUserBands = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, 'bands/me', null);
            if (response.status !== 200) throw new Error('Failed to fetch user bands');
            setUserBands(response.data);
        } catch (error) {
            console.log('Error fetching user bands:', error);
        }
    };
    const getGenres = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, 'genres', null);
            if (response.status !== 200) throw new Error('Failed to fetch genres');
            setGenres(response.data);
        } catch (error) {
            console.log('Error fetching genres:', error);
        }
    };

    const validateForm = () => {
        setValidationError(null);
        if (
            showBooking.date === '' ||
            showBooking.time === '' ||
            showBooking.duration === '' ||
            showBooking.band_id === '' ||
            showBooking.genre === ''
        ) {
            setValidationError('Please fill in all fields');
            return false;
        } else {
            setValidationError(null);
            return true;
        }
    };

    const handleSelectCard = (cardId) => {
        setSelectedCardId((prevSelectedCardId) => {
            if (prevSelectedCardId === cardId) {
                setShowBooking({
                    ...showBooking,
                    date: null,
                    time: null,
                });
                return null;
            } else {
                return cardId;
            }
        });
    };

    const handleCreateShow = async () => {
        setValidationError(null);
        const userInputValid = validateForm();
        if (!userInputValid) return;

        try {
            const response = await sendRequest(requestMethods.POST, 'shows', showBooking);
            if (response.status !== 201) throw new Error('Failed to create show');
            dispatch(addShow(response.data));
            setSwitchHandler(true);
        } catch (error) {
            console.log('Error creating show:', error.message);
            setValidationError('Failed to create show');
        }
    };

    const handleProceed = () => {
        switchHandler ? navigation.goBack() : handleCreateShow();
    };
    return {
        showBooking,
        pickerConfig,
        handleProceed,
        switchHandler,
        setShowBooking,
        selectedCardId,
        validationError,
        handleSelectCard,
    };
};

export default useShowDetailsLogic;
