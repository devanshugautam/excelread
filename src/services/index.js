const XLSX = require('xlsx');
const sql = require('mssql');
const { parseStringPromise } = require('xml2js');
const fs = require('fs');

//  Local Import
let { excelDefault, generateQuery, excelDefaultMapping, sheetOut, sheetIn, sheetOutHeadersMApping, outputFile, xmlDefaultTables, mappingToForSheetIN, lookupCountries, lookupMasters, removeDuplicateRows, removeNonLinkedRows, addNonLinkedRows, addCellValues, fillBlankCell, splitSize, deletedDataOfOutputFile } = require('../utils/config');
const { logger } = require('../utils/logger');

const LOG_ID = 'services/index';
const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC'];

/**
 * to read excel and convert it into json and then upload it to db with validations as per the columns
 *
 * @param {req} req request
 * @param {req.file} file uploaded excel file
 * @param {req.body} body request body
 * @returns {Object} return object
 */
exports.excelRead = async ({ file, body: { startRow, endRow } }) => {
    try {
        await new sql.connect({
            user: 'devanshu',
            password: 'Deva@12',
            server: '10.0.1.8',
            database: 'ExcelUpload',
            options: {
                trustServerCertificate: true // For self-signed certificates
            }
        });
        let data = XLSX.readFile(file.path);
        var sheetNameList = data.SheetNames;
        console.log(sheetNameList);
        let dev = await XLSX.utils.sheet_to_json(data.Sheets[sheetNameList[4]], { header: "A", });
        logger.info(LOG_ID, `Excel file successfully converted to json`);
        console.log(':::::::::::::::::::', dev, '::::::3333333333');
        let i = 0;
        for (let ele of excelDefault) {
            for (let j = (+startRow ? +startRow - 1 : 0); j < (+endRow || dev.length); j++) {
                console.log('>>>>>>>>', dev[j], j, '<<<<<<<<<');
                const query = generateQuery(ele.Table, ele.Fields, dev[j], i, j);
                query && logger.info(LOG_ID, `Table :- ${ele.Table} | Query generated successfully for excel row ${j + 1}.`);
                query && console.log('running query for insertation');
                // query && await sql.query(query);
            }
            i++;
        }
        sql.close();

    } catch (error) {
        // console.log('error>>>>>', error);
        const err = new Error(error);
        const errorDetails = err.stack.split('at ', 2);
        logger.error(LOG_ID, `${err.name} | ${err.message} | Error Details :- ${errorDetails[1]}`);
    }
}

/**
 * to read excel and convert it into json and then write the json into new excel according to the provied configuration
 *
 * @param {req} req request
 * @param {req.file} file uploaded excel file
 * @returns {Object} return object
 */
