//confirms that browser-side javascript has loaded

console.log(
    "BIDBASH frontend JavaScript loaded"
);

//finds the dashboard tabs and content panels

const dashboardTabs =
    document.querySelectorAll(
        ".dashboard-tab"
    );

const dashboardPanels =
    document.querySelectorAll(
        ".dashboard-panel"
    );

//switches between dashboard sections

if (
    dashboardTabs.length &&
    dashboardPanels.length
) {
    dashboardTabs.forEach(
        tab => {
            tab.addEventListener(
                "click",
                () => {
                    const targetId =
                        tab.dataset
                            .dashboardTarget;

                    //removes active tab states

                    dashboardTabs.forEach(
                        item => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    //hides dashboard panels

                    dashboardPanels.forEach(
                        panel => {
                            panel.hidden =
                                true;
                        }
                    );

                    //shows the selected panel

                    const selectedPanel =
                        document.getElementById(
                            targetId
                        );

                    if (
                        selectedPanel
                    ) {
                        selectedPanel.hidden =
                            false;

                        tab.classList.add(
                            "active"
                        );
                    }
                }
            );
        }
    );
}

//finds the global sidebar controls

const sidebarToggle =
    document.getElementById(
        "sidebar-toggle"
    );

const sidebarClose =
    document.getElementById(
        "sidebar-close"
    );

const sidebarDrawer =
    document.getElementById(
        "sidebar-drawer"
    );

const sidebarOverlay =
    document.getElementById(
        "sidebar-overlay"
    );

//opens the global sidebar

function openSidebar() {
    if (
        !sidebarDrawer ||
        !sidebarOverlay ||
        !sidebarToggle
    ) {
        return;
    }

    sidebarDrawer.classList.add(
        "open"
    );

    sidebarOverlay.hidden =
        false;

    document.body.classList.add(
        "sidebar-open"
    );

    sidebarDrawer.setAttribute(
        "aria-hidden",
        "false"
    );

    sidebarToggle.setAttribute(
        "aria-expanded",
        "true"
    );
}

//closes the global sidebar

function closeSidebar() {
    if (
        !sidebarDrawer ||
        !sidebarOverlay ||
        !sidebarToggle
    ) {
        return;
    }

    sidebarDrawer.classList.remove(
        "open"
    );

    sidebarOverlay.hidden =
        true;

    document.body.classList.remove(
        "sidebar-open"
    );

    sidebarDrawer.setAttribute(
        "aria-hidden",
        "true"
    );

    sidebarToggle.setAttribute(
        "aria-expanded",
        "false"
    );
}

//toggles the global sidebar

if (sidebarToggle) {
    sidebarToggle.addEventListener(
        "click",
        () => {
            if (
                sidebarDrawer
                    .classList
                    .contains(
                        "open"
                    )
            ) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    );
}

//closes the sidebar using its close button

if (sidebarClose) {
    sidebarClose.addEventListener(
        "click",
        closeSidebar
    );
}

//closes the sidebar using its background

if (sidebarOverlay) {
    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );
}

//finds the browse sorting control

const browseSort =
    document.getElementById(
        "browse-sort"
    );

//reloads browse results using sorting

if (browseSort) {
    browseSort.addEventListener(
        "change",
        () => {
            const currentUrl =
                new URL(
                    window.location.href
                );

            if (
                browseSort.value ===
                "default"
            ) {
                currentUrl
                    .searchParams
                    .delete(
                        "sort"
                    );
            } else {
                currentUrl
                    .searchParams
                    .set(
                        "sort",
                        browseSort.value
                    );
            }

            window.location.href =
                currentUrl.toString();
        }
    );
}

//finds the browse category filter

const categoryFilter =
    document.getElementById(
        "category-filter"
    );

//reloads browse results using category

if (categoryFilter) {
    categoryFilter.addEventListener(
        "change",
        () => {
            const currentUrl =
                new URL(
                    window.location.href
                );

            currentUrl
                .searchParams
                .set(
                    "category",
                    categoryFilter.value
                );

            window.location.href =
                currentUrl.toString();
        }
    );
}

//finds homepage carousel navigation

const carouselButtons =
    document.querySelectorAll(
        ".carousel-button"
    );

//scrolls the selected carousel

carouselButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                const carouselId =
                    button.dataset
                        .carousel;

                const direction =
                    button.dataset
                        .direction;

                const carousel =
                    document.getElementById(
                        carouselId
                    );

                if (!carousel) {
                    return;
                }

                const scrollDistance =
                    Math.max(
                        carousel.clientWidth *
                            0.75,
                        280
                    );

                carousel.scrollBy({
                    left:
                        direction ===
                        "left"
                            ? -scrollDistance
                            : scrollDistance,

                    behavior:
                        "smooth"
                });
            }
        );
    }
);

