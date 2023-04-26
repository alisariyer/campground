const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/rsDB');
}

main()
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log('Error: ', err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
});

const farmSchema = new mongoose.Schema({
    name: String,
    city: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema);

// Product.insertMany([
//     { name: 'Goddess Melon', price: 4.99, season: 'Summer'},
//     { name: 'Asia Orange', price: 2.99, season: 'Winter'},
//     { name: 'Black Grapes', price: 3.99, season: 'Fall'},
//     { name: 'Gold Mango', price: 6.99, season: 'Fall'}
// ])

const makeFarm = async () => {
    const farm = new Farm({ name: 'Fully Belly Farms', city: 'Guinda, CA'});
    const melon = await Product.findOne({ name: 'Goddess Melon'});
    farm.products.push(melon);
    await farm.save();
    console.log(farm);
}

// makeFarm();

const addProduct = async () => {
    const farm = await Farm.findOne({ name: 'Fully Belly Farms'});
    const mango = await Product.findOne({ name: 'Gold Mango'});
    farm.products.push(mango);
    await farm.save();
}

// addProduct();

Farm.findOne({ name: 'Fully Belly Farms'})
    .populate('products')
    .then(farm => console.log(farm));