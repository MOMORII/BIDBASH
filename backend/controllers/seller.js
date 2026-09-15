//loads listing services

const listingService =
    require("../services/listing");

const orderService =
    require("../services/order");

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

    const imagePath =
        req.file
            ? `/uploads/${req.file.filename}`
            : null;

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
                    : null,

            imagePath
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

//updates an active listing

function updateListing(
    req,
    res
) {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,

            message:
                "You must be signed in to edit a listing."
        });
    }

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
        return res.status(400).json({
            success: false,

            message:
                "Please complete all required listing fields."
        });
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
        return res.status(400).json({
            success: false,

            message:
                "Starting price must be greater than £0."
        });
    }

    if (
        !Number.isFinite(
            numericBidIncrement
        ) ||
        numericBidIncrement <= 0
    ) {
        return res.status(400).json({
            success: false,

            message:
                "Bid increment must be greater than £0."
        });
    }

    const imagePath =
        req.file
            ? `/uploads/${req.file.filename}`
            : null;

    const result =
        listingService.update({
            listingId:
                req.params.id,

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
                    : null,

            imagePath
        });

    if (!result.success) {
        if (
            result.status ===
            "not-found"
        ) {
            return res.status(404).json(
                result
            );
        }

        if (
            result.status ===
            "forbidden"
        ) {
            return res.status(403).json(
                result
            );
        }

        return res.status(400).json(
            result
        );
    }

    res.json(
        result
    );
}

//dispatches a paid seller order

function dispatchOrder(
    req,
    res
) {
    if (!req.session.user) {
        return res.status(401).json({
            error:
                "You must be signed in to dispatch an order."
        });
    }

    const result =
        orderService.dispatchOrder({
            orderId:
                req.params.id,

            sellerId:
                req.session.user.id,

            trackingReference:
                req.body.trackingReference
        });

    if (!result.success) {
        return res.status(400).json(
            result
        );
    }

    res.json(
        result
    );
}

//shows a listing image upload error

function showUploadError(
    req,
    res,
    message
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
                message,

            listingMessage:
                null
        }
    );
}

module.exports = {
    redirectToDashboard,
    dashboard,
    create,
    updateListing,
    dispatchOrder,
    showUploadError
};