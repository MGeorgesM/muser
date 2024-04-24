const showImage = require('../../assets/show.jpg');
const avatar = require('../../assets/avatar.png');

const shows = [
    {
        name: 'The Jazzy Show',
        date: '24/03/2024',
        imageUrl: showImage,
        band: {
            members: [
                { name: 'John Doe', avatar: avatar },
                { name: 'Jane Doe', avatar: avatar },
                { name: 'Jim Beam', avatar: avatar },
            ],
        },
    },
    {
        name: 'Rock Revival',
        date: '15/04/2024',
        imageUrl: showImage,
        band: {
            members: [
                { name: 'Jill Valentine', avatar: avatar },
                { name: 'Janet Jackson', avatar: avatar },
                { name: 'Jack Ripper', avatar: avatar },
                { name: 'Jack Ripper', avatar: avatar },
            ],
        },
    },
    {
        name: 'Classical Nights',
        date: '05/05/2024',
        imageUrl: showImage,
        band: {
            members: [
                { name: 'Jeremy Elbert', avatar: avatar },
                { name: 'Jessica Alba', avatar: avatar },
            ],
        },
    },
    {
        name: 'Pop Sensations',
        date: '20/06/2024',
        imageUrl: showImage,
        band: {
            members: [
                { name: 'Jim Beam', avatar: avatar },
                { name: 'Jill Valentine', avatar: avatar },
            ],
        },
    },
    {
        name: 'Indie Vibes',
        date: '11/07/2024',
        imageUrl: showImage,
        band: {
            members: [
                { name: 'Jack Ripper', avatar: avatar },
                { name: 'Janet Jackson', avatar: avatar },
                { name: 'Jeremy Elbert', avatar: avatar },
            ],
        },
    },
    {
        name: 'Blues Bash',
        date: '23/08/2024',
        imageUrl: showImage,
        band: {
            members: [
                { name: 'Jessica Alba', avatar: avatar },
            ],
        },
    },
];

export default shows;
