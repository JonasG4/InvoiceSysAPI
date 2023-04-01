const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      dbName: process.env.DB_NAME
    });
    console.log("Database Connected!!!");
  } catch (error) {
    console.log(error);
    throw new Error("Error trying to initialize the Database");
  }
};

module.exports = {
  dbConnection,
};
