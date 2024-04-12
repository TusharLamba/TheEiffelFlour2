const { logEvents } = require('./logHandler');

const errorHandler = (err, req, res, next) => {
  logEvents(`${req.url}\t${err.name}\t\t${err.message}\n`, "errorLogs.txt");
  console.log("res in errorHandler",err);
  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).send("Internal Server Error");
  }
}

module.exports = errorHandler;