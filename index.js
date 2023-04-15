import express from 'express';
import cors from 'cors'; 
import mongoose from 'mongoose';


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
const databaseName = "fakeStore";
const url = 'mongodb+srv://ashishbhadauriya5344:mxGwE7ZL5WPx9S3J@cluster0.nynqgrr.mongodb.net/?retryWrites=true&w=majority'
// const url = `mongodb://localhost:27017/${databaseName}`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    phone: Number,
    email: {
        type: String,
        unique: true
    },
    password: String
});
const productSchema = new mongoose.Schema({
    category: String,
    description: String,
    title: String,
    image: String,
    id : Number,
    rating: Object,
    price: Number
});


const UserModel = new mongoose.model("user", userSchema);
const ProductModel = new mongoose.model("product", productSchema);


// app.post('/addAllProducts', async (req, res) => {
//     try {
//         const {data} =  req.body;
//         await ProductModel.insertMany(data);
//         res.status(200).send({ msg: "success" });

//     } catch (error) {
//         res.status(404).send({ msg: "something went wrong" });
//     }
// })

app.post('/createUser', async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        const isUserExist = await UserModel.findOne({ email });
        if (isUserExist) {
            return res.status(203).send({ msg: "user already exist" });
        }

        const userData = new UserModel({ username, phone, email, password });
        await userData.save();
        res.status(200).send({ msg: "success" });

    } catch (error) {
        res.status(404).send({ msg: "something went wrong" });
    }
})

app.post('/getUser', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const isUserExist = await UserModel.findOne({ email });
        console.log(isUserExist);
        if (isUserExist && isUserExist.email === email && isUserExist.password === password) {
            return res.status(200).send(isUserExist);
        }

        res.status(203).send({ msg: "User not found" });

    } catch (error) {
        res.status(404).send({ msg: "something went wrong" });
    }
})

app.listen(5000, () => {
    console.log("server started at 5000");
})