//finds the browse search input

const browseSearch =
    document.getElementById(
        "browse-search"
    );

//runs browse search using enter

if (browseSearch) {
    browseSearch.addEventListener(
        "keydown",
        event => {
            if (
                event.key !==
                "Enter"
            ) {
                return;
            }

            const currentUrl =
                new URL(
                    window.location.href
                );

            const searchValue =
                browseSearch
                    .value
                    .trim();

            if (!searchValue) {
                currentUrl
                    .searchParams
                    .delete(
                        "search"
                    );
            } else {
                currentUrl
                    .searchParams
                    .set(
                        "search",
                        searchValue
                    );
            }

            window.location.href =
                currentUrl.toString();
        }
    );
}

//finds create listing controls

const createListingButton =
    document.getElementById(
        "create-listing-button"
    );

const createListingModal =
    document.getElementById(
        "create-listing-modal"
    );

const createListingClose =
    document.getElementById(
        "create-listing-close"
    );

const createListingCancel =
    document.getElementById(
        "create-listing-cancel"
    );

//opens the create listing overlay

if (
    createListingButton &&
    createListingModal
) {
    createListingButton
        .addEventListener(
            "click",
            () => {
                createListingModal.hidden =
                    false;
            }
        );
}

//closes the create listing overlay

function closeCreateListing() {
    if (
        createListingModal
    ) {
        createListingModal.hidden =
            true;
    }
}

//closes the listing overlay using close

if (createListingClose) {
    createListingClose
        .addEventListener(
            "click",
            closeCreateListing
        );
}

//closes the listing overlay using cancel

if (createListingCancel) {
    createListingCancel
        .addEventListener(
            "click",
            closeCreateListing
        );
}

//closes the listing overlay using background

if (createListingModal) {
    createListingModal
        .addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    createListingModal
                ) {
                    closeCreateListing();
                }
            }
        );
}

//finds the colour theme controls

const darkModeToggle =
    document.getElementById(
        "dark-mode-toggle"
    );

const siteLogo =
    document.getElementById(
        "site-logo"
    );

const homeHeaderImage =
    document.getElementById(
        "home-header-image"
    );

const homeHeroImage =
    document.getElementById(
        "home-hero-image"
    );

//updates theme images

function updateThemeImages() {
    const darkModeEnabled =
        document.body
            .classList
            .contains(
                "dark-mode"
            );

    if (siteLogo) {
        siteLogo.src =
            darkModeEnabled
                ? "/images/dark-bidbash_logo.png"
                : "/images/bidbash_logo.png";
    }

    if (homeHeaderImage) {
        homeHeaderImage.src =
            darkModeEnabled
                ? "/images/dark-header-img.png"
                : "/images/header-img.png";
    }

    if (homeHeroImage) {
        homeHeroImage.src =
            darkModeEnabled
                ? "/images/dark-hero-img.png"
                : "/images/hero-img.png";
    }
}

//loads the saved colour theme

const savedTheme =
    localStorage.getItem(
        "bidbash-theme"
    );

if (
    savedTheme ===
    "dark"
) {
    document.body.classList.add(
        "dark-mode"
    );
}

//updates the colour theme toggle

function updateThemeToggle() {
    if (!darkModeToggle) {
        return;
    }

    const darkModeEnabled =
        document.body
            .classList
            .contains(
                "dark-mode"
            );

    darkModeToggle.textContent =
        darkModeEnabled
            ? "Light Mode"
            : "Dark Mode";

    darkModeToggle.setAttribute(
        "aria-label",
        darkModeEnabled
            ? "Switch to light mode"
            : "Switch to dark mode"
    );
}

