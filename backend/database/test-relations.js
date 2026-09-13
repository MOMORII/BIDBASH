//loads the bidbash database

const db =
    require("./db");

//tests foreign key enforcement

try {
    db.prepare(`
        INSERT INTO bids (
            auction_id,
            bidder_id,
            amount,
            status
        )
        VALUES (?, ?, ?, ?)
    `).run(
        999999,
        999999,
        100,
        "active"
    );

    console.log(
        "Relationship test failed."
    );
} catch (error) {
    console.log(
        "Relationship protection working."
    );

    console.log(
        error.message
    );
}

db.close();