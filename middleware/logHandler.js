const { format } = require('date-fns');
const fs = require('fs');

const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, fileName) => {
  const now = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`;
  const logData = `${now}\t${message}\n`;

  const logPath = path.join(__dirname, '..', 'logs');

  try {
    if (!fs.existsSync(logPath)) {
      await fsPromises.mkdir(logPath);
    }
    await fsPromises.appendFile(path.join(logPath, fileName), logData);
  } catch(err) {
    throw new Error(err.message);
  }
}


// creating middleware
const logger = (req, res, next) => {
  logEvents(`${req.METHOD}\t${req.header.origin}\t${req.url}`, 'serverLogs.txt');
  next();
}

module.exports = { logger, logEvents };