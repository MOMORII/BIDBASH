//confirms that browser-side javascript has loaded
console.log("BIDBASH frontend JavaScript loaded");

//finds the bidding controls on the auction page
const placeBidButton = document.getElementById("place-bid-button");
const bidAmountInput = document.getElementById("bid-amount");
const confirmationModal = document.getElementById("bid-confirmation-modal");
const confirmationBidAmount = document.getElementById("confirmation-bid-amount");
const confirmBidButton = document.getElementById("confirm-bid-button");
const cancelBidButton = document.getElementById("cancel-bid-button");
const closeBidButton = document.getElementById("bid-confirmation-close");

//runs bidding controls only when the authenticated controls exist
if (
    placeBidButton &&
    bidAmountInput &&
    confirmationModal &&
    confirmationBidAmount &&
    confirmBidButton &&
    cancelBidButton
) {
    //opens the confirmation overlay using the entered bid
    placeBidButton.addEventListener("click", () => {
        const bidAmount = Number(bidAmountInput.value);

        //rejects empty or invalid bid input
        if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
            alert("Please enter a valid bid amount.");
            return;
        }

        confirmationBidAmount.textContent =
            `£${bidAmount.toFixed(2)}`;

        confirmationModal.hidden = false;
    });

    //closes the bid confirmation overlay
    function closeBidConfirmation() {
        confirmationModal.hidden = true;
    }

    //closes the overlay using cancel
    cancelBidButton.addEventListener(
        "click",
        closeBidConfirmation
    );

    //closes the overlay using the close icon
    if (closeBidButton) {
        closeBidButton.addEventListener(
            "click",
            closeBidConfirmation
        );
    }

    //closes the overlay when its background is selected
    confirmationModal.addEventListener("click", event => {
        if (event.target === confirmationModal) {
            closeBidConfirmation();
        }
    });

    //submits the confirmed bid to the protected backend route
    confirmBidButton.addEventListener("click", async () => {
        const auctionId =
            confirmBidButton.dataset.auctionId;

        const response = await fetch("/api/bids", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                auctionId,
                amount: bidAmountInput.value
            })
        });

        const data = await response.json();

        //shows backend validation errors
        if (!response.ok) {
            alert(
                data.error ||
                "The bid could not be placed."
            );

            return;
        }

        alert(data.message);

        closeBidConfirmation();
    });
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

//finds the colour theme toggle
const darkModeToggle =
    document.getElementById("dark-mode-toggle");

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

//sets the initial theme toggle state
updateThemeToggle();

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
    });
}