//loads the bidbash database

const db =
    require("../database/db");

//finds a user by id

function getById(userId) {
    return db.prepare(`
        SELECT
            user_id,
            username,
            email,
            password_hash,
            role,
            verified,
            account_status,
            created_at
        FROM users
        WHERE user_id = ?
    `).get(
        Number(userId)
    );
}

//finds a user by username

function getByUsername(username) {
    return db.prepare(`
        SELECT
            user_id,
            username,
            email,
            password_hash,
            role,
            verified,
            account_status,
            created_at
        FROM users
        WHERE username = ?
    `).get(
        username
    );
}

//finds a user by email

function getByEmail(email) {
    return db.prepare(`
        SELECT
            user_id,
            username,
            email,
            password_hash,
            role,
            verified,
            account_status,
            created_at
        FROM users
        WHERE email = ?
    `).get(
        email
    );
}

//creates a registered user

function create({
    username,
    email,
    passwordHash
}) {
    const result =
        db.prepare(`
            INSERT INTO users (
                username,
                email,
                password_hash,
                role,
                verified,
                account_status
            )
            VALUES (
                ?,
                ?,
                ?,
                'user',
                0,
                'active'
            )
        `).run(
            username,
            email,
            passwordHash
        );

    return getById(
        result.lastInsertRowid
    );
}

module.exports = {
    getById,
    getByUsername,
    getByEmail,
    create
};