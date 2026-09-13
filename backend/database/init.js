//loads database setup dependencies

const fs =
    require("fs");

const path =
    require("path");

const db =
    require("./db");

//loads the database schema

const schemaPath =
    path.join(
        __dirname,
        "schema.sql"
    );

const schema =
    fs.readFileSync(
        schemaPath,
        "utf8"
    );

//creates the database schema

db.exec(schema);

console.log(
    "BIDBASH database initialised successfully."
);

//checks foreign key enforcement

const foreignKeys =
    db.pragma(
        "foreign_keys",
        {
            simple: true
        }
    );

console.log(
    `Foreign key enforcement: ${
        foreignKeys
            ? "ON"
            : "OFF"
    }`
);

db.close();