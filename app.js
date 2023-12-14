var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname));
var server = http.createServer(app);

const db = new sqlite3.Database('microbialite.sqlite3', (err) => {
    if (err) {
        return console.log(err.message);
    }
});

function dbSelect(table, form_data) {
    let query = "SELECT * FROM " + table;
    let flag = false;
    for (const key in form_data) {
        if (form_data[key] != '') {
            query += " WHERE ";
            flag = true;
            break;
        }
    }

    if (flag) {
        for (const key in form_data) {
            let x = parseFloat(form_data[key]);
            if (form_data[key] != '') {
                if (!isNaN(x) && !form_data[key].includes("-")) {
                    query += key + " = " + form_data[key] + " AND ";
                } else {
                    query += key + " = '" + form_data[key] + "' AND ";
                }
            }
        }
        query = query.slice(0, -5);
    }
    query += ";";
    console.log(query);

    return new Promise ((resolve) => {
        db.all(query, (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function dbUpdate(table, form_data) {
    let id_key = Object.keys(form_data)[0];
    let id_value = form_data[Object.keys(form_data)[0]];
    let query = "UPDATE " + table + " SET ";
    for (const key in form_data) {
        if (key != id_key) {
            let x = parseFloat(form_data[key]);
            if (form_data[key] != '') {
                if (!isNaN(x) && !form_data[key].includes("-")) {
                    query += key + " = " + form_data[key] + ", ";
                } else {
                    query += key + " = '" + form_data[key] + "', ";
                }
            }
        }
    }

    query = query.slice(0, -2);
    query += " WHERE " + id_key + " = " + id_value + ";";

    console.log(query);
    return new Promise (() => {
        db.all(query, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

function dbInsert(table, form_data) {
    let query = "INSERT INTO " + table + " VALUES(";
    for (const key in form_data) {
        let x = parseFloat(form_data[key]);
        if (!isNaN(x) && !form_data[key].includes("-")) {
            query += form_data[key] + ", ";
        } else {
            query += "'" + form_data[key] + "', ";
        }
    }
    query = query.slice(0, -2) + ");";
    console.log(query);
    
    return new Promise (() => {
        db.all(query, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

function dbDelete(table, form_data) {
    let query = "DELETE FROM " + table;
    let flag = false;
    for (const key in form_data) {
        if (form_data[key] != '') {
            query += " WHERE ";
            flag = true;
            break;
        }
    }

    if (flag) {
        for (const key in form_data) {
            let x = parseFloat(form_data[key]);
            if (form_data[key] != '') {
                if (!isNaN(x) && !form_data[key].includes("-")) {
                    query += key + " = " + form_data[key] + " AND ";
                } else {
                    query += key + " = '" + form_data[key] + "' AND ";
                }
            }
        }
        query = query.slice(0, -5);
    }
    query += ";";
    console.log(query);

    return new Promise(() => {
        db.all(query, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'WayPointCreation.html'));
    
});

app.post('/way', (req, res) => {
    let operation = req.body["operation"];
    let table = "Waypoint"
    delete req.body.operation;
    if (operation == "insert") {
        dbInsert(table, req.body);
    } else if (operation == "delete") {
        dbDelete(table, req.body);
    } else if (operation == "update") {
        dbUpdate(table, req.body);
    } else if (operation == "select") {
        let promise = dbSelect(table, req.body);
        promise.then((results) => {
            console.log(results);
        })
    }

    res.send("nice job!");
});

app.post('/macro', (req, res) => {});
app.post('/meso', (req, res) => {});
app.post('/thin', (req, res) => {});
app.post('/photo', (req, res) => {});
app.post('/employee', (req, res) => {
    let operation = req.body["operation"];
    let table = "Employee"
    delete req.body.operation;
    if (operation == "insert") {
        dbInsert(table, req.body);
    } else if (operation == "delete") {
        dbDelete(table, req.body);
    } else if (operation == "update") {
        dbUpdate(table, req.body);
    } else if (operation == "select") {
        let promise = dbSelect(table, req.body);
        promise.then((results) => {
            console.log(results);
        })
    }

    res.send("nice job!");
});
app.post('/analyze', (req, res) => {});
app.post('/problem', (req, res) => {});

server.listen(3000, () => {
    console.log("Server listening on port: 3000");
});