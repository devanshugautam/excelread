const express = require('express');
const { logger } = require('../utils/logger');
const { statusCode } = require('../../config/default.json');
const router = express.Router();
const { handleResponse, handleErrorResponse } = require('../helpers/response');
const { excelRead, viewExcelRead, excelToexcel, excelSplit, xmlToDb } = require('../services');
const { upload } = require('../utils/multer');


const LOG_ID = 'routes/heartBeat';


router.get('/heartbeat', async (req, res) => {
    try {
        logger.info(LOG_ID, `heartBeat triggered ...`);
        const response = { message: '💗 Project Working fine !! ' };
        handleResponse(res, statusCode.OK, response);
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while getting data from heartbeat: ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.get('/view/excelRead', async (req, res) => {
    try {
        logger.info(LOG_ID, `view/excelRead triggered ...`);
        res.render('ecelUpload');
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while viewing excel read page : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.get('/view/excelToexcel', async (req, res) => {
    try {
        logger.info(LOG_ID, `view/excelToexcel triggered ...`);
        res.render('excelToexcel');
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while viewing excel read page : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.get('/view/excelSplit', async (req, res) => {
    try {
        logger.info(LOG_ID, `view/excelSplit triggered ...`);
        res.render('excelSplit');
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while viewing excel split page : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.get('/view/xmlUpload', async (req, res) => {
    try {
        logger.info(LOG_ID, `view/xmlUpload triggered ...`);
        res.render('xmlUpload');
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while viewing excel read page : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});


router.post('/excelRead', upload.single('image'), async (req, res) => {
    try {
        console.log(req.file);
        console.log(req.body);
        logger.info(LOG_ID, `excelRead() triggered ...`);
        const response = await excelRead(req);
        handleResponse(res, statusCode.OK, response);
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while reading excel process: ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.post('/excelToexcel', upload.fields([{ name: 'newTemp', maxCount: 1 }, { name: 'masterData', maxCount: 1 }, { name: 'config', maxCount: 1 }]), async (req, res) => {
    // router.post('/excelToexcel', upload.single('image'), async (req, res) => {
    try {
        logger.info(LOG_ID, `excelToexcel() triggered ...`);
        // console.log('req.files', req.files);
        if (req.files && Object.keys(req.files).length > 0) {

            const response = await excelToexcel({
                file: req.files.newTemp && req.files.newTemp.length > 0 ? req.files.newTemp[0] : '',
                config: req.files.config && req.files.config.length ? req.files.config[0] : '',
                masterData: req.files.masterData && req.files.masterData.length ? req.files.masterData[0] : ''
            });
            handleResponse(res, statusCode.OK, response);
        } else handleErrorResponse(res, 400, 'Input file is required', {});
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while reading/writing excelprocess : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.post('/excelSplit', upload.fields([{ name: 'newTemp', maxCount: 1 }]), async (req, res) => {
    try {
        logger.info(LOG_ID, `excelSplit() triggered ...`);
        if (req.files && Object.keys(req.files).length > 0) {
            const response = await excelSplit({
                file: req.files.newTemp && req.files.newTemp.length > 0 ? req.files.newTemp[0] : '',
            });
            handleResponse(res, statusCode.OK, response);
        } else 
            handleErrorResponse(res, 400, 'Input file is required', {});
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while reading/writing excelprocess : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.post('/xmlToDb', upload.single('image'), async (req, res) => {
    try {
        // console.log(':::::::::::>>>>>>>>>>', console.log(req));
        logger.info(LOG_ID, `xmlToDb() triggered ...`);
        const response = await xmlToDb(req);
        // console.log(':::::::::::>>>>>>>>>>', response);
        if (req.session && req.session.data && Object.keys(req.session.data).length > 0) return res.redirect('view/xmlSearch');
        handleResponse(res, statusCode.OK, response);
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while reading/writing excelprocess : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

router.get('/view/xmlSearch', async (req, res) => {
    try {
        logger.info(LOG_ID, `view/xmlSearch triggered ...`);
        // console.log('req.session.data', req.session.data);
        const data = req.session.data;
        Object.freeze(data);
        req.session.data = {};
        // console.log('req.session.data22222222222', req.session.data);
        console.log('data', data);
        res.render('xmlSearchFromPath', { data: data });
    } catch (err) {
        logger.error(LOG_ID, `Error Occured while viewing excel read page : ${err.message}`);
        handleErrorResponse(res, err.status, err.message, err);
    }
});

// require('../pol/routes');

module.exports = router;