//sets the initial colour theme

updateThemeToggle();
updateThemeImages();

//switches between colour themes

if (darkModeToggle) {
    darkModeToggle.addEventListener(
        "click",
        () => {
            document.body
                .classList
                .toggle(
                    "dark-mode"
                );

            const darkModeEnabled =
                document.body
                    .classList
                    .contains(
                        "dark-mode"
                    );

            localStorage.setItem(
                "bidbash-theme",
                darkModeEnabled
                    ? "dark"
                    : "light"
            );

            updateThemeToggle();
            updateThemeImages();
        }
    );
}

//finds buyer payment controls

const payOrderButtons =
    document.querySelectorAll(
        ".pay-order-button"
    );

//pays a won auction order

async function payOrder(
    button
) {
    const orderId =
        Number(
            button.dataset
                .orderId
        );

    if (
        !Number.isFinite(
            orderId
        )
    ) {
        return;
    }

    button.disabled =
        true;

    button.textContent =
        "Processing...";

    try {
        const response =
            await fetch(
                `/api/orders/${orderId}/pay`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            alert(
                result.message ||
                result.error ||
                "The payment could not be completed."
            );

            button.disabled =
                false;

            button.textContent =
                "Pay Now";

            return;
        }

        button.textContent =
            "Payment Complete";

        setTimeout(
            () => {
                window.location.reload();
            },
            800
        );
    } catch (error) {
        alert(
            "BIDBASH could not process the payment. Please try again."
        );

        button.disabled =
            false;

        button.textContent =
            "Pay Now";
    }
}

//handles buyer payment clicks

payOrderButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                payOrder(
                    button
                );
            }
        );
    }
);

//finds buyer delivery controls

const completeOrderButtons =
    document.querySelectorAll(
        ".complete-order-button"
    );

//confirms delivery of a dispatched order

async function completeOrder(
    button
) {
    const orderId =
        Number(
            button.dataset
                .orderId
        );

    if (
        !Number.isFinite(
            orderId
        )
    ) {
        return;
    }

    const confirmed =
        window.confirm(
            "Confirm that you have received this item?"
        );

    if (!confirmed) {
        return;
    }

    button.disabled =
        true;

    button.textContent =
        "Completing...";

    try {
        const response =
            await fetch(
                `/api/orders/${orderId}/complete`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            alert(
                result.message ||
                result.error ||
                "Delivery could not be confirmed."
            );

            button.disabled =
                false;

            button.textContent =
                "Confirm Delivery";

            return;
        }

        button.textContent =
            "Completed";

        setTimeout(
            () => {
                window.location.reload();
            },
            800
        );
    } catch (error) {
        alert(
            "BIDBASH could not confirm delivery. Please try again."
        );

        button.disabled =
            false;

        button.textContent =
            "Confirm Delivery";
    }
}

//handles buyer delivery confirmation

completeOrderButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                completeOrder(
                    button
                );
            }
        );
    }
);

//finds seller dispatch controls

const dispatchOrderButtons =
    document.querySelectorAll(
        ".dispatch-order-button"
    );

//dispatches a paid seller order

async function dispatchOrder(
    button
) {
    const orderId =
        Number(
            button.dataset
                .orderId
        );

    if (
        !Number.isFinite(
            orderId
        )
    ) {
        return;
    }

    const trackingInput =
        document.querySelector(
            `.dispatch-tracking-input[data-order-id="${orderId}"]`
        );

    const trackingReference =
        trackingInput
            ? trackingInput
                .value
                .trim()
            : "";

    button.disabled =
        true;

    button.textContent =
        "Updating...";

    try {
        const response =
            await fetch(
                `/api/orders/${orderId}/dispatch`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            trackingReference
                        })
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            alert(
                result.message ||
                result.error ||
                "The order could not be marked as dispatched."
            );

            button.disabled =
                false;

            button.textContent =
                "Mark as Dispatched";

            return;
        }

        button.textContent =
            "Dispatched";

        setTimeout(
            () => {
                window.location.reload();
            },
            800
        );
    } catch (error) {
        alert(
            "BIDBASH could not update the order. Please try again."
        );

        button.disabled =
            false;

        button.textContent =
            "Mark as Dispatched";
    }
}