exports.excelToexcel = async ({ file, config, masterData }) => {
    try {
        const data = XLSX.readFile(file.path); // reading input excel file it's path.
        const sheetNameList = data.SheetNames; // it will contain all the list of sheet name of that excel.
        const workbook = XLSX.utils.book_new(); // The book_new() utility function creates an empty workbook with no worksheets.
        const deletedWorkbook = XLSX.utils.book_new(); // The book_new() utility function creates an empty deleted workbook with no worksheets.
        logger.info(LOG_ID, `Excel book created.`);
        const configData = Object.keys(config).length > 0 && fs.readFileSync(config.path, 'utf8');
        const exports = {};
        configData && eval(configData);
        if (exports && Object.keys(exports).length > 0) {
            logger.info(LOG_ID, `Setting up config variable according to the uploaded configuration file.`);
            if (Array.isArray(exports.sheetOut) && exports.sheetOut.length > 0) sheetOut = exports.sheetOut;
            if (Array.isArray(exports.sheetOutHeadersMApping) && exports.sheetOutHeadersMApping.length > 0) sheetOutHeadersMApping = exports.sheetOutHeadersMApping;
            if (Array.isArray(exports.excelDefaultMapping) && exports.excelDefaultMapping.length > 0) excelDefaultMapping = exports.excelDefaultMapping;
            if (Array.isArray(exports.removeNonLinkedRows) && exports.removeNonLinkedRows.length > 0) removeNonLinkedRows = exports.removeNonLinkedRows;
            if (Array.isArray(exports.addNonLinkedRows) && exports.addNonLinkedRows.length > 0) addNonLinkedRows = exports.addNonLinkedRows;
            if (Array.isArray(exports.removeDuplicateRows) && exports.removeDuplicateRows.length > 0) removeDuplicateRows = exports.removeDuplicateRows;
            if (Array.isArray(exports.lookupMasters) && exports.lookupMasters.length > 0) lookupMasters = exports.lookupMasters;
            if (Array.isArray(exports.lookupCountries) && exports.lookupCountries.length > 0) lookupCountries = exports.lookupCountries;
            if (exports.sheetIn && Object.keys(exports.sheetIn).length > 0) sheetIn = exports.sheetIn;
            if (exports.mappingToForSheetIN && Object.keys(exports.mappingToForSheetIN).length > 0) mappingToForSheetIN = exports.mappingToForSheetIN;
            if (exports.outputFile) outputFile = exports.outputFile;
        }
        for (let o = 0; o < sheetOut.length; o++) { // this loop will run for all new sheet names || sheetOut is a type of array.
            XLSX.utils.book_append_sheet(workbook, {}, sheetOut[o]); // The book_append_sheet() utility function appends a worksheet to the workbook. 
            XLSX.utils.book_append_sheet(deletedWorkbook, {}, sheetOut[o]); // The book_append_sheet() utility function appends a worksheet to the workbook. 
            logger.info(LOG_ID, `Adding sheets to excel book | sheetName :- ${sheetOut[o]}.`);
            if (sheetOutHeadersMApping[o]) {
                // Setting up headers for all the the sheets according to the provided configuration. 
                logger.info(LOG_ID, `Adding headers to excel | sheetName :- ${sheetOut[o]}.`);
                const keys = Object.keys(sheetOutHeadersMApping[o]);
                for (let u = 0; u < keys.length; u++) {
                    debugger;
                    // console.log('keys[u]:::::::::::::::::', keys[u], sheetOut[o], sheetOutHeadersMApping[o][keys[u]]);
                    if(sheetOutHeadersMApping[o][keys[u]] != "Reason") XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetOut[o]], [[sheetOutHeadersMApping[o][keys[u]]]], { origin: `${keys[u]}${1}` }); // The sheet_add_aoa utility function modifies cell values in a worksheet.
                    XLSX.utils.sheet_add_aoa(deletedWorkbook.Sheets[sheetOut[o]], [[sheetOutHeadersMApping[o][keys[u]]]], { origin: `${keys[u]}${1}` }); // The sheet_add_aoa utility function modifies cell values in a worksheet.
                }
            }
        }
        logger.info(LOG_ID, `Sheets added to excel book.`);
        //  This loop will start's the mapping of data from input excel to new sheet's
        for (let p = 0; p < excelDefaultMapping.length; p++) {
            const val = excelDefaultMapping[p][0].split(':');
            const dev = await XLSX.utils.sheet_to_json(data.Sheets[sheetNameList[+val[0]]], { header: "A", defval: '' });
            debugger;
            // p == 0 && console.log(':::::::::::::::::::', dev, ':::::::::::::::::::');
            let index = 0;
            if (Array.isArray(dev) && dev.length > 0) {
                logger.info(LOG_ID, `Data fetched from the input excel of sheet | sheetName :- ${sheetNameList[+val[0]]}.`);
                for (let j = (sheetIn[+val[0]] ? sheetIn[+val[0]] - 1 : 0); j < dev.length; j++) {
                    index++;
                    if (mappingToForSheetIN[+val[0]] && mappingToForSheetIN[+val[0]].length > 0) {
                        let actionColumns = mappingToForSheetIN[+val[0]][0].split(',');
                        let finalVal = 0;
                        for (let col of actionColumns) {
                            // console.log('!!!!!!!!!!!!!!!!', mappingToForSheetIN[+val[0]][1], col, dev[j][col], "????????????");
                            if (dev[j][col]) finalVal += dev[j][col];
                        }
                        dev[j][mappingToForSheetIN[+val[0]][1]] = finalVal;
                        // console.log('>>>>>>>>>>>>>>>>>>>>', dev[j][mappingToForSheetIN[+val[0]][1]], "!!!!!!!!!!!!!!????????????");
                    }
                    let value;
                    if (((val[0] == 3 && val[1] == 'E') || (val[0] == 5 && val[1] == 'D')) && typeof dev[j][val[1]] === 'string' && (!dev[j][val[1]] || dev[j][val[1]] == '' || dev[j][val[1]].trim() == '-')) value = `${Date.now()}${Math.floor(999 + Math.random() * 9999)}`;
                    else if (((val[0] == 0 && val[1] == 'N') || (val[0] == 2 && val[1] == 'G') || (val[0] == 3 && val[1] == 'F') || (val[0] == 5 && val[1] == 'E')) && typeof dev[j][val[1]] === 'string' && (!dev[j][val[1]] || dev[j][val[1]] == '' || dev[j][val[1]].trim() == '-')) value = `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate()}`;
                    else if (((val[0] == 0 && val[1] == 'O') || (val[0] == 3 && val[1] == 'G') || (val[0] == 5 && val[1] == 'F')) && typeof dev[j][val[1]] === 'string' && (!dev[j][val[1]] || dev[j][val[1]] == '' || dev[j][val[1]].trim() == '-')) value = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
                    else if (((val[0] == 3 && val[1] == 'R') || (val[0] == 3 && val[1] == 'O')) && typeof dev[j][val[1]] === 'string' && (!dev[j][val[1]] || dev[j][val[1]] == '' || dev[j][val[1]].trim() == '-')) value = `Not Provided`;
                    else if (val[0] == 3 && val[1] == 'N' && typeof dev[j][val[1]] === 'string' && (!dev[j][val[1]] || dev[j][val[1]] == '' || dev[j][val[1]].trim() == '-')) value = j % 2 == 0 ? `Bank` : 'Digital Wallet';
                    else if (val[0] == 4 && val[1] == 'I' && typeof dev[j][val[1]] === 'string' && (!dev[j][val[1]] || dev[j][val[1]] == '' || dev[j][val[1]].trim() == '-')) value = 'Not Applicable';
                    else if (val[0] == 5 && val[1] == 'H' && typeof dev[j][val[1]] === 'string' && (!dev[j][val[1]] || dev[j][val[1]] == '' || dev[j][val[1]].trim() == '-')) value = 'Not Provided';
                    // else if (val[0] == 3 && val[1] == 'Z') value = 'Not Provided';
                    // else if (val[0] == 5 && val[1] == 'U') value = 'Not Provided';
                    else value = dev[j][val[1]];
                    value = +value || String(value).replace(" - ", "-");
                    value = +value || String(value).trim();
                    if (typeof value === 'string' && value.length > 99) value = value.substring(0, 99);
                    for (let q = 1; q < excelDefaultMapping[p].length; q++) {
                        const key = excelDefaultMapping[p][q].split(':');
                        XLSX.utils.sheet_add_aoa(workbook.Sheets[sheetOut[+key[0]]], [[value]], { origin: `${key[1]}${index + 1}` });
                    }
                }
            }
        }

        logger.info(LOG_ID, `Removing not found rows in sheet 1 which we are comparing to sheet 2.`);
        // Remove not linked rows
        for (i = 0; i < removeNonLinkedRows.length; i++) {
            const val = removeNonLinkedRows[i].split('-');
            const vl1 = val[0].split(':');
            const vl2 = val[1].split(':');
            const vl1Index = vl1[1].split(",");
            const vl2Index = vl2[1].split(",");
            let sheet1 = workbook.Sheets[workbook.SheetNames[vl1[0]]];
            let deletedSheet1 = deletedWorkbook.Sheets[deletedWorkbook.SheetNames[vl1[0]]];
            let sheet2 = workbook.Sheets[workbook.SheetNames[vl2[0]]];
            const json1 = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
            const deltedJson1 = XLSX.utils.sheet_to_json(deletedSheet1, { header: 1 });
            const json2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
            let rows = [];
            let total;
            let blank = [];
            for (let j = 0; j < json1[0].length; j++) blank.push(null);
            for (let j1 = 0; j1 < json1.length; j1++) {
                let row1 = json1[j1];
                let found = false;
                let comb1 = "";
                let comb2 = "";
                vl1Index.forEach(idx => {
                    comb1 = comb1.concat(row1[+idx]);
                });
                for (let j2 = 0; j2 < json2.length; j2++) {
                    let row2 = json2[j2];
                    comb2 = "";
                    vl2Index.forEach(idx => {
                        comb2 = comb2.concat(row2[+idx]);
                    });
                    if (comb1 == comb2) {
                        found = true;
                        break;
                    }
                };
                if (found) rows.push(row1);
                else {
                    logger.info(LOG_ID, `Removing row from ${workbook.SheetNames[vl1[0]]}, columns = ${vl1[1]}, value = ${comb1} comparing to ${workbook.SheetNames[vl2[0]]} columns = ${vl2[1]}.`);
                    row1.push(`Not Found :- compared to ${workbook.SheetNames[vl2[0]]} columns = ${vl2[1]}`);
                    if (Array.isArray(row1) && row1[0]) deltedJson1.push(row1);
                }
            };

            let rest = json1.length - rows.length;
            for (let j = 0; j < rest; j++) rows.push(blank);
            XLSX.utils.sheet_add_json(sheet1, rows, { skipHeader: true });
            XLSX.utils.sheet_add_json(deletedSheet1, deltedJson1, { skipHeader: true });
        }

        logger.info(LOG_ID, `Removing duplicate rows from sheets.`);
        // Remove Duplicate
        for (i = 0; i < removeDuplicateRows.length; i++) {
            const val = removeDuplicateRows[i].split(':');
            const valIndx = val[1].split(",");
            let sheet = workbook.Sheets[workbook.SheetNames[+val[0]]];
            let deletedSheet = deletedWorkbook.Sheets[deletedWorkbook.SheetNames[+val[0]]];
            let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const deltedJson = XLSX.utils.sheet_to_json(deletedSheet, { header: 1 });
            let keys = [];
            let rows = [];
            json.forEach((row,iindex) => {
                let comb = "";
                valIndx.forEach(idx => {
                    comb = comb.concat(row[+idx]);
                });
                if (keys.indexOf(comb) == -1) {
                    keys.push(comb);
                    rows.push(row);
                } else {
                    row.push(`Duplicate :- row ${iindex+1} of ${workbook.SheetNames[+val[0]]} of columns : ${val[1]}.`);
                    if (Array.isArray(row) && row[0]) deltedJson.push(row);
                    logger.info(LOG_ID, `Removing duplicate row from ${workbook.SheetNames[+val[0]]} of columns : ${val[1]} | value : ${comb}.`);
                }
            });

            let blank = [];
            for (let j = 0; j < json[0].length; j++) blank.push(null);
            let rest = json.length - rows.length;
            for (let j = 0; j < rest; j++) rows.push(blank);
            XLSX.utils.sheet_add_json(sheet, rows, { skipHeader: true });
            XLSX.utils.sheet_add_json(deletedSheet, deltedJson, { skipHeader: true });
        }

        // add not found rows in sheet 1 which we are comparing to sheet 2 (put data in left side sheet if not found when comparing to right side sheet)
        logger.info(LOG_ID, `adding not found rows in sheet 1 which we are comparing to sheet 2 (put data in left side sheet if not found when comparing to right side sheet).`);
        if (addNonLinkedRows.length > 0) {
            for (i = 0; i < addNonLinkedRows.length; i++) {
                const val = addNonLinkedRows[i].split('-');
                const vl1 = val[0].split(':');
                const vl2 = val[1].split(':');
                const vl2ColIndx = vl2[1].split(",");
                const vl1ColIndx = vl1[1].split(",");
                let sheet1 = workbook.Sheets[workbook.SheetNames[vl1[0]]];
                let sheet2 = workbook.Sheets[workbook.SheetNames[vl2[0]]];
                const json1 = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
                const json2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
                let rows = [];
                json1.forEach(row1 => {
                    if (row1[vl1[1].split(",")[0]])
                        rows.push(row1);
                });
                json2.forEach(row2 => { //Fraud
                    let found = false;
                    let comb1 = "";
                    vl2ColIndx.forEach(idx => {
                        comb1 = comb1.concat(row2[+idx]);
                    });
                    json1.forEach(row1 => { //Final
                        let comb2 = "";
                        vl1ColIndx.forEach(idx => {
                            comb2 = comb2.concat(row1[+idx]);
                        });
                        if (comb1 == comb2) found = true;
                    });
                    if (!found) {
                        let tempRow = [];
                        tempRow.length = json1[0].length;
                        // console.log('here??????????????????????????????????????????', json1.length,tempRow.length);
                        for (let colIndx = 0; colIndx < vl1ColIndx.length; colIndx++) {
                            // console.log('vl1ColIndx', vl1ColIndx[colIndx], 'vl2ColIndx', vl2ColIndx[colIndx], 'colIndx', colIndx, 'row2[+vl2ColIndx[colIndx]]', row2[+vl1ColIndx[colIndx]]);
                            logger.info(LOG_ID, `Adding row in ${workbook.SheetNames[vl1[0]]}, column : ${vl1ColIndx[colIndx]}, value : ${row2[+vl2ColIndx[colIndx]]} from ${workbook.SheetNames[vl2[0]]} of column ${vl2ColIndx[colIndx]}.`);
                            tempRow[+vl1ColIndx[colIndx]] = row2[+vl2ColIndx[colIndx]]
                            // break;
                            if (colIndx == vl1ColIndx.length - 1) rows.push(tempRow);
                        }
                        // console.log('here??????????????????????????????????????????', tempRow);
                        // console.log('here??????????????????????????????????????????', json1.length);
                    }
                });

                // let rest = json1.length - rows.length;
                // for (let j = 0; j < rest; j++) rows.push(blank);
                XLSX.utils.sheet_add_json(sheet1, rows, { skipHeader: true });
            }
        }

        for (i = 0; i < addCellValues.length; i++) {
            const val = addCellValues[i].split('-');
            const vl1 = val[0].split(':');
            const vl2 = val[1].split(':');
            const vl1Index = vl1[1].split(",");
            const vl2Index = vl2[1].split(",");
            let sheet1 = workbook.Sheets[workbook.SheetNames[vl1[0]]];
            let sheet2 = workbook.Sheets[workbook.SheetNames[vl2[0]]];
            const json1 = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
            const json2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
            let blank = [];
            for (let j = 0; j < json1[0].length; j++) blank.push(null);
            for (let j1 = 0; j1 < json1.length; j1++) {
                let row1 = json1[j1];
                let found = false;
                let foundVal;
                let comb1 = "";
                let comb2 = "";
                vl1Index.forEach(idx => {
                    comb1 = comb1.concat(row1[+idx]);
                });
                for (let j2 = 0; j2 < json2.length; j2++) {
                    let row2 = json2[j2];
                    comb2 = "";
                    vl2Index.forEach(idx => {
                        comb2 = comb2.concat(row2[+idx]);
                    });
                    if (comb1 == comb2) {
                        found = true;
                        if (row2[+vl2[2]]) foundVal = row2[+vl2[2]];
                        break;
                    }
                };
                if (found && foundVal && j1 != 0) {
                    json1[j1][+vl1[2]] = foundVal;
                    logger.info(LOG_ID, `Adding value in ${workbook.SheetNames[vl1[0]]} at row : ${j1}, column : ${columns[vl1[2]]} from ${workbook.SheetNames[vl2[0]]}, columns : ${columns[vl2[2]]}, value : ${foundVal}.`);
                }
            };

            // let rest = json1.length - rows.length;
            // for (let j = 0; j < rest; j++) rows.push(blank);
            XLSX.utils.sheet_add_json(sheet1, json1, { skipHeader: true });
        }
        if (fillBlankCell.length > 0) {
            for (let fillValues of fillBlankCell) {
                const val = fillValues.split('-');
                const valueAt = val[0].split(':');
                const value = val[1];
                let sheet1 = workbook.Sheets[workbook.SheetNames[valueAt[0]]];
                const json1 = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
                for (let j = 1; j < json1.length; j++) {
                    if ((json1[j][0] && json1[j][0] != '') && (!json1[j][valueAt[1]] || json1[j][valueAt[1]] == '')) {
                        if (value == '###') json1[j][valueAt[1]] = `DUM-${Date.now()}${Math.floor(999 + Math.random() * 9999)}`
                        else json1[j][valueAt[1]] = value;
                        logger.info(LOG_ID, `Filling blank value in ${workbook.SheetNames[valueAt[0]]} at row : ${j}, column : ${columns[valueAt[1]]}.`);
                    }

                }
                XLSX.utils.sheet_add_json(sheet1, json1, { skipHeader: true });
            }
        }

        // Master Data Validation
        let masterDataFileLocation = 'Master Data.xlsx';
        if (masterData && masterData.path) masterDataFileLocation = masterData.path;
        logger.info(LOG_ID, `Master Data File Location : ${masterDataFileLocation}`);
        const master = XLSX.readFile(masterDataFileLocation);
        let masall = master.Sheets[master.SheetNames[0]];
        let masnat = master.Sheets[master.SheetNames[1]];
        let jsonall = XLSX.utils.sheet_to_json(masall, { header: 1 });
        let jsonnat = XLSX.utils.sheet_to_json(masnat, { header: 1 });

        logger.info(LOG_ID, `Checking master Data vaidation.`);
        // All Master
        for (i = 0; i < lookupMasters.length; i++) {
            const val = lookupMasters[i].split('-');
            const src = val[0].split(':');
            let sheet = workbook.Sheets[workbook.SheetNames[+src[0]]];
            let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            for (let x = 1; x < json.length; x++) {
                if (!json[x][columns.indexOf(src[1])]) continue;
                let found = false;
                for (let j = 0; j < jsonall.length; j++) {
                    if (jsonall[j][val[1]] == json[x][columns.indexOf(src[1])]) {
                        found = true;
                        break;
                    } else {
                        if (String(jsonall[j][val[1]]).toLowerCase() == String(json[x][columns.indexOf(src[1])]).toLowerCase()) {
                            logger.info(LOG_ID, `Replacing value :  ${jsonall[j][+val[1]]} in ${workbook.SheetNames[+src[0]]} on column : ${src[1]}${x + 1}.`);
                            XLSX.utils.sheet_add_aoa(sheet, [[jsonall[j][+val[1]]]], { origin: `${src[1]}${x + 1}` });
                            found = true;
                            break;
                        }
                    }
                };
                if (!found) {
                    let got = false;
                    for (let j = 1; j < jsonall.length; j++) {
                        if (jsonall[j][+val[1] + 1] && (String(jsonall[j][+val[1] + 1]).toLowerCase().split(',').indexOf(String(json[x][columns.indexOf(src[1])]).toLowerCase()) != -1)) {
                            got = true;
                            logger.info(LOG_ID, `Replacing value :  ${jsonall[j][+val[1]]} in ${workbook.SheetNames[+src[0]]} on column : ${src[1]}${x + 1}.`);
                            XLSX.utils.sheet_add_aoa(sheet, [[jsonall[j][+val[1]]]], { origin: `${src[1]}${x + 1}` });
                            break;
                        }
                    };
                    if (!got) {
                        logger.info(LOG_ID, `Invalid value : ${json[x][columns.indexOf(src[1])]}${"**INVALID**"} in ${workbook.SheetNames[+src[0]]} on column : ${src[1]}${x + 1}.`);
                        XLSX.utils.sheet_add_aoa(sheet, [[`${json[x][columns.indexOf(src[1])]}${"**INVALID**"}`]], { origin: `${src[1]}${x + 1}` });
                    }
                }
            };
        }

        logger.info(LOG_ID, `Checking countries information.`);
        // Countries
        for (i = 0; i < lookupCountries.length; i++) {
            const val = lookupCountries[i].split('-');
            const src = val[0].split(':');
            const cnt = val[1].split(':');
            let sheet = workbook.Sheets[workbook.SheetNames[+src[0]]];
            let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            for (let x = 1; x < json.length; x++) {
                for (let j = 1; j < jsonnat.length; j++) {
                    if (json[x][columns.indexOf(src[1])] && json[x][columns.indexOf(src[1])] != "") {
                        if (String(jsonnat[j][+cnt[0]]).toLowerCase() == String(json[x][columns.indexOf(src[1])]).toLowerCase()) {
                            logger.info(LOG_ID, `Replacing countries value on sheet : ${workbook.SheetNames[+src[0]]} at - ${src[1]}${x + 1} adding value : ${jsonnat[j][+cnt[1]]}.`);
                            XLSX.utils.sheet_add_aoa(sheet, [[jsonnat[j][+cnt[1]]]], { origin: `${src[1]}${x + 1}` });
                            break;
                        } else {
                            if (String(jsonnat[j][4]).toLowerCase() == String(json[x][columns.indexOf(src[1])]).toLowerCase()) {
                                logger.info(LOG_ID, `Replacing countries value on sheet : ${workbook.SheetNames[+src[0]]} at - ${src[1]}${x + 1} adding value : ${jsonnat[j][+cnt[1]]}.`);
                                XLSX.utils.sheet_add_aoa(sheet, [[jsonnat[j][+cnt[1]]]], { origin: `${src[1]}${x + 1}` });
                                break;
                            }
                        }
                    }
                };
            };
        }

        XLSX.writeFile(workbook, outputFile);
        logger.info(LOG_ID, `Excel file created successfully | Excel Name :- ${outputFile}.`);
        XLSX.writeFile(deletedWorkbook, deletedDataOfOutputFile);
        logger.info(LOG_ID, `Deleted Data Excel file created successfully | Excel Name :- ${deletedDataOfOutputFile}.`);
        return true;
    } catch (error) {
        console.log('error>>>>>', error);
        const err = new Error(error);
        const errorDetails = err.stack.split('at ', 2);
        logger.error(LOG_ID, `${err.name} | ${err.message} | Error Details :- ${errorDetails[1]}`);
    }
}

