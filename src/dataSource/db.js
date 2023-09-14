// global imports
const sql = require('mssql');

//  Local import
const { logger } = require('../utils/logger');

const LOG_ID = 'dataSource/db'

const EXCELUPLOAD_SQL_Database = {
    server: process.env.EXCELUPLOAD_DB_HOST,
    port: parseInt(process.env.EXCELUPLOAD_DB_PORT),
    database: process.env.EXCELUPLOAD_DB_NAME,
    user: process.env.EXCELUPLOAD_DB_USER,
    password: process.env.EXCELUPLOAD_DB_PASSWORD,
    connectionTimeout: 30000,             // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
    requestTimeout: 0,                   // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
    options: { encrypt: true },         // Encryption for data encryption which will travel on network, App server to DB server
    pool: {                            // Pooling options
        max: 1000,                    // The maximum number of connections there can be in the pool
        min: 100,                    // The minimum of connections there can be in the pool
        idleTimeoutMillis: 30000    // The Number of milliseconds before closing an unused connection
    }
};

/**
 * Db Connection object with sequelize.
 * 
 * @returns {*}
 */
const poolConnectionObject = new sql.ConnectionPool(EXCELUPLOAD_SQL_Database).connect().then(poolConnectionObject => {
    logger.info(LOG_ID, 'Database Connected......');
    return poolConnectionObject;
}).catch(error => {
    /**
     * poolConnectionObject creation failure, Database configuration is incorrect.
     * write error message in log file
     * Stop loading application and exit the application startup
     */
    logger.error(LOG_ID, 'Database Connection Failed.\nError Details : ' + error + '\nDB Name     : ' + EXCELUPLOAD_SQL_Database.database + '\nServer IP   : ' + EXCELUPLOAD_SQL_Database.server + '\nPort Number : ' + EXCELUPLOAD_SQL_Database.port + '.\nPlease check if the database is up and running, make sure the DB configuration is correct.');
    process.exit(0);
});

module.exports = {
    poolConnectionObject: poolConnectionObject
} 