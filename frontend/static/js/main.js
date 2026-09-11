// i am confirming that browser-side javascript has loaded
console.log("BIDBASH frontend JavaScript loaded");

// i am finding the bidding controls on the auction page
const placeBidButton = document.getElementById("place-bid-button");
const bidAmountInput = document.getElementById("bid-amount");
const confirmationModal = document.getElementById("bid-confirmation-modal");
const confirmationBidAmount = document.getElementById("confirmation-bid-amount");
const confirmBidButton = document.getElementById("confirm-bid-button");
const cancelBidButton = document.getElementById("cancel-bid-button");

// i am only running the bidding code when the auction page contains these controls
if (
    placeBidButton &&
    bidAmountInput &&
    confirmationModal &&
    confirmationBidAmount &&
    confirmBidButton &&
    cancelBidButton
) {
    // i am showing the entered bid inside the confirmation overlay
    placeBidButton.addEventListener("click", () => {
        const bidAmount = bidAmountInput.value;

        // i am preventing an empty bid from opening the confirmation overlay
        if (!bidAmount) {
            alert("Please enter a bid amount.");
            return;
        }

        confirmationBidAmount.textContent =
            `£${Number(bidAmount).toFixed(2)}`;

        confirmationModal.hidden = false;
    });

    // i am closing the overlay when the user cancels the bid
    cancelBidButton.addEventListener("click", () => {
        confirmationModal.hidden = true;
    });

    // i am temporarily confirming the bid without sending it to the backend yet
    confirmBidButton.addEventListener("click", () => {
        alert("Bid confirmed. Backend submission will be added later.");

        confirmationModal.hidden = true;
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
