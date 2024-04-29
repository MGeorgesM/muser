const hours = [];

for (let i = 0; i < 24; i++) {

    const hourString = `${i < 10 ? '0' + i : i}:00`;

    hours.push({
        id: `${i}`,
        name: hourString,
    });
}

export default hours;
