const experiences = ['Beginner', 'Intermediate', 'Advanced'];
const availabilities = ['Morning', 'Afternoon', 'Evening'];
const genres = [
    'Rock', 'Pop', 'Jazz', 'Blues', 'Metal', 'Folk', 'Country', 'Classical',
    'Electronic', 'Hip-Hop', 'Rap', 'Reggae', 'R&B', 'Soul', 'Punk', 'Indie', 'Other'
];
const instruments = ['Guitar', 'Bass', 'Drums', 'Vocals', 'Keyboard', 'Strings', 'Other'];
const locations = ['North', 'South', 'Beirut', 'Mount Lebanon', 'Bekaa', 'Baalbek-Hermel', 'Other'];
const girlimage = require('../../assets/girlimage.jpg');
const guyimage = require('../../assets/guyimage.jpg');


const users = Array.from({ length: 10 }, (_, i) => ({
    firebaseUserId: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    name: `User ${i + 1}`,
    userType: 'musician',
    about: `About User ${i + 1}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    profilePicture: i % 2 === 0 ? girlimage : guyimage,
    musicianProfile: {
        experience: experiences[Math.floor(Math.random() * experiences.length)],
        availability: availabilities[Math.floor(Math.random() * availabilities.length)],
        genre: genres[Math.floor(Math.random() * genres.length)],
        instrument: instruments[Math.floor(Math.random() * instruments.length)],
    },
    venueProfile: undefined
}));

export default users;

console.log(users);