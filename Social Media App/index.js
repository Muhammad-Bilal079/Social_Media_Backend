const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require("./routes/users.js")
const authRoutes = require("./routes/auth.js")
const postRoutes = require("./routes/posts.js")

const app = express();
dotenv.config();

// connect mongoDB 
mongoose.connect(process.env.MONGO_URL)   
.then(()=>console.log('connected to database'))
.catch((err)=>console.log(err))

// MiddleWare
app.use(express.json());
app.use(helmet())
app.use(morgan('common'))

app.use("/api/users" , userRoutes)
app.use("/api/auth" , authRoutes)
app.use("/api/posts" , postRoutes)





port = 5000
app.listen(port,()=>{
console.log('Backend server is running.....!');
});

