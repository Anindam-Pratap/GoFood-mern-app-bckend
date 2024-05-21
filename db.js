const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://anindam835:Mongodb835@cluster0.51ppgv2.mongodb.net/GoFood?retryWrites=true&w=majority&appName=Cluster0"

const connectToMongo = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Mongo connected');

        // Get the collection and fetch data
        const GoFoodCollection = mongoose.connection.collection("food_items");
        const dat = await GoFoodCollection.find({}).toArray();
        try {
            const foodCategory = mongoose.connection.collection("foodCategory")
            const categoryData = await foodCategory.find({}).toArray()
            global.food_items = dat
            global.foodCategory = categoryData
        } catch (error) {
            
        }
        
        //console.log("Number of documents found:", dat.length);
        //console.log("Data:", dat);
        //global.food_items = dat
        //console.log(global.food_items )
        // Close the connection after fetching data
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1); // Exit with non-zero code to indicate failure
    }
};

module.exports = connectToMongo;
