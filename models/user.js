const mongoose = require('mongoose');

const main = async function() {
    await mongoose.connect('mongodb://127.0.0.1:27017/rsDB');
}

main()
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log('Error: ', err))

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: { _id: false },
            street: String,
            city: String,
            state: String,
            country: {
                type: String,
                required: true
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

const makeUser = async () => {
    const u = new User({
        first: 'Harry',
        last: 'Potter',
    });
    u.addresses.push({
        street: '123 Sesame',
        city: 'New York',
        state: 'NY',
        country: 'USA',
    })
    const res = await u.save();
    console.log(res);
}

const addAddress = async (id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: '222 Sesame',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })
    const res = await user.save();
    console.log(res);
};

// makeUser();

addAddress('6448160ffd98ba46018ea956');