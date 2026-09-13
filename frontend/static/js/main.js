//confirms that browser-side javascript has loaded
console.log("BIDBASH frontend JavaScript loaded");

//finds the bidding controls on the auction page

const placeBidButton =
    document.getElementById(
        "place-bid-button"
    );

const bidAmountInput =
    document.getElementById(
        "bid-amount"
    );

const confirmationModal =
    document.getElementById(
        "bid-confirmation-modal"
    );

const confirmationBidAmount =
    document.getElementById(
        "confirmation-bid-amount"
    );

const confirmBidButton =
    document.getElementById(
        "confirm-bid-button"
    );

const cancelBidButton =
    document.getElementById(
        "cancel-bid-button"
    );

const closeBidButton =
    document.getElementById(
        "bid-confirmation-close"
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

const bidResultActions =
    document.getElementById(
        "bid-result-actions"
    );

const bidResultClose =
    document.getElementById(
        "bid-result-close"
    );

//closes the bid confirmation overlay

function closeBidConfirmation() {
    if (confirmationModal) {
        confirmationModal.hidden =
            true;
    }
}

//resets the bid confirmation overlay

function resetBidConfirmation() {
    if (bidModalTitle) {
        bidModalTitle.textContent =
            "Confirm Your Bid";
    }

    if (bidModalMessage) {
        bidModalMessage.textContent =
            "Review your bid before submitting it.";
    }

    if (bidConfirmationSummary) {
        bidConfirmationSummary.hidden =
            false;
    }

    if (bidConfirmationNote) {
        bidConfirmationNote.hidden =
            false;
    }

    if (bidConfirmationActions) {
        bidConfirmationActions.hidden =
            false;
    }

    if (bidResultActions) {
        bidResultActions.hidden =
            true;
    }
}

//shows bid result feedback

function showBidResult({
    success,
    message
}) {
    if (!confirmationModal) {
        return;
    }

    if (bidModalTitle) {
        bidModalTitle.textContent =
            success
                ? "Bid Accepted"
                : "Bid Could Not Be Placed";
    }

    if (bidModalMessage) {
        bidModalMessage.textContent =
            message;
    }

    if (bidConfirmationSummary) {
        bidConfirmationSummary.hidden =
            true;
    }

    if (bidConfirmationNote) {
        bidConfirmationNote.hidden =
            true;
    }

    if (bidConfirmationActions) {
        bidConfirmationActions.hidden =
            true;
    }

    if (bidResultActions) {
        bidResultActions.hidden =
            false;
    }
}

//runs bidding controls only when available

if (
    placeBidButton &&
    bidAmountInput &&
    confirmationModal &&
    confirmationBidAmount &&
    confirmBidButton
) {
    placeBidButton.addEventListener(
        "click",
        () => {
            const bidAmount =
                Number(
                    bidAmountInput.value
                );

            if (
                !Number.isFinite(
                    bidAmount
                ) ||
                bidAmount <= 0
            ) {
                showBidResult({
                    success: false,
                    message:
                        "Please enter a valid bid amount."
                });

                confirmationModal.hidden =
                    false;

                return;
            }

            resetBidConfirmation();

            confirmationBidAmount
                .textContent =
                `£${bidAmount.toFixed(2)}`;

            confirmationModal.hidden =
                false;
        }
    );

    confirmBidButton
        .addEventListener(
            "click",
            async () => {
                const auctionId =
                    confirmBidButton
                        .dataset
                        .auctionId;

                const response =
                    await fetch(
                        "/api/bids",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify({
                                    auctionId,
                                    amount:
                                        bidAmountInput.value
                                })
                        }
                    );

                const data =
                    await response.json();

                showBidResult({
                    success:
                        response.ok,
                    message:
                        data.message ||
                        data.error ||
                        "The bid could not be processed."
                });
            }
        );
}

//closes using cancel

if (cancelBidButton) {
    cancelBidButton
        .addEventListener(
            "click",
            closeBidConfirmation
        );
}

//closes using the close icon

if (closeBidButton) {
    closeBidButton
        .addEventListener(
            "click",
            closeBidConfirmation
        );
}

//closes the result state

if (bidResultClose) {
    bidResultClose
        .addEventListener(
            "click",
            closeBidConfirmation
        );
}

//closes using the modal background

if (confirmationModal) {
    confirmationModal
        .addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    confirmationModal
                ) {
                    closeBidConfirmation();
                }
            }
        );
}

//finds the dashboard tabs and content panels
const dashboardTabs =
    document.querySelectorAll(".dashboard-tab");

const dashboardPanels =
    document.querySelectorAll(".dashboard-panel");

//switches between dashboard sections
if (dashboardTabs.length && dashboardPanels.length) {
    dashboardTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId =
                tab.dataset.dashboardTarget;

            //removes the active state from all tabs
            dashboardTabs.forEach(item => {
                item.classList.remove("active");
            });

            //hides all dashboard panels
            dashboardPanels.forEach(panel => {
                panel.hidden = true;
            });

            //shows the selected dashboard panel
            const selectedPanel =
                document.getElementById(targetId);

            if (selectedPanel) {
                selectedPanel.hidden = false;
                tab.classList.add("active");
            }
        });
    });
}

//finds the global sidebar controls
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarDrawer = document.getElementById("sidebar-drawer");
const sidebarOverlay = document.getElementById("sidebar-overlay");

