export const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp || !firestoreTimestamp.seconds) {
        return 'Invalid timestamp';
    }

    // Convert Firestore Timestamp to JavaScript Date
    const date = new Date(firestoreTimestamp.seconds * 1000);
    const now = new Date();
    
    // Reset hours, minutes, seconds, and milliseconds for today's comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const daysAgo = (today - dateDay) / oneDay;

    // Formatting options
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const weekdayOptions = { weekday: 'long' };

    if (daysAgo < 1) {
        // It's today, show only time in HH:MM format
        return date.toLocaleTimeString('en-US', timeOptions);
    } else if (daysAgo < 7) {
        // Within the last week, show the day of the week
        return date.toLocaleDateString('en-US', weekdayOptions);
    } else {
        // It's older than last week, show date in dd/mm/yy format
        return date.toLocaleDateString('en-GB', dateOptions);
    }
};

