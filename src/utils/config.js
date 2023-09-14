const { logger } = require('./logger');

const LOG_ID = 'utils/config';

/**
 * excelDefault is used to define the excel data that is going to be mapped with table columns.
 * Table in the key for table name.
 * Fileds is the key for table columns.
 * Columns is the key for excel sheet columns.
 * Validate is the key for table/excel columns, Value is this array will be validated accordingly.
 */
exports.excelDefault = [{
    Table: 'Employees',
    Fields: ['Name', 'Roll', 'Money'],
    Columns: ['A', 'B', 'I'],
    Validate: [null, null, 'Money_regex']
},
{
    Table: 'EmployeesAge',
    Fields: ['EmployeeId', 'Age', 'Dob', 'Email', 'Phone', 'Status'],
    Columns: ['D', 'C', 'E', 'F', 'G', 'H'],
    Validate: [null, null, 'Dob_regex', 'Email_regex', 'Phone_regex', 'Status_enum']
}];

/**
 * sheetOut is used to define the excel sheet names for out excel.
*/
exports.sheetOut = ['Fraud Cases', 'Client Info', 'Account Info', 'Direct Channel', 'Final Channel'];

exports.outputFile = `Old Template.xlsx`;
exports.deletedDataOfOutputFile = `Deleted Data Of Old Template.xlsx`;

/**
 * sheetOutHeadersMApping is used to define the excel sheet's headers, It is mapped with sheetOut sheet names. 
*/
exports.sheetOutHeadersMApping = [{
    "A": "SAMA's Case Serial Number",
    "B": "Bank's Case Serial Number",
    "C": 'Fraud Detection Mechanism',
    "D": 'Number of Fraud Transactions',
    "E": 'Total Amounts',
    "F": 'Frozen/Held/refunded Amounts',
    "G": 'Unrefunded/Unfrozen/Unheld Amounts',
    "H": 'Complaint Channel',
    "I": 'Complaint Date',
    "J": 'Complaint Time',
    "K": 'Did The Client Notify The Law Inforcment',
    "L": "Client's National/Residency/Commercial ID",
    "M": 'Fraud Method',
    "N": 'Fraud Method (Other)',
    "O": 'Impersonated Personal/Organization Name',
    "P": 'Reach Method',
    "Q": 'Reach Method (Other)',
    "R": 'Reach Method Identifier (URL/Mobile Number/Account/ect.)',
    "S": 'Reason',
}, {

    "A": "SAMA's Case Serial Number",
    "B": "Bank's Case Serial Number",
    "C": "Client's National/Residency/Commercial ID",
    "D": 'Client Type',
    "E": 'Client Full Name',
    "F": "Client's Registered Phone Number",
    "G": "Client's Region Based on National Address",
    "H": "Client's City Based on National Address",
    "I": 'Gender',
    "J": 'Date of Birth/Establishment Date',
    "K": 'Nationality',
    "L": 'Reason',

}, {
    "A": "SAMA's Case Serial Number",
    "B": "Bank's Case Serial Number",
    "C": "Client's National/Residency/Commercial ID",
    "D": 'Account Number/Digital Wallet ID',
    "E": "Client's Account Type",
    "F": 'Account/Wallet Opening Date',
    "G": 'Account Type',
    "H": 'Client Class',
    "I": 'Account Opening Mechanism',
    "J": 'Authenticated Account',
    "K": 'Reason',
}, {
    "A": "SAMA's Case Serial Number",
    "B": "Bank's Case Serial Number",
    "C": 'Client Account Number/Digital Wallet ID',
    "D": 'Transaction ID',
    "E": 'was the deviced used trusted device',
    "F": 'Application ID',
    "G": 'Device ID',
    "H": 'Accessed From Which Country',
    "I": 'Date',
    "J": 'Time',
    "K": 'Channel',
    "L": 'Transaction Type',
    "M": 'Transaction Type (Other)',
    "N": 'Transaction Amount',
    "O": 'Frozen/Held Amounts',
    "P": 'Unrefunded/Unfrozen/Unheld Amounts',
    "Q": "Beneficiary's Bank/Wallet Name",
    "R": "Beneficiary'sN/ABank/WalletN/ANameN/A(Other)",
    "S": "Beneficiary'sN/ANational/Residency/CommercialN/AID",
    "T": "Beneficiary's Possession Type",
    "U": 'IBAN / Wallet ID',
    "V": 'Reason',
}, {
    "A": "SAMA's Case Serial Number",
    "B": "Bank's Case Serial Number",
    "C": 'Transaction ID',
    "D": 'Date',
    "E": 'Time',
    "F": 'Bank/Wallet Name',
    "G": 'Bank/Wallet Name (Other)',
    "H": 'Cash-Out Method',
    "I": 'Cash-Out Method (Other)',
    "J": 'Total Amounts',
    "K": 'Frozen/Held Amounts',
    "L": 'Unrefunded/Unfrozen/Unheld Amounts',
    "M": 'Cashout Transaction at Which Country',
    "N": 'Bank/Wallet Merchant Name',
    "O": 'Beneficiary ID (IBAN or ID)',
    "P": 'Reason',
}];

