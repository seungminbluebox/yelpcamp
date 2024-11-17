// seeds/index.js
const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error!'))
db.once('open', () => {
    console.log('database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const price = Math.floor(Math.random() * 20) + 1
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: '672eef28fb3692d64766fbaa',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea voluptas veritatis officia eius nemo at ratione quisquam nesciunt laborum hic! Sapiente expedita alias illum accusantium eligendi rerum odio, facilis atque.',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [{
                url: 'https://res.cloudinary.com/dxpjymxcx/image/upload/v1731473240/YelpCamp/bbdzcys1despcm2jb952.png',
                filename: 'YelpCamp/bbdzcys1despcm2jb952',
            },
            {
                url: 'https://res.cloudinary.com/dxpjymxcx/image/upload/v1731473240/YelpCamp/tqhnsljteb0iem82m9nd.png',
                filename: 'YelpCamp/tqhnsljteb0iem82m9nd',
            }]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})