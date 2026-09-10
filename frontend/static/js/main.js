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