/**
 * sheetIn is used to define the excel sheet's starting row number, From which row data in starting in sheet of an excel.
*/
exports.sheetIn = {
    0: 2,
    1: 2,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 2,

}

/**
 * excelDefaultMapping is used to define mapping of excel sheet's and their columns with new sheet's and their columns
 *  , '2:A', '3:A', '4:A'
 * '1:B', '2:B', '3:B', '4:B'
*/
exports.excelDefaultMapping = [
    ['0:B', '0:A'],
    ['0:C', '0:B'],
    ['0:D', '0:C'],
    ['0:H', '0:D'],
    ['0:I', '0:E'],
    ['0:J', '3:O'],
    ['0:K', '0:F'],
    ['0:L', '0:G', '3:P'],
    ['0:M', '0:H'],
    ['0:N', '0:I'],
    ['0:O', '0:J'],
    ['0:P', '0:K'],
    ['0:Q', '0:L'],
    ['0:R', '0:M'],
    ['0:S', '0:N'],
    ['0:T', '0:O'],
    ['0:V', '0:Q'],
    ['0:W', '0:P'],
    ['0:Z', '0:R'],

    ['1:B', '1:A'],
    ['1:C', '1:B'],
    ['1:D', '1:C'],
    ['1:E', '1:D'],
    ['1:F', '1:E'],
    ['1:G', '1:F'],
    ['1:H', '1:G'],
    ['1:I', '1:H'],
    ['1:J', '1:I'],
    ['1:K', '1:J'],
    ['1:L', '1:K'],

    ['2:B', '2:A'],
    ['2:C', '2:B'],
    ['2:D', '2:C'],
    ['2:E', '2:D'],
    ['2:F', '2:E'],
    ['2:G', '2:F'],
    ['2:H', '2:G'],
    ['2:I', '2:H'],
    ['2:J', '2:I'],
    ['2:K', '2:J'],

    ['3:B', '3:A'],
    ['3:C', '3:B'],
    ['3:D', '3:C'],
    ['3:E', '3:D'],
    ['3:F', '3:I'],
    ['3:G', '3:J'],
    ['3:H', '3:K'],
    ['3:I', '3:L'],
    ['3:J', '3:N'],
    ['3:L', '3:O'],
    ['3:M', '3:P'],
    ['3:N', '3:T'],
    ['3:O', '3:Q'],
    ['3:Q', '3:S'],
    ['3:R', '3:U'],
    // ['3:Z', '3:H'], // for this in out sheet 4 col h i am putting default value indside the algo

    ['4:I', '3:E'],
    ['4:L', '3:F'],
    ['4:M', '3:G'],

    ['5:B', '4:A'],
    ['5:C', '4:B'],
    ['5:D', '4:C'],
    ['5:E', '4:D'],
    ['5:F', '4:E'],
    ['5:G', '4:F'],
    ['5:H', '4:H'],
    ['5:I', '4:I'],
    ['5:J', '4:J'],
    ['5:L', '4:K'],
    ['5:M', '4:L'],
    ['5:N', '4:N'],
    ['5:O', '4:O'],
    // ['5:U', '4:M'], // for this in out sheet 5 col M i am putting default value indside the algo

    ['6:F', '2:I'],
];

exports.mappingToForSheetIN = {
    0: ['J,K', 'K', 'sum'],
    3: ['K,L', 'L', 'sub'],
    5: ['K,L', 'L', 'div']
}

/**
 * validate is used to define the required validation regex's and emun's, The key are the name of table columns inside regex and emun
*/
exports.validate = {
    regex: {
        Email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        Phone: /^[0-9]*$/,
        Dob: /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
        Money: /^[0-9]+(?:\.[0-9]+)?$/
    },
    enum: {
        Status: ['Active', 'inActive', 'Submitted', 'inProgress', 'Cancled']
    }
}

exports.xmlDefaultTables = [{
    Table: 'Employees',
    Columns: ['Name', 'Roll', 'Money']
},
{
    Table: 'EmployeesAge',
    Columns: ['EmployeeId', 'Age', 'Dob', 'Email', 'Phone', 'Status']
}];

//E.g. "0:0-1:0" means remove rows from 1st sheet based on it's 1st column those are not present in 2nd sheet 1st column

exports.removeNonLinkedRows = [
    "3:0,1-0:0,1",      //Direct Channel - Fraud Cases
    "0:0,1-3:0,1",      //Fraud Cases - Direct Channel
    "0:0,1-1:0,1",      //Fraud Cases - Client Info
    "0:0,1-2:0,1",      //Fraud Cases - Account Info
    "1:0,1-0:0,1",      //Client Info - Fraud Cases
    "2:0,1-0:0,1",      //Account Info - Fraud Cases
    "4:0,1-0:0,1",      //Final Channel - Fraud Cases
];

