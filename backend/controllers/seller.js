//loads listing services

const listingService =
    require("../services/listing");

//redirects the seller shortcut

function redirectToDashboard(
    req,
    res
) {
    res.redirect(
        `/users/${req.session.user.id}/listings`
    );
}

//renders the user's listings dashboard

function dashboard(
    req,
    res
) {
    const groupedListings =
        listingService
            .groupSellerListings(
                req.params.id
            );

    res.render("listings", {
        pageTitle:
            "My Listings - BIDBASH",

        listings:
            groupedListings,

        openCreateListing:
            false,

        listingError:
            null,

        listingMessage:
            null
    });
}

//creates a new listing

function create(
    req,
    res
) {
    const {
        title,
        category,
        condition,
        description,
        brand,
        startingPrice,
        bidIncrement,
        deliveryInfo,
        returnInfo
    } = req.body;

    if (
        !title ||
        !category ||
        !condition ||
        !description ||
        !startingPrice ||
        !bidIncrement
    ) {
        const groupedListings =
            listingService
                .groupSellerListings(
                    req.session.user.id
                );

        return res.status(400).render(
            "listings",
            {
                pageTitle:
                    "My Listings - BIDBASH",

                listings:
                    groupedListings,

                openCreateListing:
                    true,

                listingError:
                    "Please complete all required listing fields.",

                listingMessage:
                    null
            }
        );
    }

    const numericStartingPrice =
        Number(
            startingPrice
        );

    const numericBidIncrement =
        Number(
            bidIncrement
        );

    if (
        !Number.isFinite(
            numericStartingPrice
        ) ||
        numericStartingPrice <= 0
    ) {
        const groupedListings =
            listingService
                .groupSellerListings(
                    req.session.user.id
                );

        return res.status(400).render(
            "listings",
            {
                pageTitle:
                    "My Listings - BIDBASH",

                listings:
                    groupedListings,

                openCreateListing:
                    true,

                listingError:
                    "Starting price must be greater than £0.",

                listingMessage:
                    null
            }
        );
    }

    if (
        !Number.isFinite(
            numericBidIncrement
        ) ||
        numericBidIncrement <= 0
    ) {
        const groupedListings =
            listingService
                .groupSellerListings(
                    req.session.user.id
                );

        return res.status(400).render(
            "listings",
            {
                pageTitle:
                    "My Listings - BIDBASH",

                listings:
                    groupedListings,

                openCreateListing:
                    true,

                listingError:
                    "Bid increment must be greater than £0.",

                listingMessage:
                    null
            }
        );
    }

    const result =
        listingService.create({
            sellerId:
                req.session.user.id,

            title:
                title.trim(),

            category,

            condition,

            description:
                description.trim(),

            brand:
                brand
                    ? brand.trim()
                    : null,

            startingPrice:
                numericStartingPrice,

            bidIncrement:
                numericBidIncrement,

            deliveryInfo:
                deliveryInfo
                    ? deliveryInfo.trim()
                    : null,

            returnInfo:
                returnInfo
                    ? returnInfo.trim()
                    : null
        });

    if (!result.success) {
        const groupedListings =
            listingService
                .groupSellerListings(
                    req.session.user.id
                );

        return res.status(400).render(
            "listings",
            {
                pageTitle:
                    "My Listings - BIDBASH",

                listings:
                    groupedListings,

                openCreateListing:
                    true,

                listingError:
                    result.message,

                listingMessage:
                    null
            }
        );
    }

    const groupedListings =
        listingService
            .groupSellerListings(
                req.session.user.id
            );

    res.render("listings", {
        pageTitle:
            "My Listings - BIDBASH",

        listings:
            groupedListings,

        openCreateListing:
            false,

        listingError:
            null,

        listingMessage:
            "Your listing has been created successfully."
    });
}

module.exports = {
    redirectToDashboard,
    dashboard,
    create
};