// global imports
const multer = require('multer');
const { handleErrorResponse } = require('../helpers/response');
const allowedExe = ['js', 'xls', 'xlsx'];

/**
 * @middleware multer storage
 * @description set storage location for multer
 * @author Devanshu Gautam
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `src/utils/upload`)
    },
    filename: function (req, file, cb) {
        let exe = (file.originalname).split(".").pop();
        if (allowedExe.some(ele => ele == exe)) {
            let fileType = 'Excel_';
            if (exe == 'js') fileType = 'Js_';
            if (file.originalname == 'Master Data.xlsx') fileType = 'MasterExcel_';
            let filename = `${fileType}${Date.now()}${Math.floor(999 + Math.random() * 9999)}.${exe}`;
            cb(null, filename)
        } else {
            const err = {};
            err.message = 'please provide valid file type.';
            err.error = { allowedFileType: allowedExe };
            cb(err, false);
            // throw { message: 'please provide valid file type.', allowedFileType: allowedExe };
        }
    }
});

/**
 * @middleware multer upload
 * @description upload file for multer
 * @author Devanshu Gautam
 */
exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});