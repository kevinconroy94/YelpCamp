const mongoose = require('mongoose');
const { discriminator } = require('../models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.set('strictQuery', false);
// alternate connect method --->  mongodb://127.0.0.1:27017
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63f77d34e9ddf9a50cdb66a7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo eveniet, omnis facilis laborum dolorum quod eaque nostrum animi ad, harum neque odio velit quasi debitis corrupti error. Excepturi, dignissimos quaerat! Aspernatur debitis corrupti, officiis voluptatem nisi explicabo laudantium nostrum veniam rerum! Facilis minima distinctio, a veniam quas maxime fuga autem aspernatur aliquid dolores illo alias labore id nesciunt placeat cupiditate.',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});