//loads database and password tools

const bcrypt =
    require("bcrypt");

const db =
    require("./db");

//loads development users

const users =
    db.prepare(`
        SELECT
            user_id,
            username,
            password_hash
        FROM users
    `).all();

//updates stored passwords

const updatePassword =
    db.prepare(`
        UPDATE users
        SET password_hash = ?
        WHERE user_id = ?
    `);

//hashes development passwords

async function hashPasswords() {
    for (const user of users) {
        const alreadyHashed =
            user.password_hash.startsWith(
                "$2"
            );

        if (alreadyHashed) {
            continue;
        }

        const hashedPassword =
            await bcrypt.hash(
                user.password_hash,
                12
            );

        updatePassword.run(
            hashedPassword,
            user.user_id
        );

        console.log(
            `Hashed password for ${user.username}`
        );
    }

    db.close();

    console.log(
        "BIDBASH passwords updated successfully."
    );
}

hashPasswords();