exports.addNonLinkedRows = [
    "4:0,1-0:0,1",      //Final Channel - Fraud Cases
];

exports.addCellValues = [
	"0:0,1:11-1:0,1:2",     //Fraud Cases (Client Identifier) - Client Info 
	"2:0,1:2-1:0,1:2",      //Account Info (Client Identifier) - Client info
	"3:0,1:2-2:0,1:3",      //Direct Channel (Account Identifier) - Account Info
    "4:0,1:3-0:0,1:8",      //Final Channel(Date) - Fraud Cases
	"4:0,1:4-0:0,1:9",      //Final Channel(Time) - Fraud Cases
];

exports.fillBlankCell = [
    "0:4-0",
    "0:5-0",
    "0:6-0",
	"0:12-Other",
	"0:15-Not Provided",
	"1:10-NOT",
	"2:8-Online",
    "2:9-Yes",
	"3:4-Data Not Available",
    "3:7-Not Provided",
    "4:2-###", // ### == DUM-timestamp
    "4:5-Not Provided", //Final channel(Bank/Wallet Name)
    "4:7-Not Provided", //Final channel (Cash-Out Method)
	"4:9-0.00",
	"4:10-0.00",
	"4:11-0.00",
	"4:12-NOT",

];

//E.g. "1:0,1" means 2nd sheet column A and column B combinedly
exports.removeDuplicateRows = [
    "0:0,1",  //Fraud Cases
    "1:0,1",  //Client Info
];

//E.g.
exports.lookupMasters = [
    "0:C-0",     //
    "0:H-2",     //Fraud Cases
    "0:K-4",     //
    "0:M-6",     //
    "0:P-8",     //
    "1:D-10",    //
    "1:G-12",
    "1:I-14",
    "2:E-16",
    "2:H-18",
    "2:G-20",
    "2:I-22",
    "2:J-24",
    "3:E-26",
    "3:K-28",
    "3:L-30",
    "3:T-32",
    "3:Q-34",
    "4:F-36",
    "4:H-38"
];

//E.g. "1:K-3:2" means 2nd sheet K column value look into 4th column and return 3 column's value
exports.lookupCountries = [
    "1:K-3:2",  //Client Info -
    "3:H-3:2",  //Direct Channel
    "4:M-3:2",  //Final Channel
];


exports.splitSize = 2000;


/**
 * to generate sql query dynamically
 *
 * @param {TabelName} TabelName name of the table
 * @param {Fields} Fields columns of table
 * @param {dat} dat data of single excel row
 * @param {Index} Index index of excelDefault array
 * @param {j} j index of excel row
 * @returns {String|Null} return query string or null
 */
exports.generateQuery = (TabelName, Fields, dat, Index, j) => {
    try {
        // console.log('...............', TabelName, Fields, dat, Index, j, '...............');
        let ColumName = '(';
        let ColumVal = '(';
        for (let i = 0; i < Fields.length; i++) {
            if (this.excelDefault[Index].Validate[i]) {
                let value = this.excelDefault[Index].Validate[i].split('_');
                if (value[1] == 'regex') {
                    if (!this.validate.regex[value[0]].test(dat[this.excelDefault[Index].Columns[i]])) {
                        dat.isValid = false;
                        logger.error(LOG_ID, `Table :- ${TabelName} | Message :- Not a valid ${value[1]} for excel column ${value[0]}(${this.excelDefault[Index].Columns[i]}) in row ${j + 1} | Data : ${JSON.stringify(dat)}.`);
                        return null;
                    }
                }
                if (value[1] == 'enum') {
                    if (!this.validate.enum[value[0]].includes(dat[this.excelDefault[Index].Columns[i]])) {
                        dat.isValid = false;
                        logger.error(LOG_ID, `Table :- ${TabelName} | Message :- Not a valid ${value[1]} for excel column ${value[0]}(${this.excelDefault[Index].Columns[i]}) in row ${j + 1} | Data : ${JSON.stringify(dat)}, only value that are allowed are : ${JSON.stringify(validate.enum[value[1]])}.`);
                        return null;
                    }
                }
            }
            ColumName += i == 0 ? `${Fields[i]}` : `, ${Fields[i]}`;
            ColumVal += i == 0 ? `'${dat[this.excelDefault[Index].Columns[i]]}'` : `, '${dat[this.excelDefault[Index].Columns[i]]}'`;
        }
        ColumName += ')';
        ColumVal += ')';
        // logger.info(LOG_ID, `Table :- ${TabelName} | Message :- query generated for excel row ${j + 1}.`);
        return `INSERT INTO ${TabelName} ${ColumName} OUTPUT INSERTED.ID VALUES ${ColumVal}`;
    } catch (error) {
        // console.log('error>>>>>', error);
        const err = new Error(error);
        const errorDetails = err.stack.split('at ', 2);
        logger.error(LOG_ID, `${err.name} | ${err.message} | Error Details :- ${errorDetails[1]}`);
    }
}