//handles seller dispatch clicks

dispatchOrderButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                dispatchOrder(
                    button
                );
            }
        );
    }
);

//finds the bidding controls

const placeBidButton =
    document.getElementById(
        "place-bid-button"
    );

const bidAmountInput =
    document.getElementById(
        "bid-amount"
    );

const bidModal =
    document.getElementById(
        "bid-confirmation-modal"
    );

const bidModalCard =
    document.getElementById(
        "bid-modal-card"
    );

const bidModalTitle =
    document.getElementById(
        "bid-modal-title"
    );

const bidModalMessage =
    document.getElementById(
        "bid-modal-message"
    );

const bidConfirmationSummary =
    document.getElementById(
        "bid-confirmation-summary"
    );

const bidConfirmationNote =
    document.getElementById(
        "bid-confirmation-note"
    );

const bidConfirmationActions =
    document.getElementById(
        "bid-confirmation-actions"
    );

const confirmationBidAmount =
    document.getElementById(
        "confirmation-bid-amount"
    );

const confirmationCurrentBid =
    document.getElementById(
        "confirmation-current-bid"
    );

const confirmationMinimumBid =
    document.getElementById(
        "confirmation-minimum-bid"
    );

const confirmBidButton =
    document.getElementById(
        "confirm-bid-button"
    );

const cancelBidButton =
    document.getElementById(
        "cancel-bid-button"
    );

const bidModalClose =
    document.getElementById(
        "bid-confirmation-close"
    );

const bidResultContent =
    document.getElementById(
        "bid-result-content"
    );

const bidResultDetail =
    document.getElementById(
        "bid-result-detail"
    );

const bidResultHighlight =
    document.getElementById(
        "bid-result-highlight"
    );

const bidResultActions =
    document.getElementById(
        "bid-result-actions"
    );

const bidResultClose =
    document.getElementById(
        "bid-result-close"
    );

const auctionCurrentBid =
    document.getElementById(
        "auction-current-bid"
    );

const auctionMinimumBid =
    document.getElementById(
        "auction-minimum-bid"
    );

const bidHelp =
    document.getElementById(
        "bid-help"
    );

//tracks the pending bid

let pendingBidAmount =
    null;

let expectedCurrentBid =
    null;

//reads a displayed currency amount

function readCurrencyValue(
    element
) {
    if (!element) {
        return null;
    }

    const value =
        Number(
            element
                .textContent
                .replace(
                    "£",
                    ""
                )
                .replace(
                    /,/g,
                    ""
                )
                .trim()
        );

    if (
        !Number.isFinite(
            value
        )
    ) {
        return null;
    }

    return value;
}

//opens the bid modal

function openBidModal() {
    if (!bidModal) {
        return;
    }

    bidModal.hidden =
        false;
}

//closes the bid modal

function closeBidModal() {
    if (!bidModal) {
        return;
    }

    bidModal.hidden =
        true;

    resetBidModal();
}

//clears bid result styles

function clearBidResultClasses() {
    if (!bidModalCard) {
        return;
    }

    bidModalCard.classList.remove(
        "bid-accepted",
        "bid-rejected",
        "bid-outbid"
    );
}

//resets the bid modal

function resetBidModal() {
    clearBidResultClasses();

    if (bidModalTitle) {
        bidModalTitle.textContent =
            "Confirm Your Bid";
    }

    if (bidModalMessage) {
        bidModalMessage.textContent =
            "Review your bid before submitting it.";
    }

    if (
        bidConfirmationSummary
    ) {
        bidConfirmationSummary.hidden =
            false;
    }

    if (
        bidConfirmationNote
    ) {
        bidConfirmationNote.hidden =
            false;

        bidConfirmationNote.textContent =
            "All bids are binding. By confirming, you agree to BIDBASH's Terms & Conditions.";
    }

    if (
        bidConfirmationActions
    ) {
        bidConfirmationActions.hidden =
            false;
    }

    if (
        bidResultContent
    ) {
        bidResultContent.hidden =
            true;
    }

    if (
        bidResultHighlight
    ) {
        bidResultHighlight.hidden =
            true;

        bidResultHighlight.textContent =
            "";
    }

    if (
        bidResultActions
    ) {
        bidResultActions.hidden =
            true;
    }

    if (confirmBidButton) {
        confirmBidButton.disabled =
            false;

        confirmBidButton.textContent =
            "Confirm Bid";
    }
}