exports.excelSplit = async ({ file }) => {
    try {
        const data = XLSX.readFile(file.path);
        const workbooks = [];
        let keylist = [];
        let rowlist = [];

        for (let i = 0; i < data.SheetNames.length; i++) {
            let json = await XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[i]], { header: "A", defval: '' });
            let rows = [];
            let keys = [];
            for (let j = 0; j < json.length; j++) {
                let bookidx = Math.ceil(j / splitSize) - 1;
                if (i == 0 && j % splitSize == 0) {
                    workbooks.push(XLSX.utils.book_new());
                    for (let k = 0; k < data.SheetNames.length; k++) {
                        XLSX.utils.book_append_sheet(workbooks[workbooks.length - 1], {}, data.SheetNames[k]);
                    }
                }

                if (i == 0) { //First Sheet data
                    rows.push(json[j]);
                    if (j != 0) {
                        keys.push(json[j].A + json[j].B);
                        if (j % splitSize == 0 || (json.length - 1) == j) {
                            let sheet = workbooks[bookidx].Sheets[workbooks[bookidx].SheetNames[i]];
                            XLSX.utils.sheet_add_json(sheet, rows, { skipHeader: true });
                            keylist.push(keys);
                            keys = [];
                            rows = [];
                            rows.push(json[0]);//header
                        }
                    }
                } else { //Second Sheet onward
                    if (j == 0) {
                        rowlist = [];
                        for (let k = 0; k < keylist.length; k++) {
                            rowlist.push([]);
                            rowlist[k].push(json[0]);//header
                        }
                    }
                    for (let k = 0; k < keylist.length; k++) {
                        let idx = keylist[k].indexOf(json[j].A + json[j].B);
                        if (idx >= 0) {
                            rowlist[k].push(json[j]);
                            break;
                        }
                    }
                }
            }
            if (i > 0) {
                for (let j = 0; j < workbooks.length; j++) {
                    let sheet = workbooks[j].Sheets[workbooks[j].SheetNames[i]];
                    XLSX.utils.sheet_add_json(sheet, rowlist[j], { skipHeader: true });
                }
            }
        }

        for (let i = 0; i < workbooks.length; i++) {
            XLSX.writeFile(workbooks[i], `Old Template ${i}.xlsx`);
        }

        logger.info(LOG_ID, `Excel files created successfully`);
        return true;
    } catch (error) {
        console.log('error>>>>>', error);
        const err = new Error(error);
        const errorDetails = err.stack.split('at ', 2);
        logger.error(LOG_ID, `${err.name} | ${err.message} | Error Details :- ${errorDetails[1]}`);
    }
}

