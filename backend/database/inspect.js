//loads the bidbash database

const db =
    require("./db");

//lists database tables

const tables =
    db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        ORDER BY name
    `).all();

console.log(
    "\nBIDBASH TABLES"
);

console.table(
    tables
);

//lists categories

const categories =
    db.prepare(`
        SELECT
            category_id,
            name,
            description
        FROM categories
        ORDER BY category_id
    `).all();

console.log(
    "\nCATEGORIES"
);

console.table(
    categories
);

//checks foreign keys

const foreignKeys =
    db.pragma(
        "foreign_keys",
        {
            simple: true
        }
    );

console.log(
    "\nForeign keys:",
    foreignKeys
        ? "ON"
        : "OFF"
);

db.close();