//prepares the bid result view

function prepareBidResult() {
    if (
        bidConfirmationSummary
    ) {
        bidConfirmationSummary.hidden =
            true;
    }

    if (
        bidConfirmationNote
    ) {
        bidConfirmationNote.hidden =
            true;
    }

    if (
        bidConfirmationActions
    ) {
        bidConfirmationActions.hidden =
            true;
    }

    if (
        bidResultContent
    ) {
        bidResultContent.hidden =
            false;
    }

    if (
        bidResultActions
    ) {
        bidResultActions.hidden =
            false;
    }
}

//shows accepted bid feedback

function showBidAccepted(
    amount
) {
    clearBidResultClasses();

    if (bidModalCard) {
        bidModalCard.classList.add(
            "bid-accepted"
        );
    }

    prepareBidResult();

    if (bidModalTitle) {
        bidModalTitle.textContent =
            "BID ACCEPTED";
    }

    if (bidModalMessage) {
        bidModalMessage.textContent =
            "You are now the highest bidder!";
    }

    if (bidResultDetail) {
        bidResultDetail.textContent =
            `Your bid of £${Number(
                amount
            ).toFixed(2)} has been accepted.`;
    }

    if (
        bidResultHighlight
    ) {
        bidResultHighlight.hidden =
            true;
    }
}

//shows rejected bid feedback

function showBidRejected(
    message
) {
    clearBidResultClasses();

    if (bidModalCard) {
        bidModalCard.classList.add(
            "bid-rejected"
        );
    }

    prepareBidResult();

    if (bidModalTitle) {
        bidModalTitle.textContent =
            "BID REJECTED";
    }

    if (bidModalMessage) {
        bidModalMessage.textContent =
            "We're sorry, we cannot accept your bid.";
    }

    if (bidResultDetail) {
        bidResultDetail.textContent =
            "REASON:";
    }

    if (
        bidResultHighlight
    ) {
        bidResultHighlight.textContent =
            message ||
            "The bid could not be accepted.";

        bidResultHighlight.hidden =
            false;
    }
}

//shows outbid feedback

function showBidOutbid(
    currentBid,
    minimumBid
) {
    clearBidResultClasses();

    if (bidModalCard) {
        bidModalCard.classList.add(
            "bid-outbid"
        );
    }

    prepareBidResult();

    if (bidModalTitle) {
        bidModalTitle.textContent =
            "OUTBID";
    }

    if (bidModalMessage) {
        bidModalMessage.textContent =
            "Another bidder has placed a higher bid while you were confirming.";
    }

    if (bidResultDetail) {
        bidResultDetail.textContent =
            "New highest bid:";
    }

    if (
        bidResultHighlight
    ) {
        bidResultHighlight.textContent =
            `£${Number(
                currentBid
            ).toFixed(2)}`;

        bidResultHighlight.hidden =
            false;
    }

    updateAuctionValues(
        currentBid,
        minimumBid
    );
}

//updates displayed auction values

