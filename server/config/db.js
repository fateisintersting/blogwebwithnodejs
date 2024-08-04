const mongoose = require('mongoose');
mongoose.set("strictQuery", true);

const connection  = async (url) =>{
    try {
      return mongoose.connect(url);
      } catch (error) {
        console.error('Database connection error:', error);
      }
    };


module.exports = connection;


