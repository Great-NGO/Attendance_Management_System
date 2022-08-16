const LCERROR = "\x1b[31m%s\x1b[0m"; //red
const LCWARN = "\x1b[33m%sx1b[0m"; //yellow
const LCINFO = "\x1b[36m%s\x1b[0m"; //cyan
const LCSUCCESS = "\x1b[32m%s\x1b[0m"; //green

const logger = class {
  static error(message, ...optionalParams) {
    console.error(LCERROR, message, ...optionalParams);
  }
  static warn(message, ...optionalParams) {
    console.warn(LCWARN, message, ...optionalParams);
  }
  static info(message, ...optionalParams) {
    console.info(LCINFO, message, ...optionalParams);
  }
  static log(message, ...optionalParams) {
    console.info(message, ...optionalParams);
  }
  static success(message, ...optionalParams) {
    console.info(LCSUCCESS, message, ...optionalParams);
  }
};

// logger.info("HELLO");
// logger.log("HELLO");
// logger.success("HELLO");
// logger.warn("HELLO");
// logger.error("HELLO");

// console.error("\x1b[31m%s\x1b[0m", "YYYY");

const getTimeStamp = () => {
  return new Date().toISOString();
};

const log = ( message, object) => {
  if (object) {
    logger.info(`[${getTimeStamp()}] [INFO] ${message}`, object);
  } else {
    logger.info(`[${getTimeStamp()}] [INFO] ${message}`);
  }
};

const info = ( message, object) => {
  if (object) {
    logger.info(`[${getTimeStamp()}] [INFO] ${message}`, object);
  } else {
    logger.info(`[${getTimeStamp()}] [INFO] ${message}`);
  }
};

const success = ( message, object) => {
  if (object) {
    logger.success(`[${getTimeStamp()}] [INFO] ${message}`, object);
  } else {
    logger.success(`[${getTimeStamp()}] [INFO] ${message}`);
  }
};

const warn = ( message, object) => {
  if (object) {
    logger.warn(`[${getTimeStamp()}] [WARN] ${message}`, object);
  } else {
    logger.warn(`[${getTimeStamp()}] [WARN] ${message}`);
  }
};

const debug = ( message, object) => {
  if (object) {
    logger.log(`[${getTimeStamp()}] [DEBUG] ${message}`, object);
  } else {
    logger.log(`[${getTimeStamp()}] [DEBUG] ${message}`);
  }
};

const logError = ( message, object) => {
  if (object) {
    logger.error(`[${getTimeStamp()}] [ERROR] ${message}`, object);
  } else {
    logger.error(`[${getTimeStamp()}] [ERROR] ${message}`);
  }
};


// log("Testing 5=5 fdsf",5);


module.exports = {
    log,
    info,
    success,
    warn,
    debug,
    logError,

}