function updateAuctionValues(
    currentBid,
    minimumBid
) {
    if (
        Number.isFinite(
            Number(
                currentBid
            )
        ) &&
        auctionCurrentBid
    ) {
        auctionCurrentBid.textContent =
            `£${Number(
                currentBid
            ).toFixed(2)}`;
    }

    if (
        Number.isFinite(
            Number(
                minimumBid
            )
        ) &&
        auctionMinimumBid
    ) {
        auctionMinimumBid.textContent =
            `£${Number(
                minimumBid
            ).toFixed(2)}`;
    }

    if (
        Number.isFinite(
            Number(
                currentBid
            )
        ) &&
        confirmationCurrentBid
    ) {
        confirmationCurrentBid
            .textContent =
            `£${Number(
                currentBid
            ).toFixed(2)}`;
    }

    if (
        Number.isFinite(
            Number(
                minimumBid
            )
        ) &&
        confirmationMinimumBid
    ) {
        confirmationMinimumBid
            .textContent =
            `£${Number(
                minimumBid
            ).toFixed(2)}`;
    }

    if (
        Number.isFinite(
            Number(
                minimumBid
            )
        ) &&
        bidAmountInput
    ) {
        bidAmountInput.min =
            Number(
                minimumBid
            );
    }

    if (
        Number.isFinite(
            Number(
                minimumBid
            )
        ) &&
        bidHelp
    ) {
        bidHelp.textContent =
            `Type an amount or use the arrows. Minimum valid bid: £${Number(
                minimumBid
            ).toFixed(2)}`;
    }
}

//prepares bid confirmation

function prepareBidConfirmation() {
    if (!bidAmountInput) {
        return;
    }

    const amount =
        Number(
            bidAmountInput.value
        );

    if (
        !Number.isFinite(
            amount
        ) ||
        amount <= 0
    ) {
        pendingBidAmount =
            bidAmountInput.value;

        openBidModal();

        showBidRejected(
            "Enter a valid bid amount."
        );

        return;
    }

    pendingBidAmount =
        amount;

    expectedCurrentBid =
        readCurrencyValue(
            auctionCurrentBid
        );

    resetBidModal();

    if (
        confirmationBidAmount
    ) {
        confirmationBidAmount
            .textContent =
            `£${amount.toFixed(2)}`;
    }

    openBidModal();
}

//submits the confirmed bid

async function submitBid() {
    if (!confirmBidButton) {
        return;
    }

    const auctionId =
        Number(
            confirmBidButton
                .dataset
                .auctionId
        );

    confirmBidButton.disabled =
        true;

    confirmBidButton.textContent =
        "Submitting...";

    try {
        const response =
            await fetch(
                "/api/bids",
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            auctionId,

                            amount:
                                pendingBidAmount,

                            expectedCurrentBid
                        })
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            if (
                result.status ===
                    "outbid" &&
                Number.isFinite(
                    Number(
                        result.currentBid
                    )
                )
            ) {
                showBidOutbid(
                    result.currentBid,
                    result.minimumBid
                );

                return;
            }

            showBidRejected(
                result.message ||
                result.error ||
                "The bid could not be accepted."
            );

            return;
        }

        updateAuctionValues(
            result.auction
                .currentBid,
            result.auction
                .minimumBid
        );

        showBidAccepted(
            result.bid.amount
        );

        if (
            bidAmountInput
        ) {
            bidAmountInput.value =
                "";
        }

        //refreshes the page after a successful bid

        setTimeout(
            () => {
                window.location.reload();
            },
            1500
        );
    } catch (error) {
        showBidRejected(
            "BIDBASH could not process the bid. Please try again."
        );
    } finally {
        confirmBidButton.disabled =
            false;

        confirmBidButton.textContent =
            "Confirm Bid";
    }
}

//handles place bid clicks

if (
    placeBidButton &&
    bidAmountInput
) {
    placeBidButton.addEventListener(
        "click",
        prepareBidConfirmation
    );
}

//handles bid confirmation

if (confirmBidButton) {
    confirmBidButton.addEventListener(
        "click",
        submitBid
    );
}

//handles bid cancellation

if (cancelBidButton) {
    cancelBidButton.addEventListener(
        "click",
        closeBidModal
    );
}

//handles bid modal closing

if (bidModalClose) {
    bidModalClose.addEventListener(
        "click",
        closeBidModal
    );
}

//handles bid result continuation

if (bidResultClose) {
    bidResultClose.addEventListener(
        "click",
        closeBidModal
    );
}

//handles bid modal background clicks

if (bidModal) {
    bidModal.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                bidModal
            ) {
                closeBidModal();
            }
        }
    );
}

//handles escape key closing

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key ===
                "Escape" &&
            bidModal &&
            !bidModal.hidden
        ) {
            closeBidModal();
        }
    }
);