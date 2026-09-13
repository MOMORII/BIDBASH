//loads database and password services

const bcrypt =
    require("bcrypt");

const db =
    require("./db");

//formats javascript dates for sqlite

function formatDate(
    date
) {
    return date
        .toISOString()
        .replace(
            "T",
            " "
        )
        .slice(
            0,
            19
        );
}

//creates relative development dates

function daysFromNow(
    days,
    hours = 0
) {
    const date =
        new Date();

    date.setDate(
        date.getDate() +
        days
    );

    date.setHours(
        date.getHours() +
        hours
    );

    return formatDate(
        date
    );
}

//clears development data

function clearDatabase() {
    db.exec(`
        DELETE FROM notifications;
        DELETE FROM reports;
        DELETE FROM moderation_cases;
        DELETE FROM fulfilments;
        DELETE FROM payments;
        DELETE FROM orders;
        DELETE FROM bids;
        DELETE FROM auctions;
        DELETE FROM listing_images;
        DELETE FROM listings;
        DELETE FROM categories;
        DELETE FROM user_sessions;
        DELETE FROM users;
        DELETE FROM sqlite_sequence;
    `);
}

//inserts users

const insertUser =
    db.prepare(`
        INSERT INTO users (
            username,
            email,
            password_hash,
            role,
            verified,
            account_status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

//inserts categories

const insertCategory =
    db.prepare(`
        INSERT INTO categories (
            name,
            description
        )
        VALUES (?, ?)
    `);

//inserts listings

const insertListing =
    db.prepare(`
        INSERT INTO listings (
            seller_id,
            category_id,
            title,
            description,
            condition,
            brand,
            starting_price,
            bid_increment,
            delivery_info,
            return_info,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

//inserts listing images

const insertImage =
    db.prepare(`
        INSERT INTO listing_images (
            listing_id,
            file_path,
            display_order
        )
        VALUES (?, ?, ?)
    `);

//inserts auctions

const insertAuction =
    db.prepare(`
        INSERT INTO auctions (
            listing_id,
            start_time,
            end_time,
            current_highest_bid,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `);

//inserts bids

const insertBid =
    db.prepare(`
        INSERT INTO bids (
            auction_id,
            bidder_id,
            amount,
            placed_at,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `);

//inserts moderation cases

const insertModerationCase =
    db.prepare(`
        INSERT INTO moderation_cases (
            listing_id,
            moderator_id,
            flag_reason,
            report_type,
            risk_level,
            evidence,
            additional_notes,
            status,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

//inserts reports

const insertReport =
    db.prepare(`
        INSERT INTO reports (
            listing_id,
            reporter_id,
            moderation_case_id,
            reason,
            description,
            submitted_at,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

//inserts notifications

const insertNotification =
    db.prepare(`
        INSERT INTO notifications (
            user_id,
            auction_id,
            order_id,
            title,
            message,
            notification_type,
            is_read
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

//inserts orders

const insertOrder =
    db.prepare(`
        INSERT INTO orders (
            auction_id,
            buyer_id,
            seller_id,
            final_amount,
            payment_deadline,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

//inserts payments

const insertPayment =
    db.prepare(`
        INSERT INTO payments (
            order_id,
            amount,
            payment_date,
            status
        )
        VALUES (?, ?, ?, ?)
    `);

//inserts fulfilments

const insertFulfilment =
    db.prepare(`
        INSERT INTO fulfilments (
            order_id,
            shipping_address,
            tracking_reference,
            dispatched_at,
            completed_at,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

//populates the development database

const seedDatabase =
    db.transaction(() => {
        clearDatabase();

        //creates reusable password hashes

        const userPassword =
            bcrypt.hashSync(
                "test123",
                12
            );

        const moderatorPassword =
            bcrypt.hashSync(
                "mod123",
                12
            );

        const testPassword =
            bcrypt.hashSync(
                "password123",
                12
            );

        //creates users

        const users = {};

        users.user =
            Number(
                insertUser.run(
                    "user",
                    "user@bidbash.test",
                    userPassword,
                    "user",
                    1,
                    "active"
                ).lastInsertRowid
            );

        users.moderator =
            Number(
                insertUser.run(
                    "moderator",
                    "moderator@bidbash.test",
                    moderatorPassword,
                    "moderator",
                    1,
                    "active"
                ).lastInsertRowid
            );

        const testUsers = [
            "retrocollector",
            "designerfinds",
            "oldschooltoys",
            "techwarehouse",
            "historymarket",
            "bidder92",
            "collector77",
            "homefinds",
            "sportsvault",
            "musicmerchant",
            "bookcorner",
            "pixeltrader"
        ];

        testUsers.forEach(
            username => {
                users[username] =
                    Number(
                        insertUser.run(
                            username,
                            `${username}@bidbash.test`,
                            testPassword,
                            "user",
                            1,
                            "active"
                        ).lastInsertRowid
                    );
            }
        );

        //creates categories

        const categories = {};

        const categoryData = [
            [
                "Electronics",
                "Technology, cameras, computers and electronic devices."
            ],
            [
                "Collectibles",
                "Collectible, rare and specialist items."
            ],
            [
                "Fashion",
                "Clothing, footwear and accessories."
            ],
            [
                "Home",
                "Furniture, decoration and household items."
            ],
            [
                "Gaming",
                "Games, consoles and gaming accessories."
            ],
            [
                "Sports",
                "Sports equipment and memorabilia."
            ],
            [
                "Books",
                "Books, signed editions and printed material."
            ],
            [
                "Music",
                "Records, instruments and music equipment."
            ]
        ];

        categoryData.forEach(
            category => {
                categories[
                    category[0]
                ] =
                    Number(
                        insertCategory.run(
                            category[0],
                            category[1]
                        ).lastInsertRowid
                    );
            }
        );

        //defines active development listings

        const activeListings = [
            {
                key: "user-camera",
                seller: "user",
                category: "Electronics",
                title: "Vintage 35mm Camera",
                description: "Classic 35mm film camera supplied with lens, strap and protective case.",
                condition: "Used",
                brand: "Canon",
                startingPrice: 85,
                increment: 5,
                delivery: "Tracked UK delivery available.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "user-keyboard",
                seller: "user",
                category: "Electronics",
                title: "RGB Mechanical Keyboard",
                description: "Full-size mechanical keyboard with tactile switches and programmable RGB lighting.",
                condition: "Used",
                brand: "KeyForge",
                startingPrice: 45,
                increment: 2,
                delivery: "Standard UK delivery available.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "user-lamp",
                seller: "user",
                category: "Home",
                title: "Art Deco Table Lamp",
                description: "Decorative brass-effect table lamp inspired by Art Deco interiors.",
                condition: "Used",
                brand: "Maison",
                startingPrice: 35,
                increment: 5,
                delivery: "Carefully packed UK delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "user-book",
                seller: "user",
                category: "Books",
                title: "Signed Fantasy Novel",
                description: "Signed first-edition fantasy novel with dust jacket.",
                condition: "Very Good",
                brand: null,
                startingPrice: 30,
                increment: 2,
                delivery: "Tracked letter delivery.",
                returns: "Returns accepted within 14 days."
            },

            {
                key: "retro-console",
                seller: "retrocollector",
                category: "Gaming",
                title: "Retro Handheld Console",
                description: "Classic handheld gaming console in working condition with battery cover intact.",
                condition: "Used",
                brand: "RetroTech",
                startingPrice: 75,
                increment: 5,
                delivery: "Standard UK delivery available.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "gaming-laptop",
                seller: "techwarehouse",
                category: "Electronics",
                title: "15-inch Gaming Laptop",
                description: "Gaming laptop with dedicated graphics, 16GB RAM and 512GB SSD.",
                condition: "Used",
                brand: "Acer",
                startingPrice: 350,
                increment: 10,
                delivery: "Insured tracked delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "vinyl-record",
                seller: "musicmerchant",
                category: "Music",
                title: "Limited Edition Vinyl Record",
                description: "Limited pressing on coloured vinyl supplied in original sleeve.",
                condition: "Very Good",
                brand: null,
                startingPrice: 40,
                increment: 5,
                delivery: "Vinyl mailer with tracked delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "collectible-figure",
                seller: "historymarket",
                category: "Collectibles",
                title: "Limited Collectible Figure",
                description: "Numbered collectible display figure with original presentation box.",
                condition: "Used",
                brand: "Heritage Works",
                startingPrice: 35,
                increment: 5,
                delivery: "Standard tracked delivery.",
                returns: "Returns accepted within 14 days."
            },

            {
                key: "designer-jacket",
                seller: "designerfinds",
                category: "Fashion",
                title: "Designer Denim Jacket",
                description: "Premium denim jacket with embroidered rear detailing.",
                condition: "Used",
                brand: "North & Row",
                startingPrice: 60,
                increment: 5,
                delivery: "Tracked UK delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "train-set",
                seller: "oldschooltoys",
                category: "Collectibles",
                title: "Vintage Model Train Set",
                description: "Boxed model railway starter set with locomotive, carriages and track.",
                condition: "Used",
                brand: "Hornby",
                startingPrice: 90,
                increment: 5,
                delivery: "Large parcel tracked delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "smartwatch",
                seller: "techwarehouse",
                category: "Electronics",
                title: "GPS Smartwatch",
                description: "GPS smartwatch with heart-rate monitoring and charging cable.",
                condition: "Used",
                brand: "Garmin",
                startingPrice: 95,
                increment: 5,
                delivery: "Tracked UK delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "typewriter",
                seller: "historymarket",
                category: "Collectibles",
                title: "Vintage Portable Typewriter",
                description: "Portable manual typewriter supplied in original hard carrying case.",
                condition: "Used",
                brand: "Olympia",
                startingPrice: 70,
                increment: 5,
                delivery: "Insured courier delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "armchair",
                seller: "homefinds",
                category: "Home",
                title: "Mid-Century Accent Chair",
                description: "Upholstered wooden accent chair inspired by mid-century furniture.",
                condition: "Used",
                brand: "Oak & Loom",
                startingPrice: 110,
                increment: 10,
                delivery: "Collection or furniture courier.",
                returns: "Returns accepted by arrangement."
            },
            {
                key: "coffee-grinder",
                seller: "homefinds",
                category: "Home",
                title: "Electric Coffee Grinder",
                description: "Stainless-steel burr grinder with adjustable grind settings.",
                condition: "Used",
                brand: "Barista Works",
                startingPrice: 28,
                increment: 2,
                delivery: "Standard UK delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "football-shirt",
                seller: "sportsvault",
                category: "Sports",
                title: "Signed Football Shirt",
                description: "Framed football shirt supplied with authenticity documentation.",
                condition: "Very Good",
                brand: "Nike",
                startingPrice: 140,
                increment: 10,
                delivery: "Insured tracked delivery.",
                returns: "Returns accepted subject to condition."
            },
            {
                key: "tennis-racket",
                seller: "sportsvault",
                category: "Sports",
                title: "Professional Tennis Racket",
                description: "Graphite performance racket with protective carrying sleeve.",
                condition: "Used",
                brand: "Wilson",
                startingPrice: 65,
                increment: 5,
                delivery: "Tracked UK delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "record-player",
                seller: "musicmerchant",
                category: "Music",
                title: "Bluetooth Record Player",
                description: "Belt-drive record player with integrated Bluetooth output.",
                condition: "Used",
                brand: "Audio House",
                startingPrice: 80,
                increment: 5,
                delivery: "Tracked fragile-item delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "electric-guitar",
                seller: "musicmerchant",
                category: "Music",
                title: "Electric Guitar",
                description: "Solid-body electric guitar with padded gig bag.",
                condition: "Used",
                brand: "Squier",
                startingPrice: 120,
                increment: 10,
                delivery: "Insured courier delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "history-book",
                seller: "bookcorner",
                category: "Books",
                title: "Illustrated History Collection",
                description: "Four-volume illustrated history reference collection.",
                condition: "Very Good",
                brand: null,
                startingPrice: 25,
                increment: 2,
                delivery: "Tracked parcel delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "comic-set",
                seller: "bookcorner",
                category: "Books",
                title: "Classic Comic Collection",
                description: "Collection of twelve classic comic issues stored in protective sleeves.",
                condition: "Good",
                brand: null,
                startingPrice: 55,
                increment: 5,
                delivery: "Tracked parcel delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "controller",
                seller: "pixeltrader",
                category: "Gaming",
                title: "Wireless Pro Controller",
                description: "Wireless controller with programmable rear buttons and charging cable.",
                condition: "Used",
                brand: "PowerPlay",
                startingPrice: 38,
                increment: 2,
                delivery: "Standard UK delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "console-bundle",
                seller: "pixeltrader",
                category: "Gaming",
                title: "Current-Generation Console Bundle",
                description: "Home console supplied with controller, HDMI cable and three games.",
                condition: "Used",
                brand: "GameBox",
                startingPrice: 240,
                increment: 10,
                delivery: "Insured tracked delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "boots",
                seller: "designerfinds",
                category: "Fashion",
                title: "Leather Chelsea Boots",
                description: "Brown leather Chelsea boots with elasticated side panels.",
                condition: "Very Good",
                brand: "Harrington",
                startingPrice: 50,
                increment: 5,
                delivery: "Tracked UK delivery.",
                returns: "Returns accepted within 14 days."
            },
            {
                key: "watch",
                seller: "designerfinds",
                category: "Fashion",
                title: "Automatic Wristwatch",
                description: "Automatic stainless-steel wristwatch with leather strap.",
                condition: "Used",
                brand: "Marston",
                startingPrice: 125,
                increment: 10,
                delivery: "Insured tracked delivery.",
                returns: "Returns accepted within 14 days."
            }
        ];

        const listings = {};
        const auctions = {};

        //creates active listings and auctions

        activeListings.forEach(
            (
                listing,
                index
            ) => {
                const listingResult =
                    insertListing.run(
                        users[
                            listing.seller
                        ],
                        categories[
                            listing.category
                        ],
                        listing.title,
                        listing.description,
                        listing.condition,
                        listing.brand,
                        listing.startingPrice,
                        listing.increment,
                        listing.delivery,
                        listing.returns,
                        "active"
                    );

                const listingId =
                    Number(
                        listingResult
                            .lastInsertRowid
                    );

                listings[
                    listing.key
                ] =
                    listingId;

                insertImage.run(
                    listingId,
                    "/images/placeholder.png",
                    1
                );

                const endDays =
                    2 +
                    (
                        index %
                        9
                    );

                const auctionResult =
                    insertAuction.run(
                        listingId,
                        daysFromNow(
                            -2
                        ),
                        daysFromNow(
                            endDays,
                            index %
                                12
                        ),
                        null,
                        "active"
                    );

                auctions[
                    listing.key
                ] =
                    Number(
                        auctionResult
                            .lastInsertRowid
                    );
            }
        );

        //creates user's four active bidding relationships

        insertBid.run(
            auctions[
                "retro-console"
            ],
            users.bidder92,
            80,
            daysFromNow(
                -1,
                -3
            ),
            "outbid"
        );

        insertBid.run(
            auctions[
                "retro-console"
            ],
            users.user,
            90,
            daysFromNow(
                -1,
                -1
            ),
            "winning"
        );

        db.prepare(`
            UPDATE auctions
            SET current_highest_bid = 90
            WHERE auction_id = ?
        `).run(
            auctions[
                "retro-console"
            ]
        );

        insertBid.run(
            auctions[
                "gaming-laptop"
            ],
            users.user,
            420,
            daysFromNow(
                -1,
                -4
            ),
            "outbid"
        );

        insertBid.run(
            auctions[
                "gaming-laptop"
            ],
            users.collector77,
            450,
            daysFromNow(
                -1,
                -2
            ),
            "winning"
        );

        db.prepare(`
            UPDATE auctions
            SET current_highest_bid = 450
            WHERE auction_id = ?
        `).run(
            auctions[
                "gaming-laptop"
            ]
        );

        insertBid.run(
            auctions[
                "vinyl-record"
            ],
            users.collector77,
            55,
            daysFromNow(
                -1,
                -5
            ),
            "outbid"
        );

        insertBid.run(
            auctions[
                "vinyl-record"
            ],
            users.user,
            65,
            daysFromNow(
                -1,
                -1
            ),
            "winning"
        );

        db.prepare(`
            UPDATE auctions
            SET current_highest_bid = 65
            WHERE auction_id = ?
        `).run(
            auctions[
                "vinyl-record"
            ]
        );

        insertBid.run(
            auctions[
                "collectible-figure"
            ],
            users.user,
            45,
            daysFromNow(
                -2,
                2
            ),
            "outbid"
        );

        insertBid.run(
            auctions[
                "collectible-figure"
            ],
            users.bidder92,
            55,
            daysFromNow(
                -1,
                3
            ),
            "winning"
        );

        db.prepare(`
            UPDATE auctions
            SET current_highest_bid = 55
            WHERE auction_id = ?
        `).run(
            auctions[
                "collectible-figure"
            ]
        );

        //creates bids on other active auctions

        const competingBids = [
            [
                "designer-jacket",
                "bidder92",
                75
            ],
            [
                "train-set",
                "collector77",
                110
            ],
            [
                "smartwatch",
                "retrocollector",
                115
            ],
            [
                "typewriter",
                "oldschooltoys",
                85
            ],
            [
                "armchair",
                "designerfinds",
                140
            ],
            [
                "football-shirt",
                "historymarket",
                170
            ],
            [
                "record-player",
                "collector77",
                95
            ],
            [
                "console-bundle",
                "sportsvault",
                280
            ],
            [
                "watch",
                "retrocollector",
                145
            ]
        ];

        competingBids.forEach(
            bid => {
                insertBid.run(
                    auctions[
                        bid[0]
                    ],
                    users[
                        bid[1]
                    ],
                    bid[2],
                    daysFromNow(
                        -1
                    ),
                    "winning"
                );

                db.prepare(`
                    UPDATE auctions
                    SET current_highest_bid = ?
                    WHERE auction_id = ?
                `).run(
                    bid[2],
                    auctions[
                        bid[0]
                    ]
                );
            }
        );

        //creates completed listing one

        const completedKeyboard =
            Number(
                insertListing.run(
                    users.techwarehouse,
                    categories.Electronics,
                    "Premium Mechanical Keyboard",
                    "Premium aluminium mechanical keyboard with tactile switches.",
                    "Used",
                    "KeyForge",
                    70,
                    5,
                    "Tracked UK delivery.",
                    "Returns accepted within 14 days.",
                    "sold"
                ).lastInsertRowid
            );

        insertImage.run(
            completedKeyboard,
            "/images/placeholder.png",
            1
        );

        const completedKeyboardAuction =
            Number(
                insertAuction.run(
                    completedKeyboard,
                    daysFromNow(
                        -14
                    ),
                    daysFromNow(
                        -7
                    ),
                    105,
                    "ended"
                ).lastInsertRowid
            );

        insertBid.run(
            completedKeyboardAuction,
            users.bidder92,
            95,
            daysFromNow(
                -8,
                -4
            ),
            "lost"
        );

        insertBid.run(
            completedKeyboardAuction,
            users.user,
            105,
            daysFromNow(
                -8,
                -1
            ),
            "won"
        );

        //creates completed listing two

        const completedHeadphones =
            Number(
                insertListing.run(
                    users.techwarehouse,
                    categories.Electronics,
                    "Wireless Studio Headphones",
                    "Wireless over-ear headphones supplied with charging cable and case.",
                    "Used",
                    "SoundCore",
                    55,
                    5,
                    "Tracked UK delivery.",
                    "Returns accepted within 14 days.",
                    "ended"
                ).lastInsertRowid
            );

        insertImage.run(
            completedHeadphones,
            "/images/placeholder.png",
            1
        );

        const completedHeadphonesAuction =
            Number(
                insertAuction.run(
                    completedHeadphones,
                    daysFromNow(
                        -12
                    ),
                    daysFromNow(
                        -5
                    ),
                    80,
                    "ended"
                ).lastInsertRowid
            );

        insertBid.run(
            completedHeadphonesAuction,
            users.user,
            70,
            daysFromNow(
                -6,
                -5
            ),
            "lost"
        );

        insertBid.run(
            completedHeadphonesAuction,
            users.collector77,
            80,
            daysFromNow(
                -6,
                -2
            ),
            "won"
        );

        //creates completed listing three

        const completedChair =
            Number(
                insertListing.run(
                    users.homefinds,
                    categories.Home,
                    "Vintage Reading Chair",
                    "Upholstered vintage reading chair with wooden arms.",
                    "Used",
                    null,
                    80,
                    10,
                    "Furniture courier or collection.",
                    "Returns accepted by arrangement.",
                    "sold"
                ).lastInsertRowid
            );

        insertImage.run(
            completedChair,
            "/images/placeholder.png",
            1
        );

        const completedChairAuction =
            Number(
                insertAuction.run(
                    completedChair,
                    daysFromNow(
                        -16
                    ),
                    daysFromNow(
                        -9
                    ),
                    130,
                    "ended"
                ).lastInsertRowid
            );

        insertBid.run(
            completedChairAuction,
            users.bidder92,
            130,
            daysFromNow(
                -10
            ),
            "won"
        );

        //creates order for user's won auction

        const keyboardOrder =
            Number(
                insertOrder.run(
                    completedKeyboardAuction,
                    users.user,
                    users.techwarehouse,
                    105,
                    daysFromNow(
                        -5
                    ),
                    "paid"
                ).lastInsertRowid
            );

        insertPayment.run(
            keyboardOrder,
            105,
            daysFromNow(
                -6
            ),
            "paid"
        );

        insertFulfilment.run(
            keyboardOrder,
            "Development Address, London, UK",
            "BID-KB-105",
            daysFromNow(
                -5
            ),
            null,
            "dispatched"
        );

        //creates initial notifications

        insertNotification.run(
            users.user,
            auctions[
                "retro-console"
            ],
            null,
            "Bid Accepted",
            "Your £90.00 bid on Retro Handheld Console was accepted.",
            "bid_accepted",
            1
        );

        insertNotification.run(
            users.user,
            auctions[
                "gaming-laptop"
            ],
            null,
            "You've Been Outbid",
            "A higher bid has been placed on 15-inch Gaming Laptop.",
            "outbid",
            0
        );

        insertNotification.run(
            users.user,
            auctions[
                "vinyl-record"
            ],
            null,
            "Bid Accepted",
            "Your £65.00 bid on Limited Edition Vinyl Record was accepted.",
            "bid_accepted",
            1
        );

        insertNotification.run(
            users.user,
            auctions[
                "collectible-figure"
            ],
            null,
            "You've Been Outbid",
            "A higher bid has been placed on Limited Collectible Figure.",
            "outbid",
            0
        );

        insertNotification.run(
            users.user,
            completedKeyboardAuction,
            keyboardOrder,
            "You Won!",
            "You won Premium Mechanical Keyboard for £105.00.",
            "auction_won",
            0
        );

        insertNotification.run(
            users.user,
            completedHeadphonesAuction,
            null,
            "Auction Ended",
            "Wireless Studio Headphones ended with another bidder winning.",
            "auction_lost",
            1
        );

        //creates moderation cases

        const moderationTargets = [
            {
                listing:
                    listings[
                        "designer-jacket"
                    ],
                reporter:
                    users.collector77,
                reason:
                    "Potentially misleading branding information.",
                type:
                    "misleading",
                risk:
                    "medium",
                evidence:
                    "User-submitted report.",
                notes:
                    "Review description and supplied product imagery."
            },
            {
                listing:
                    listings[
                        "smartwatch"
                    ],
                reporter:
                    users.bidder92,
                reason:
                    "Possible product authenticity concern.",
                type:
                    "counterfeit",
                risk:
                    "medium",
                evidence:
                    "User-submitted report.",
                notes:
                    "Check serial information and seller evidence."
            },
            {
                listing:
                    listings[
                        "coffee-grinder"
                    ],
                reporter:
                    users.retrocollector,
                reason:
                    "Possible electrical safety concern.",
                type:
                    "unsafe",
                risk:
                    "low",
                evidence:
                    "User-submitted report.",
                notes:
                    "Review electrical condition and listing description."
            }
        ];

        moderationTargets.forEach(
            target => {
                const moderationCase =
                    Number(
                        insertModerationCase.run(
                            target.listing,
                            null,
                            target.reason,
                            target.type,
                            target.risk,
                            target.evidence,
                            target.notes,
                            "awaiting",
                            daysFromNow(
                                -1
                            )
                        ).lastInsertRowid
                    );

                insertReport.run(
                    target.listing,
                    target.reporter,
                    moderationCase,
                    target.reason,
                    target.notes,
                    daysFromNow(
                        -1
                    ),
                    "reviewing"
                );
            }
        );
    });

//runs development seed

seedDatabase();

console.log(
    "BIDBASH development database repopulated successfully."
);

console.log(
    "Active auctions: 24"
);

console.log(
    "User-owned active listings: 4"
);

console.log(
    "User active bid auctions: 4"
);

db.close();