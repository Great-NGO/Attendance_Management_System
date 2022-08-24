require("dotenv").config();
const { connectToDB } = require("./config/database");

const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const PORT = process.env.PORT || process.env.SERVER_PORT;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { log, logError } = require("./utils/logging");
const { handleErrorResponse } = require("./utils/responseHandler");

const corsOption = {
  origin: ["*", "http://localhost:3000", "http://localhost:5500"],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

// To allow CORS
app.use(cors(corsOption));

// To allow json requests and decode requests from forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// To allow Cookies
app.use(cookieParser());
// For static rendering
app.use(express.static('client'))



// Routes
app.use('/api/v1', require('./routes/admin'))
app.use('/api/v1', require('./routes/lecturer'))
app.use('/api/v1', require('./routes/student'))
app.use('/api/v1', require('./routes/home'))
app.use('/api/v1', require('./routes/user'))


// app.get("/", (req, res) => {
//   res.send({ status: "Active" });
// });

// General Error Middleware handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.error,
    message: err.message || "Internal Server Error",
  });
});

// Return 404 page for all invalid GET requests
app.get('*', (req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, "../client", "404.html"));

})

// Return invalid response for every other type of requests
app.use("*", (req, res) => {
    handleErrorResponse(res, "Route does not exist", 404)
  // res.status(404).send({ error: true, message: "Route does not exist" , status: "error" });
});

const server = http.createServer(app);

connectToDB()
  .then(() => {
    // Starting server after database connection
    server.listen(PORT, () => {
      log(`Server listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    logError("Database Connection Failed!");
  });

// If any error in starting server
server.on("error", (err) => {
  logError(`Error Present: ${err}`);
  process.exit(1);
});

// If any unhandled rejection in our process
process.on("unhandledRejection", (error) => {
  logError("UNHANDLED REJECTION! Shutting Down!", error);
  process.exit(1);
});
