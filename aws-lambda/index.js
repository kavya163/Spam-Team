//include mysql package.
var mysql = require('mysql');

exports.handler = (event, context, callback) => {
    //setting connecting to mysql using hostname, username,password, port, database.
    var connection = mysql.createConnection({
        host: "database-hiims.c4xo9xbwntyw.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "!MSinus2012kk",
        port: "3306",
        database: "sys",
    });
    //initializing sql variable.
    var sql = null;

    //checks whether http_method is PUT and id is not NULL.
    if (event.http_method === "PUT" && event.reportid != null) {
        // console.info("inside put");
        // console.info(event.reportid);
        //setting statusUpdate to event.body.ticketState (in this case "CLOSED")
        var statusUpdate = event.body.ticketState;
        //updating the state to CLOSED in the table using id.
        sql = `UPDATE spam SET state = "${statusUpdate}" WHERE id = "${event.reportid}"`;
    }
    //checks if http_method is GET.
    else if (event.http_method === "GET") {
        //to display all the data where state is OPEN.
        sql = `select * from spam where state="OPEN"`;

    }
    //connecting sql and lambda.
    connection.query(sql, function(err, result, fields) {
        //display error if error occurs
        if (err) {
            connection.end();

            callback(null, JSON.stringify(err));
        }
        //else display result.
        else {
            connection.end();
            callback(null, result);
        }

    });
};
