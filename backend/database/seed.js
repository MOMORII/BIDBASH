//loads the bidbash database

const db =
    require("./db");

//inserts default users

const insertUser =
    db.prepare(`
        INSERT OR IGNORE INTO users (
            username,
            email,
            password_hash,
            role,
            verified,
            account_status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

//inserts default categories

const insertCategory =
    db.prepare(`
        INSERT OR IGNORE INTO categories (
            name,
            description
        )
        VALUES (?, ?)
    `);

//seeds initial development data

const seedDatabase =
    db.transaction(() => {
        insertUser.run(
            "user",
            "user@bidbash.test",
            "test123",
            "user",
            1,
            "active"
        );

        insertUser.run(
            "moderator",
            "moderator@bidbash.test",
            "mod123",
            "moderator",
            1,
            "active"
        );

        insertCategory.run(
            "Electronics",
            "Consumer electronics and technology."
        );

        insertCategory.run(
            "Collectibles",
            "Collectible and specialist items."
        );

        insertCategory.run(
            "Fashion",
            "Clothing, accessories and fashion items."
        );

        insertCategory.run(
            "Gaming",
            "Gaming hardware, software and accessories."
        );

        insertCategory.run(
            "Home",
            "Home and household items."
        );
    });

seedDatabase();

console.log(
    "BIDBASH development data inserted successfully."
);

db.close();Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter sqlite3.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName