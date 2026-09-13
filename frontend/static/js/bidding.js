//loads bid interface elements

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

//tracks the submitted bid amount

let pendingBidAmount =
    null;

//opens the modal

function openBidModal() {
    if (!bidModal) {
        return;
    }

    bidModal.hidden =
        false;
}

//closes the modal

function closeBidModal() {
    if (!bidModal) {
        return;
    }

    bidModal.hidden =
        true;

    resetBidModal();
}

//clears bid result classes

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

//resets the confirmation modal

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

    if (bidConfirmationSummary) {
        bidConfirmationSummary.hidden =
            false;
    }

    if (bidConfirmationNote) {
        bidConfirmationNote.hidden =
            false;

        bidConfirmationNote.textContent =
            "All bids are binding. By confirming, you agree to BIDBASH's Terms & Conditions.";
    }

    if (bidConfirmationActions) {
        bidConfirmationActions.hidden =
            false;
    }

    if (bidResultContent) {
        bidResultContent.hidden =
            true;
    }

    if (bidResultHighlight) {
        bidResultHighlight.hidden =
            true;

        bidResultHighlight.textContent =
            "";
    }

    if (bidResultActions) {
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

//prepares a result state

function prepareBidResult() {
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

    if (bidResultContent) {
        bidResultContent.hidden =
            false;
    }

    if (bidResultActions) {
        bidResultActions.hidden =
            false;
    }
}

//shows accepted feedback

function showBidAccepted(
    amount
) {
    clearBidResultClasses();

    bidModalCard.classList.add(
        "bid-accepted"
    );

    prepareBidResult();

    bidModalTitle.textContent =
        "BID ACCEPTED";

    bidModalMessage.textContent =
        "You are now the highest bidder!";

    bidResultDetail.textContent =
        `Your bid of £${Number(
            amount
        ).toFixed(2)} has been accepted.`;

    bidResultHighlight.hidden =
        true;
}

//shows rejected feedback

function showBidRejected(
    message
) {
    clearBidResultClasses();

    bidModalCard.classList.add(
        "bid-rejected"
    );

    prepareBidResult();

    bidModalTitle.textContent =
        "BID REJECTED";

    bidModalMessage.textContent =
        "We're sorry, we cannot accept your bid.";

    bidResultDetail.textContent =
        "REASON:";

    bidResultHighlight.textContent =
        message ||
        "The bid could not be accepted.";

    bidResultHighlight.hidden =
        false;
}

//shows outbid feedback

function showBidOutbid(
    currentBid,
    minimumBid
) {
    clearBidResultClasses();

    bidModalCard.classList.add(
        "bid-outbid"
    );

    prepareBidResult();

    bidModalTitle.textContent =
        "OUTBID";

    bidModalMessage.textContent =
        "Another bidder has placed a higher bid while you were confirming.";

    bidResultDetail.textContent =
        "New highest bid:";

    bidResultHighlight.textContent =
        `£${Number(
            currentBid
        ).toFixed(2)}`;

    bidResultHighlight.hidden =
        false;

    updateAuctionValues(
        currentBid,
        minimumBid
    );
}

//updates visible auction values

function updateAuctionValues(
    currentBid,
    minimumBid
) {
    if (
        Number.isFinite(
            Number(currentBid)
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
            Number(minimumBid)
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
            Number(minimumBid)
        ) &&
        confirmationMinimumBid
    ) {
        confirmationMinimumBid.textContent =
            `£${Number(
                minimumBid
            ).toFixed(2)}`;
    }

    if (
        Number.isFinite(
            Number(currentBid)
        ) &&
        confirmationCurrentBid
    ) {
        confirmationCurrentBid.textContent =
            `£${Number(
                currentBid
            ).toFixed(2)}`;
    }

    if (
        Number.isFinite(
            Number(minimumBid)
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
            Number(minimumBid)
        ) &&
        bidHelp
    ) {
        bidHelp.textContent =
            `Type an amount or use the arrows. Minimum valid bid: £${Number(
                minimumBid
            ).toFixed(2)}`;
    }
}

//opens confirmation for entered bid

function prepareBidConfirmation() {
    const amount =
        Number(
            bidAmountInput.value
        );

    if (
        !Number.isFinite(amount) ||
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

    resetBidModal();

    confirmationBidAmount.textContent =
        `£${amount.toFixed(2)}`;

    openBidModal();
}

//submits the confirmed bid

async function submitBid() {
    const auctionId =
        Number(
            confirmBidButton.dataset
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
                                pendingBidAmount
                        })
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            if (
                result.status ===
                    "too-low" &&
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
            result.auction.currentBid,
            result.auction.minimumBid
        );

        showBidAccepted(
            result.bid.amount
        );

        bidAmountInput.value =
            "";
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

//handles confirm clicks

if (confirmBidButton) {
    confirmBidButton.addEventListener(
        "click",
        submitBid
    );
}

//handles cancellation

if (cancelBidButton) {
    cancelBidButton.addEventListener(
        "click",
        closeBidModal
    );
}

//handles close button

if (bidModalClose) {
    bidModalClose.addEventListener(
        "click",
        closeBidModal
    );
}

//handles result continuation

if (bidResultClose) {
    bidResultClose.addEventListener(
        "click",
        closeBidModal
    );
}

//handles outside modal clicks

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

//handles escape key

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