export function generateHours() {
    const hours = [];
    for (let i = 15; i < 24; i++) {
        const hourString = `${i < 10 ? '0' + i : i}:00`;
        hours.push({
            id: hourString,
            name: hourString,
        });
    }
    return hours;
}

export const generateRandomDates = (numDates) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < numDates; i++) {
        // Random number of days from 0 to 6
        const daysToAdd = Math.floor(Math.random() * 7);

        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + daysToAdd);

        const year = futureDate.getFullYear();
        const month = futureDate.getMonth() + 1; // getMonth() returns month from 0-11
        const day = futureDate.getDate();

        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dates.push({
            id: date,
            name: date,
        });
    }

    return dates;
};

export const durations = [
    {
        id: 1,
        name: '1 hour',
        value: 1,
    },
    {
        id: 2,
        name: '2 hours',
        value: 2,
    },
    {
        id: 3,
        name: '3 hours',
        value: 3,
    },
    {
        id: 4,
        name: '> 3 hours',
        value: 4,
    },
];
