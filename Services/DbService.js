const dbConfig = require("../config/db");
const mysql = require("mysql");

async function common_db_call(spName, plist, callback) {
    
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            callback(err, null);
            return;
        }

        const queryParams = [];
        const outputParams = [];

        plist.forEach(item => {
            if (item.Direction === 0) {
                // Setting input parameters
                queryParams.push(item.Value);
            } else if (item.Direction === 1) {
                // Setting output parameters
                outputParams.push(item.ParamName);
            }
        });

        const query = `CALL ${spName}(${queryParams.map(() => '?').join(', ')})`;
        // console.log(query);

        connection.query(query, queryParams, (err, result) => {
            if (err) {
                console.log(err);
                connection.end();
                return callback(err, null);
            }
            // console.log("Result from service: ", result)
            callback(null, result);
            connection.end();
        });
    });
}

module.exports.common_db_call = common_db_call;