exports.xmlToDb = async ({ file, body: { parent, fileLocation }, session }) => {
    try {
        // console.log('>>>>>>>>>>>>>>', session);
        // console.log('parent', parent);
        // console.log('fileLocation', fileLocation);
        // console.log('file.path', file);
        let location;
        if (file && file.path) location = file.path;
        else location = fileLocation;
        const xmlData = fs.readFileSync(location, 'utf-8');
        let result = await parseStringPromise(xmlData, { explicitArray: false, mergeAttrs: true, trim: true });
        // const jsonData = JSON.stringify(result, null, 2);
        // console.log(result);
        let headers = (parent && parent != '') && parent.split('/');
        // console.log('headrs', headers);
        if (headers && headers.length > 0) {
            for (let ele of headers) {
                // console.log('eleeleeleeleeleeleeleeleeleeleeleeleele', ele, result);
                if (typeof result == 'object' && result[ele]) result = result[ele];
                if (typeof result == 'object' && Array.isArray(result) && result.length > 0 && result[0][ele]) result = result[0][ele];
                // console.log('result', result);
            }
        }
        let finalData;
        let message = 'data fetched';
        if (headers && headers.length > 0) {
            if (typeof result == 'object' && Array.isArray(result) && result.length > 0) {
                if (typeof result[0] == 'object') finalData = Object.keys(result[0]);
                else {
                    message = 'Their is no tags inside given path';
                    finalData = null;
                }
            }
            else if (typeof result == 'object') finalData = Object.keys(result);
            else {
                message = 'Their is no tags inside given path';
                finalData = null;
            }
        } else {
            finalData = Object.keys(result)
        }
        let dataValue = { data: finalData, path: parent, fileLocation: location, tables: xmlDefaultTables };
        if (file && file.path) session.data = dataValue;

        return {
            success: true,
            message,
            data: dataValue
        };


    } catch (error) {
        console.log(error);
        const err = new Error(error);
        const errorDetails = err.stack.split('at ', 2);
        logger.error(LOG_ID, `${err.name} | ${err.message} | Error Details :- ${errorDetails[1]}`);
    }
}
