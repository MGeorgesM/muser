export function generateHours() {
    const hours = [];
    for (let i = 10; i < 24; i++) {
        const hourString = `${i < 10 ? '0' + i : i}:00`;
        hours.push({
            id: `${i}`,
            name: hourString,
        });
    }
    return hours;
}

export const generateRandomDates = (numDates) => {
    const dates = [];

    for (let i = 0; i < numDates; i++) {
        const year = Math.floor(Math.random() * 20) + 2000;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;

        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dates.push({
            id: i + 1,
            name: date,
        });
    }

    return dates;
};
