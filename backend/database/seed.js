//loads the bidbash database

const db =
    require("./db");

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
    `);
}

//resets autoincrement values

function resetSequences() {
    db.exec(`
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

const insertListingImage =
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
            created_at,
            reviewed_at,
            decision_notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

//seeds the complete development database

const seedDatabase =
    db.transaction(() => {
        clearDatabase();
        resetSequences();

        //creates development users

        const standardUser =
            insertUser.run(
                "user",
                "user@bidbash.test",
                "test123",
                "user",
                1,
                "active"
            );

        const moderatorUser =
            insertUser.run(
                "moderator",
                "moderator@bidbash.test",
                "mod123",
                "moderator",
                1,
                "active"
            );

        const retroCollector =
            insertUser.run(
                "retrocollector",
                "retrocollector@bidbash.test",
                "password",
                "user",
                1,
                "active"
            );

        const designerFinds =
            insertUser.run(
                "designerfinds",
                "designerfinds@bidbash.test",
                "password",
                "user",
                1,
                "active"
            );

        const oldSchoolToys =
            insertUser.run(
                "oldschooltoys",
                "oldschooltoys@bidbash.test",
                "password",
                "user",
                1,
                "active"
            );

        const techWarehouse =
            insertUser.run(
                "techwarehouse",
                "techwarehouse@bidbash.test",
                "password",
                "user",
                1,
                "active"
            );

        const historyMarket =
            insertUser.run(
                "historymarket",
                "historymarket@bidbash.test",
                "password",
                "user",
                1,
                "active"
            );

        const bidderTwo =
            insertUser.run(
                "bidder92",
                "bidder92@bidbash.test",
                "password",
                "user",
                1,
                "active"
            );

        const bidderThree =
            insertUser.run(
                "collector77",
                "collector77@bidbash.test",
                "password",
                "user",
                1,
                "active"
            );

        //creates categories

        const electronics =
            insertCategory.run(
                "Electronics",
                "Consumer electronics and technology."
            );

        const collectibles =
            insertCategory.run(
                "Collectibles",
                "Collectible and specialist items."
            );

        const fashion =
            insertCategory.run(
                "Fashion",
                "Clothing, accessories and fashion items."
            );

        const home =
            insertCategory.run(
                "Home",
                "Home and household items."
            );

        const gaming =
            insertCategory.run(
                "Gaming",
                "Gaming hardware, software and accessories."
            );

        //creates active listings

        const retroConsole =
            insertListing.run(
                retroCollector.lastInsertRowid,
                gaming.lastInsertRowid,
                "Retro Handheld Console",
                "Classic handheld gaming console in working condition.",
                "Used",
                "RetroTech",
                75,
                5,
                "Standard UK delivery available.",
                "Returns accepted within 14 days where applicable.",
                "active"
            );

        const vintageCamera =
            insertListing.run(
                standardUser.lastInsertRowid,
                electronics.lastInsertRowid,
                "Vintage Camera",
                "Vintage film camera with original carrying case.",
                "Used",
                "Kodak",
                95,
                5,
                "Tracked UK delivery.",
                "Returns accepted within 14 days.",
                "active"
            );

        const mechanicalKeyboard =
            insertListing.run(
                techWarehouse.lastInsertRowid,
                electronics.lastInsertRowid,
                "Mechanical Keyboard",
                "Mechanical keyboard with tactile switches and backlighting.",
                "Used",
                "KeyForge",
                70,
                2,
                "Standard UK delivery.",
                "Returns accepted within 14 days.",
                "sold"
            );

        const collectibleFigure =
            insertListing.run(
                historyMarket.lastInsertRowid,
                collectibles.lastInsertRowid,
                "Collectible Figure",
                "Limited-edition collectible display figure.",
                "Used",
                null,
                40,
                1,
                "Standard UK delivery.",
                "Returns accepted within 14 days.",
                "ended"
            );

        const wirelessHeadphones =
            insertListing.run(
                techWarehouse.lastInsertRowid,
                electronics.lastInsertRowid,
                "Wireless Headphones",
                "Over-ear wireless headphones with charging cable.",
                "Used",
                "SoundCore",
                60,
                2,
                "Standard UK delivery.",
                "Returns accepted within 14 days.",
                "sold"
            );

        //creates moderation listings

        const antiqueSword =
            insertListing.run(
                retroCollector.lastInsertRowid,
                collectibles.lastInsertRowid,
                "Antique Display Sword",
                "Decorative antique-style display sword.",
                "Used",
                null,
                80,
                5,
                "Collection preferred.",
                "Returns subject to review.",
                "active"
            );

        const designerHandbag =
            insertListing.run(
                designerFinds.lastInsertRowid,
                fashion.lastInsertRowid,
                "Designer Handbag",
                "Pre-owned designer-style handbag.",
                "Used",
                "Unknown",
                120,
                5,
                "Tracked UK delivery.",
                "Returns accepted within 14 days.",
                "active"
            );

        const vintageToys =
            insertListing.run(
                oldSchoolToys.lastInsertRowid,
                collectibles.lastInsertRowid,
                "Vintage Toy Collection",
                "Mixed vintage toy collection.",
                "Used",
                null,
                55,
                2,
                "Standard UK delivery.",
                "Returns accepted within 14 days.",
                "active"
            );

        const usbCharger =
            insertListing.run(
                techWarehouse.lastInsertRowid,
                electronics.lastInsertRowid,
                "Unbranded USB Charger",
                "USB wall charger with detachable cable.",
                "New",
                null,
                10,
                1,
                "Standard UK delivery.",
                "Returns accepted within 14 days.",
                "active"
            );

        const replicaCollectible =
            insertListing.run(
                historyMarket.lastInsertRowid,
                collectibles.lastInsertRowid,
                "Replica Collectible",
                "Replica historical collectible for display purposes.",
                "Used",
                null,
                45,
                2,
                "Standard UK delivery.",
                "Returns accepted within 14 days.",
                "active"
            );

        //adds listing image placeholders

        [
            retroConsole,
            vintageCamera,
            mechanicalKeyboard,
            collectibleFigure,
            wirelessHeadphones,
            antiqueSword,
            designerHandbag,
            vintageToys,
            usbCharger,
            replicaCollectible
        ].forEach(
            listing => {
                insertListingImage.run(
                    listing.lastInsertRowid,
                    "/images/placeholder.png",
                    1
                );
            }
        );

        //creates auctions

        const retroAuction =
            insertAuction.run(
                retroConsole.lastInsertRowid,
                "2026-09-13 09:00:00",
                "2026-09-20 18:00:00",
                90,
                "active"
            );

        const cameraAuction =
            insertAuction.run(
                vintageCamera.lastInsertRowid,
                "2026-09-12 09:00:00",
                "2026-09-19 20:00:00",
                120,
                "active"
            );

        const keyboardAuction =
            insertAuction.run(
                mechanicalKeyboard.lastInsertRowid,
                "2026-09-01 09:00:00",
                "2026-09-10 18:00:00",
                96,
                "ended"
            );

        const figureAuction =
            insertAuction.run(
                collectibleFigure.lastInsertRowid,
                "2026-08-28 09:00:00",
                "2026-09-06 18:00:00",
                58,
                "ended"
            );

        const headphonesAuction =
            insertAuction.run(
                wirelessHeadphones.lastInsertRowid,
                "2026-08-24 09:00:00",
                "2026-09-02 18:00:00",
                76,
                "ended"
            );

        //creates current and historical bids

        insertBid.run(
            retroAuction.lastInsertRowid,
            standardUser.lastInsertRowid,
            90,
            "2026-09-13 10:15:00",
            "winning"
        );

        insertBid.run(
            retroAuction.lastInsertRowid,
            bidderTwo.lastInsertRowid,
            85,
            "2026-09-13 10:00:00",
            "outbid"
        );

        insertBid.run(
            cameraAuction.lastInsertRowid,
            standardUser.lastInsertRowid,
            115,
            "2026-09-12 14:00:00",
            "outbid"
        );

        insertBid.run(
            cameraAuction.lastInsertRowid,
            bidderThree.lastInsertRowid,
            120,
            "2026-09-12 14:10:00",
            "winning"
        );

        insertBid.run(
            keyboardAuction.lastInsertRowid,
            standardUser.lastInsertRowid,
            96,
            "2026-09-09 17:30:00",
            "won"
        );

        insertBid.run(
            figureAuction.lastInsertRowid,
            standardUser.lastInsertRowid,
            49,
            "2026-09-06 16:00:00",
            "lost"
        );

        insertBid.run(
            figureAuction.lastInsertRowid,
            bidderTwo.lastInsertRowid,
            58,
            "2026-09-06 17:50:00",
            "won"
        );

        insertBid.run(
            headphonesAuction.lastInsertRowid,
            standardUser.lastInsertRowid,
            76,
            "2026-09-02 17:40:00",
            "won"
        );

        //creates completed order for keyboard auction

        const keyboardOrder =
            insertOrder.run(
                keyboardAuction.lastInsertRowid,
                standardUser.lastInsertRowid,
                techWarehouse.lastInsertRowid,
                96,
                "2026-09-13 18:00:00",
                "paid"
            );

        insertPayment.run(
            keyboardOrder.lastInsertRowid,
            96,
            "2026-09-10 19:15:00",
            "paid"
        );

        insertFulfilment.run(
            keyboardOrder.lastInsertRowid,
            "Development Address, London, UK",
            null,
            null,
            null,
            "awaiting-dispatch"
        );

        //creates completed order for headphones auction

        const headphonesOrder =
            insertOrder.run(
                headphonesAuction.lastInsertRowid,
                standardUser.lastInsertRowid,
                techWarehouse.lastInsertRowid,
                76,
                "2026-09-05 18:00:00",
                "paid"
            );

        insertPayment.run(
            headphonesOrder.lastInsertRowid,
            76,
            "2026-09-02 19:00:00",
            "paid"
        );

        insertFulfilment.run(
            headphonesOrder.lastInsertRowid,
            "Development Address, London, UK",
            "BID123456789",
            "2026-09-03 10:30:00",
            null,
            "dispatched"
        );

        //creates moderation cases

        const swordCase =
            insertModerationCase.run(
                antiqueSword.lastInsertRowid,
                null,
                "Potential prohibited weapon classification.",
                "prohibited",
                "high",
                "Automated listing detection.",
                "Automated detection identified features requiring human review.",
                "awaiting",
                "2026-09-12 14:32:00",
                null,
                null
            );

        const handbagCase =
            insertModerationCase.run(
                designerHandbag.lastInsertRowid,
                null,
                "Listing reported as potentially counterfeit.",
                "counterfeit",
                "medium",
                "Multiple user reports.",
                "Multiple reports reference inconsistent branding information.",
                "awaiting",
                "2026-09-12 13:18:00",
                null,
                null
            );

        const toysCase =
            insertModerationCase.run(
                vintageToys.lastInsertRowid,
                null,
                "Listing description may contain misleading information.",
                "misleading",
                "low",
                "Reported listing description.",
                "Review item description against the photographs supplied.",
                "awaiting",
                "2026-09-11 19:44:00",
                null,
                null
            );

        const chargerCase =
            insertModerationCase.run(
                usbCharger.lastInsertRowid,
                null,
                "Possible product safety concern.",
                "unsafe",
                "low",
                "Missing safety certification.",
                "Safety certification information has not been supplied.",
                "awaiting",
                "2026-09-11 16:09:00",
                null,
                null
            );

        const replicaCase =
            insertModerationCase.run(
                replicaCollectible.lastInsertRowid,
                moderatorUser.lastInsertRowid,
                "Seller has appealed a previous moderation restriction.",
                "restricted",
                "medium",
                "Seller-submitted supporting evidence.",
                "Seller supplied additional photographs and supporting information.",
                "appeal",
                "2026-09-10 11:21:00",
                null,
                null
            );

        //creates reports

        insertReport.run(
            antiqueSword.lastInsertRowid,
            bidderTwo.lastInsertRowid,
            swordCase.lastInsertRowid,
            "Potential prohibited item",
            "Item may fall within a restricted weapon category.",
            "2026-09-12 14:32:00",
            "reviewing"
        );

        insertReport.run(
            designerHandbag.lastInsertRowid,
            bidderTwo.lastInsertRowid,
            handbagCase.lastInsertRowid,
            "Possible counterfeit",
            "Branding appears inconsistent with expected product details.",
            "2026-09-12 13:18:00",
            "reviewing"
        );

        insertReport.run(
            vintageToys.lastInsertRowid,
            bidderThree.lastInsertRowid,
            toysCase.lastInsertRowid,
            "Misleading description",
            "Description may not accurately represent all items shown.",
            "2026-09-11 19:44:00",
            "reviewing"
        );

        insertReport.run(
            usbCharger.lastInsertRowid,
            standardUser.lastInsertRowid,
            chargerCase.lastInsertRowid,
            "Product safety concern",
            "No visible certification information was supplied.",
            "2026-09-11 16:09:00",
            "reviewing"
        );

        insertReport.run(
            replicaCollectible.lastInsertRowid,
            historyMarket.lastInsertRowid,
            replicaCase.lastInsertRowid,
            "Seller appeal",
            "Additional evidence supplied for moderator review.",
            "2026-09-10 11:21:00",
            "reviewing"
        );

        //creates notifications

        insertNotification.run(
            standardUser.lastInsertRowid,
            retroAuction.lastInsertRowid,
            null,
            "Bid Accepted",
            "Your £90.00 bid on Retro Handheld Console was accepted.",
            "bid_accepted",
            0
        );

        insertNotification.run(
            standardUser.lastInsertRowid,
            cameraAuction.lastInsertRowid,
            null,
            "You've Been Outbid",
            "A higher bid has been placed on Vintage Camera.",
            "outbid",
            0
        );

        insertNotification.run(
            standardUser.lastInsertRowid,
            keyboardAuction.lastInsertRowid,
            keyboardOrder.lastInsertRowid,
            "You Won!",
            "You won Mechanical Keyboard for £96.00.",
            "auction_won",
            0
        );

        insertNotification.run(
            standardUser.lastInsertRowid,
            figureAuction.lastInsertRowid,
            null,
            "Auction Ended",
            "Collectible Figure has ended. Another bidder won the auction.",
            "auction_lost",
            1
        );

        insertNotification.run(
            standardUser.lastInsertRowid,
            headphonesAuction.lastInsertRowid,
            headphonesOrder.lastInsertRowid,
            "Payment Received",
            "Payment for Wireless Headphones has been received.",
            "payment_received",
            1
        );

        insertNotification.run(
            standardUser.lastInsertRowid,
            headphonesAuction.lastInsertRowid,
            headphonesOrder.lastInsertRowid,
            "Item Dispatched",
            "Wireless Headphones has been dispatched.",
            "item_dispatched",
            0
        );
    });

//runs development seed

seedDatabase();

console.log(
    "BIDBASH development database populated successfully."
);

db.close();