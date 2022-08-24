// Database Configuration files
const mongoose = require("mongoose");
const { log, logError } = require("../utils/logging");
// const { MONGODB_URI } = process.env;

//To disable buffering
// mongoose.set("bufferCommands", false);

exports.connectToDB = async () => {
  //To disable buffering
  // mongoose.set("bufferCommands", false);

  //Connecting to the database.

  log("The MongoDB uri ", MONGODB_URI);
  await mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      log(`Successfully connected to MongoDB @ ${MONGODB_URI}`);
    })
    .catch((err) => {
      logError("Error connecting to database: ", err);
      throw new Error(err);
    });
};

exports.closeDBConnection = () => {
  return mongoose.disconnect();
};
