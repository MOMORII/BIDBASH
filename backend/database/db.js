//loads sqlite database support

const Database =
    require("better-sqlite3");

const path =
    require("path");

//builds the persistent database path

const databasePath =
    path.join(
        __dirname,
        "bidbash.db"
    );

//opens the bidbash database

const db =
    new Database(databasePath);

//enables relational integrity

db.pragma(
    "foreign_keys = ON"
);

//improves database write handling

db.pragma(
    "journal_mode = WAL"
);

module.exports = db;