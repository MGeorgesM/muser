export const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp || !firestoreTimestamp.seconds) {
        return 'Invalid timestamp';
    }

    const date = new Date(firestoreTimestamp.seconds * 1000);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const oneDay = 24 * 60 * 60 * 1000;
    const daysAgo = (today - dateDay) / oneDay;

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const weekdayOptions = { weekday: 'long' };

    if (daysAgo < 1) {
        return date.toLocaleTimeString('en-US', timeOptions);
    } else if (daysAgo < 7) {
        return date.toLocaleDateString('en-US', weekdayOptions);
    } else {
        return date.toLocaleDateString('en-GB', dateOptions);
    }
};

export function truncateText(text, maxLength = 28) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

export function formatDateString(inputDate) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const date = new Date(inputDate);

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];

    const suffix = ['th', 'st', 'nd', 'rd'][day % 100 >= 11 && day % 100 <= 13 ? 0 : day % 10] || 'th';

    return `${dayName}, ${monthName} ${day}${suffix} `;
}
