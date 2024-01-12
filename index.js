const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
// MongoDB Atlas connection string
const mongoUri = `mongodb+srv://${username}:${password}@cluster0.whzfogd.mongodb.net/dbform`;

// MongoDB model for registration
const Registration = mongoose.model('Registration', new mongoose.Schema({
    name: String,
    email: String,
    password: String,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser=await Registration.findOne({email:email});

        if(!existingUser){
            const formDetails = new Registration({
                name,
                email,
                password
            });
            await formDetails.save();
            res.redirect("/success");
        }else{
            alert("User already exist");
            res.redirect("/error");

        }
        
    } catch (error) {
        console.error(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/error.html");
});

// Connect to MongoDB Atlas
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Display a message when successfully connected to MongoDB
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB Atlas');
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
