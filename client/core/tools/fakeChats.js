const avatar = require('../../assets/avatar.png');

const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const chatsData = [
    { _id:'tysoGUDcZ3MvRoBpyvcSQUoom2n1', username: 'Georges Mouawad', lastMessage: { text: 'Hey, how are you?', createdAt: '10:45 AM' }, photo: avatar },
    { _id:'au2B1vguBTOA2zZQp6VVcGoMt1C2', username: 'Karam Fayad', lastMessage: { text: 'Are we still on for today?', createdAt: 'Yesterday' }, photo: avatar },
    { _id:generateId(), username: 'Sami Zayn', lastMessage: { text: 'That sounds great!', createdAt: 'Yesterday' }, photo: avatar },
    { _id:generateId(), username: 'Elias Murr', lastMessage: { text: 'I will send the documents.', createdAt: 'Apr 10' }, photo: avatar },
    { _id:generateId(), username: 'Tony Khalife', lastMessage: { text: 'Let’s meet tomorrow.', createdAt: 'Apr 9' }, photo: avatar },
    { _id:generateId(), username: 'Hala Fadel', lastMessage: { text: 'Thank you!', createdAt: 'Apr 8' }, photo: avatar },
    { _id:generateId(), username: 'Rami Ayash', lastMessage: { text: 'See you then.', createdAt: 'Apr 7' }, photo: avatar },
    { _id:generateId(), username: 'Nora Rahal', lastMessage: { text: 'Okay, bye.', createdAt: 'Apr 6' }, photo: avatar },
    { _id:generateId(), username: 'Simon Asmar', lastMessage: { text: 'Sounds good to me.', createdAt: 'Apr 5' }, photo: avatar },
    { _id:generateId(), username: 'Ziad Baroud', lastMessage: { text: 'I’ve completed the task.', createdAt: 'Apr 4' }, photo: avatar }
  ];

  export default chatsData;