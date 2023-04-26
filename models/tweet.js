const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/rsDB');
}

main()
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log('Error: ', err));

const userSchema = new mongoose.Schema({
    username: String,
    age: Number,
});

const tweetSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

const makeTweets = async () => {
    // const user = new User({ username: 'yellowhat', age: 33 });
    const user = await User.findOne({ username: 'yellowhat'})
    const tweet = new Tweet({ text: 'Did you wak wak', likes: 50, user });
    await tweet.save();
}

// makeTweets();

const findTweet = async () => {
    // const tweet = await Tweet.findOne({}).populate('user');
    // const tweet = await Tweet.findOne({}).populate('user', 'username');
    const tweet = await Tweet.find({}).populate('user');
    console.log(tweet);
}

findTweet();