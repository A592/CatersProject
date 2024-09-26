const User = require('./models/userModel');

const newUser = new User({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'hashedpassword',
    role: 'user'
});

newUser.save().then(() => {
    console.log('User saved');
}).catch((error) => {
    console.log('Error saving user:', error);
});