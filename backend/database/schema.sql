PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    role TEXT NOT NULL DEFAULT 'user'
        CHECK (
            role IN (
                'user',
                'moderator'
            )
        ),

    verified INTEGER NOT NULL DEFAULT 0
        CHECK (
            verified IN (0, 1)
        ),

    account_status TEXT NOT NULL DEFAULT 'active'
        CHECK (
            account_status IN (
                'active',
                'restricted',
                'suspended',
                'closed'
            )
        ),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    session_token TEXT NOT NULL UNIQUE,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    expires_at TEXT NOT NULL,

    active INTEGER NOT NULL DEFAULT 1
        CHECK (
            active IN (0, 1)
        ),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    description TEXT
);

CREATE TABLE IF NOT EXISTS listings (
    listing_id INTEGER PRIMARY KEY AUTOINCREMENT,

    seller_id INTEGER NOT NULL,

    category_id INTEGER NOT NULL,

    title TEXT NOT NULL,

    description TEXT NOT NULL,

    condition TEXT NOT NULL,

    brand TEXT,

    starting_price NUMERIC NOT NULL
        CHECK (
            starting_price >= 0
        ),

    bid_increment NUMERIC NOT NULL DEFAULT 1
        CHECK (
            bid_increment > 0
        ),

    delivery_info TEXT,

    return_info TEXT,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (
            status IN (
                'draft',
                'active',
                'ended',
                'sold',
                'removed',
                'changes-requested'
            )
        ),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT,

    FOREIGN KEY (seller_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS listing_images (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,

    listing_id INTEGER NOT NULL,

    file_path TEXT NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 1
        CHECK (
            display_order >= 1
        ),

    FOREIGN KEY (listing_id)
        REFERENCES listings(listing_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auctions (
    auction_id INTEGER PRIMARY KEY AUTOINCREMENT,

    listing_id INTEGER NOT NULL UNIQUE,

    start_time TEXT NOT NULL,

    end_time TEXT NOT NULL,

    current_highest_bid NUMERIC,

    status TEXT NOT NULL DEFAULT 'scheduled'
        CHECK (
            status IN (
                'scheduled',
                'active',
                'ended',
                'cancelled'
            )
        ),

    CHECK (
        end_time > start_time
    ),

    FOREIGN KEY (listing_id)
        REFERENCES listings(listing_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bids (
    bid_id INTEGER PRIMARY KEY AUTOINCREMENT,

    auction_id INTEGER NOT NULL,

    bidder_id INTEGER NOT NULL,

    amount NUMERIC NOT NULL
        CHECK (
            amount > 0
        ),

    placed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'active',
                'winning',
                'outbid',
                'won',
                'lost',
                'cancelled'
            )
        ),

    FOREIGN KEY (auction_id)
        REFERENCES auctions(auction_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (bidder_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,

    auction_id INTEGER NOT NULL UNIQUE,

    buyer_id INTEGER NOT NULL,

    seller_id INTEGER NOT NULL,

    final_amount NUMERIC NOT NULL
        CHECK (
            final_amount >= 0
        ),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    payment_deadline TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'awaiting-payment'
        CHECK (
            status IN (
                'awaiting-payment',
                'paid',
                'processing',
                'completed',
                'cancelled',
                'refunded'
            )
        ),

    FOREIGN KEY (auction_id)
        REFERENCES auctions(auction_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (buyer_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (seller_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CHECK (
        buyer_id <> seller_id
    )
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,

    order_id INTEGER NOT NULL UNIQUE,

    amount NUMERIC NOT NULL
        CHECK (
            amount >= 0
        ),

    payment_date TEXT,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'paid',
                'failed',
                'refunded'
            )
        ),

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fulfilments (
    fulfilment_id INTEGER PRIMARY KEY AUTOINCREMENT,

    order_id INTEGER NOT NULL UNIQUE,

    shipping_address TEXT,

    tracking_reference TEXT,

    dispatched_at TEXT,

    completed_at TEXT,

    status TEXT NOT NULL DEFAULT 'awaiting-payment'
        CHECK (
            status IN (
                'awaiting-payment',
                'awaiting-dispatch',
                'dispatched',
                'delivered',
                'cancelled'
            )
        ),

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS moderation_cases (
    case_id INTEGER PRIMARY KEY AUTOINCREMENT,

    listing_id INTEGER NOT NULL,

    moderator_id INTEGER,

    flag_reason TEXT NOT NULL,

    report_type TEXT NOT NULL,

    risk_level TEXT NOT NULL
        CHECK (
            risk_level IN (
                'low',
                'medium',
                'high'
            )
        ),

    evidence TEXT,

    additional_notes TEXT,

    status TEXT NOT NULL DEFAULT 'awaiting'
        CHECK (
            status IN (
                'awaiting',
                'appeal',
                'approved',
                'changes-requested',
                'removed'
            )
        ),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    reviewed_at TEXT,

    decision_notes TEXT,

    FOREIGN KEY (listing_id)
        REFERENCES listings(listing_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (moderator_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,

    listing_id INTEGER NOT NULL,

    reporter_id INTEGER NOT NULL,

    moderation_case_id INTEGER,

    reason TEXT NOT NULL,

    description TEXT,

    submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status TEXT NOT NULL DEFAULT 'submitted'
        CHECK (
            status IN (
                'submitted',
                'reviewing',
                'resolved',
                'dismissed'
            )
        ),

    FOREIGN KEY (listing_id)
        REFERENCES listings(listing_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (reporter_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (moderation_case_id)
        REFERENCES moderation_cases(case_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    auction_id INTEGER,

    order_id INTEGER,

    title TEXT NOT NULL,

    message TEXT NOT NULL,

    notification_type TEXT NOT NULL
        CHECK (
            notification_type IN (
                'bid_accepted',
                'outbid',
                'auction_won',
                'auction_lost',
                'payment_required',
                'payment_received',
                'item_dispatched',
                'general'
            )
        ),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    is_read INTEGER NOT NULL DEFAULT 0
        CHECK (
            is_read IN (0, 1)
        ),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (auction_id)
        REFERENCES auctions(auction_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_listings_seller
    ON listings(seller_id);

CREATE INDEX IF NOT EXISTS idx_listings_category
    ON listings(category_id);

CREATE INDEX IF NOT EXISTS idx_listings_status
    ON listings(status);

CREATE INDEX IF NOT EXISTS idx_bids_auction
    ON bids(auction_id);

CREATE INDEX IF NOT EXISTS idx_bids_bidder
    ON bids(bidder_id);

CREATE INDEX IF NOT EXISTS idx_bids_placed_at
    ON bids(placed_at);

CREATE INDEX IF NOT EXISTS idx_reports_listing
    ON reports(listing_id);

CREATE INDEX IF NOT EXISTS idx_reports_case
    ON reports(moderation_case_id);

CREATE INDEX IF NOT EXISTS idx_moderation_listing
    ON moderation_cases(listing_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON notifications(
        user_id,
        is_read
    );