//opens the global sidebar
function openSidebar() {
    if (!sidebarDrawer || !sidebarOverlay || !sidebarToggle) {
        return;
    }

    sidebarDrawer.classList.add("open");
    sidebarOverlay.hidden = false;

    document.body.classList.add("sidebar-open");

    sidebarDrawer.setAttribute("aria-hidden", "false");
    sidebarToggle.setAttribute("aria-expanded", "true");
}

//closes the global sidebar
function closeSidebar() {
    if (!sidebarDrawer || !sidebarOverlay || !sidebarToggle) {
        return;
    }

    sidebarDrawer.classList.remove("open");
    sidebarOverlay.hidden = true;

    document.body.classList.remove("sidebar-open");

    sidebarDrawer.setAttribute("aria-hidden", "true");
    sidebarToggle.setAttribute("aria-expanded", "false");
}

//toggles the global sidebar
if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
        if (sidebarDrawer.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

//closes the sidebar using its close button
if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
}

//closes the sidebar when the background is selected
if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
}

//finds the browse sorting control
const browseSort = document.getElementById("browse-sort");

//reloads browse results using the selected sort option
if (browseSort) {
    browseSort.addEventListener("change", () => {
        const currentUrl = new URL(window.location.href);

        //removes sorting when the default option is selected
        if (browseSort.value === "default") {
            currentUrl.searchParams.delete("sort");
        } else {
            currentUrl.searchParams.set(
                "sort",
                browseSort.value
            );
        }

        window.location.href = currentUrl.toString();
    });
}

//finds the browse category filter
const categoryFilter =
    document.getElementById("category-filter");

//reloads browse results using the selected category
if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
        const currentUrl = new URL(window.location.href);

        currentUrl.searchParams.set(
            "category",
            categoryFilter.value
        );

        window.location.href = currentUrl.toString();
    });
}

//finds the homepage carousel navigation buttons
const carouselButtons =
    document.querySelectorAll(".carousel-button");

//scrolls the selected auction carousel left or right
carouselButtons.forEach(button => {
    button.addEventListener("click", () => {
        const carouselId = button.dataset.carousel;
        const direction = button.dataset.direction;

        const carousel =
            document.getElementById(carouselId);

        if (!carousel) {
            return;
        }

        const scrollDistance =
            Math.max(carousel.clientWidth * 0.75, 280);

        carousel.scrollBy({
            left:
                direction === "left"
                    ? -scrollDistance
                    : scrollDistance,
            behavior: "smooth"
        });
    });
});

//finds the browse search input
const browseSearch = document.getElementById("browse-search");

//runs the browse search when enter is pressed
if (browseSearch) {
    browseSearch.addEventListener("keydown", event => {
        if (event.key !== "Enter") {
            return;
        }

        const currentUrl = new URL(window.location.href);
        const searchValue = browseSearch.value.trim();

        //removes the search query when the field is empty
        if (!searchValue) {
            currentUrl.searchParams.delete("search");
        } else {
            currentUrl.searchParams.set(
                "search",
                searchValue
            );
        }

        window.location.href = currentUrl.toString();
    });
}

//finds the create listing overlay controls
const createListingButton =
    document.getElementById("create-listing-button");

const createListingModal =
    document.getElementById("create-listing-modal");

const createListingClose =
    document.getElementById("create-listing-close");

const createListingCancel =
    document.getElementById("create-listing-cancel");

//opens the create listing overlay
if (createListingButton && createListingModal) {
    createListingButton.addEventListener("click", () => {
        createListingModal.hidden = false;
    });
}

//closes the create listing overlay
function closeCreateListing() {
    if (createListingModal) {
        createListingModal.hidden = true;
    }
}

//closes the create listing overlay using the close button
if (createListingClose) {
    createListingClose.addEventListener(
        "click",
        closeCreateListing
    );
}

//closes the create listing overlay using cancel
if (createListingCancel) {
    createListingCancel.addEventListener(
        "click",
        closeCreateListing
    );
}

//closes the overlay when the background is selected
if (createListingModal) {
    createListingModal.addEventListener("click", event => {
        if (event.target === createListingModal) {
            closeCreateListing();
        }
    });
}

//finds the colour theme controls

const darkModeToggle =
    document.getElementById("dark-mode-toggle");

const siteLogo =
    document.getElementById("site-logo");

const homeHeaderImage =
    document.getElementById("home-header-image");

const homeHeroImage =
    document.getElementById("home-hero-image");

//updates theme images

function updateThemeImages() {
    const darkModeEnabled =
        document.body.classList.contains("dark-mode");

    if (siteLogo) {
        siteLogo.src = darkModeEnabled
            ? "/images/dark-bidbash_logo.png"
            : "/images/bidbash_logo.png";
    }

    if (homeHeaderImage) {
        homeHeaderImage.src = darkModeEnabled
            ? "/images/dark-header-img.png"
            : "/images/header-img.png";
    }

    if (homeHeroImage) {
        homeHeroImage.src = darkModeEnabled
            ? "/images/dark-hero-img.png"
            : "/images/hero-img.png";
    }
}

//loads the saved colour theme

const savedTheme =
    localStorage.getItem("bidbash-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

//updates the colour theme toggle

function updateThemeToggle() {
    if (!darkModeToggle) {
        return;
    }

    const darkModeEnabled =
        document.body.classList.contains("dark-mode");

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

//sets the initial theme state

updateThemeToggle();
updateThemeImages();

//switches between light and dark themes

if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const darkModeEnabled =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "bidbash-theme",
            darkModeEnabled
                ? "dark"
                : "light"
        );

        updateThemeToggle();
        updateThemeImages();
    });
}