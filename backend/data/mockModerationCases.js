//stores temporary moderation cases until sqlite is connected

const moderationCases = [
    {
        id: "ABC1235678",
        listingId: 7,
        title: "Antique Display Sword",
        category: "Collectibles",
        seller: "retrocollector",
        memberSince: "March 2025",
        sellerListings: 14,
        feedbackScore: "97% (31)",
        flagReason:
            "Potential prohibited weapon classification.",
        reportedBy: "user_482",
        reportedAt: "12 September 2026 14:32",
        riskLevel: "high",
        reportType: "prohibited",
        status: "awaiting",
        additionalNotes:
            "Automated detection identified features requiring human review."
    },
    {
        id: "ABC1235679",
        listingId: 11,
        title: "Designer Handbag",
        category: "Fashion",
        seller: "designerfinds",
        memberSince: "November 2024",
        sellerListings: 26,
        feedbackScore: "89% (47)",
        flagReason:
            "Listing reported as potentially counterfeit.",
        reportedBy: "bidder92",
        reportedAt: "12 September 2026 13:18",
        riskLevel: "medium",
        reportType: "counterfeit",
        status: "awaiting",
        additionalNotes:
            "Multiple reports reference inconsistent branding information."
    },
    {
        id: "ABC1235680",
        listingId: 15,
        title: "Vintage Toy Collection",
        category: "Collectibles",
        seller: "oldschooltoys",
        memberSince: "June 2026",
        sellerListings: 8,
        feedbackScore: "100% (12)",
        flagReason:
            "Listing description may contain misleading information.",
        reportedBy: "collector77",
        reportedAt: "11 September 2026 19:44",
        riskLevel: "low",
        reportType: "misleading",
        status: "awaiting",
        additionalNotes:
            "Review item description against the photographs supplied."
    },
    {
        id: "ABC1235681",
        listingId: 19,
        title: "Unbranded USB Charger",
        category: "Electronics",
        seller: "techwarehouse",
        memberSince: "January 2026",
        sellerListings: 32,
        feedbackScore: "94% (68)",
        flagReason:
            "Possible product safety concern.",
        reportedBy: "safeBuyer",
        reportedAt: "11 September 2026 16:09",
        riskLevel: "low",
        reportType: "unsafe",
        status: "awaiting",
        additionalNotes:
            "Safety certification information has not been supplied."
    },
    {
        id: "ABC1235682",
        listingId: 21,
        title: "Replica Collectible",
        category: "Collectibles",
        seller: "historymarket",
        memberSince: "April 2025",
        sellerListings: 17,
        feedbackScore: "96% (23)",
        flagReason:
            "Seller has appealed a previous moderation restriction.",
        reportedBy: "system",
        reportedAt: "10 September 2026 11:21",
        riskLevel: "medium",
        reportType: "restricted",
        status: "appeal",
        additionalNotes:
            "Seller supplied additional photographs and supporting information."
    }
];

module.exports = moderationCases;