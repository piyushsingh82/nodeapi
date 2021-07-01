const mongoose = require("mongoose");
require('dotenv').config()
mongoose.promise = global.promise;

const MONGOURI = "mongodb+srv://admin123:admin@1234@cluster0.4hxea.mongodb.net/userlogindata?retryWrites=true&w=majority"

mongoose
  .connect( process.env.MONGOURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, //to be set to false to handle put change for findOneAndUpdate
  }).then(()=>{
    console.log("Db connected successfully");
}).catch((e)=>{
    console.log("Error connecting DB " + e);
})