//finds moderator dashboard controls

const moderationCards =
    document.querySelectorAll(".flagged-listing-card");

const moderationSearch =
    document.getElementById("moderator-search");

const moderationSearchForm =
    document.getElementById("moderator-search-form");

const moderationFilterButtons =
    document.querySelectorAll(
        ".moderator-filter-button"
    );

const moderationNavFilters =
    document.querySelectorAll(
        ".moderator-nav-filter"
    );

const clearModerationFilters =
    document.getElementById(
        "moderator-clear-filters"
    );

const caseContent =
    document.getElementById(
        "moderation-case-content"
    );

const caseActionForm =
    document.getElementById(
        "moderation-action-form"
    );

//stores active moderation filters

let activeRisk = "";
let activeType = "";
let activeStatus = "";

//shows the selected moderation case

function showModerationCase(card) {
    if (!card || card.hidden || !caseContent) {
        return;
    }

    moderationCards.forEach(item => {
        item.classList.remove("active");
    });

    card.classList.add("active");

    caseContent.hidden = false;

    const caseId =
        document.getElementById("case-id");

    const caseTitle =
        document.getElementById("case-title");

    const caseSeller =
        document.getElementById("case-seller");

    const caseMemberSince =
        document.getElementById(
            "case-member-since"
        );

    const caseSellerListings =
        document.getElementById(
            "case-seller-listings"
        );

    const caseFeedback =
        document.getElementById(
            "case-feedback"
        );

    const caseFlagReason =
        document.getElementById(
            "case-flag-reason"
        );

    const caseReportedBy =
        document.getElementById(
            "case-reported-by"
        );

    const caseReportedAt =
        document.getElementById(
            "case-reported-at"
        );

    const caseRisk =
        document.getElementById(
            "case-risk"
        );

    const caseCategory =
        document.getElementById(
            "case-category"
        );

    const caseNotes =
        document.getElementById(
            "case-notes"
        );

    if (caseId) {
        caseId.textContent =
            card.dataset.caseId;
    }

    if (caseTitle) {
        caseTitle.textContent =
            card.dataset.title;
    }

    if (caseSeller) {
        caseSeller.textContent =
            card.dataset.seller;
    }

    if (caseMemberSince) {
        caseMemberSince.textContent =
            card.dataset.memberSince;
    }

    if (caseSellerListings) {
        caseSellerListings.textContent =
            card.dataset.sellerListings;
    }

    if (caseFeedback) {
        caseFeedback.textContent =
            card.dataset.feedback;
    }

    if (caseFlagReason) {
        caseFlagReason.textContent =
            card.dataset.flagReason;
    }

    if (caseReportedBy) {
        caseReportedBy.textContent =
            card.dataset.reportedBy;
    }

    if (caseReportedAt) {
        caseReportedAt.textContent =
            card.dataset.reportedAt;
    }

    if (caseRisk) {
        caseRisk.textContent =
            card.dataset.risk.toUpperCase();
    }

    if (caseCategory) {
        caseCategory.textContent =
            card.dataset.category;
    }

    if (caseNotes) {
        caseNotes.textContent =
            card.dataset.notes;
    }

    if (caseActionForm) {
        caseActionForm.action =
            `/moderation/${card.dataset.caseId}/action`;
    }
}

//checks reviewed moderation statuses

function isReviewedStatus(status) {
    return [
        "approved",
        "changes-requested",
        "removed"
    ].includes(status);
}

//checks whether a case matches the active status

function matchesStatusFilter(cardStatus) {
    if (!activeStatus) {
        return true;
    }

    if (activeStatus === "reviewed") {
        return isReviewedStatus(cardStatus);
    }

    return cardStatus === activeStatus;
}

//finds the first visible moderation case

function getFirstVisibleCase() {
    return Array.from(
        moderationCards
    ).find(card => {
        return !card.hidden;
    });
}

//updates the selected case after filtering

function updateSelectedCase() {
    const activeCard =
        document.querySelector(
            ".flagged-listing-card.active"
        );

    if (
        activeCard &&
        !activeCard.hidden
    ) {
        return;
    }

    const firstVisibleCase =
        getFirstVisibleCase();

    if (firstVisibleCase) {
        showModerationCase(
            firstVisibleCase
        );

        return;
    }

    moderationCards.forEach(card => {
        card.classList.remove("active");
    });

    if (caseContent) {
        caseContent.hidden = true;
    }

    const caseId =
        document.getElementById("case-id");

    if (caseId) {
        caseId.textContent =
            "No matching cases";
    }
}

//filters visible moderation cases

function filterModerationCases() {
    const searchValue =
        moderationSearch
            ? moderationSearch.value
                .trim()
                .toLowerCase()
            : "";

    moderationCards.forEach(card => {
        const searchableText = [
            card.dataset.caseId,
            card.dataset.title,
            card.dataset.category,
            card.dataset.seller,
            card.dataset.flagReason,
            card.dataset.reportType,
            card.dataset.status
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            !searchValue ||
            searchableText.includes(
                searchValue
            );

        const matchesRisk =
            !activeRisk ||
            card.dataset.risk ===
                activeRisk;

        const matchesType =
            !activeType ||
            card.dataset.reportType ===
                activeType;

        const matchesStatus =
            matchesStatusFilter(
                card.dataset.status
            );

        card.hidden = !(
            matchesSearch &&
            matchesRisk &&
            matchesType &&
            matchesStatus
        );
    });

    updateSelectedCase();
}

//clears one sidebar filter group

function clearFilterGroup(
    filterAttribute
) {
    moderationFilterButtons.forEach(
        button => {
            if (
                button.dataset[
                    filterAttribute
                ] !== undefined
            ) {
                button.classList.remove(
                    "active"
                );
            }
        }
    );
}

//selects a risk filter

function selectRiskFilter(button) {
    const selectedRisk =
        button.dataset.riskFilter;

    const alreadyActive =
        activeRisk === selectedRisk;

    clearFilterGroup(
        "riskFilter"
    );

    if (alreadyActive) {
        activeRisk = "";

        return;
    }

    activeRisk =
        selectedRisk;

    button.classList.add(
        "active"
    );
}

//selects a report type filter

function selectTypeFilter(button) {
    const selectedType =
        button.dataset.typeFilter;

    const alreadyActive =
        activeType === selectedType;

    clearFilterGroup(
        "typeFilter"
    );

    if (alreadyActive) {
        activeType = "";

        return;
    }

    activeType =
        selectedType;

    button.classList.add(
        "active"
    );
}

//selects a sidebar status filter

function selectStatusFilter(button) {
    const selectedStatus =
        button.dataset.statusFilter;

    const alreadyActive =
        activeStatus ===
        selectedStatus;

    clearFilterGroup(
        "statusFilter"
    );

    moderationNavFilters.forEach(
        item => {
            item.classList.remove(
                "active"
            );
        }
    );

    if (alreadyActive) {
        activeStatus = "";

        return;
    }

    activeStatus =
        selectedStatus;

    button.classList.add(
        "active"
    );
}

//selects moderation cases

moderationCards.forEach(card => {
    card.addEventListener(
        "click",
        () => {
            showModerationCase(card);
        }
    );
});

//runs moderation search

if (moderationSearchForm) {
    moderationSearchForm.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            filterModerationCases();
        }
    );
}

//filters cases while typing

if (moderationSearch) {
    moderationSearch.addEventListener(
        "input",
        filterModerationCases
    );
}

//handles sidebar filters

moderationFilterButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                if (
                    button.dataset
                        .riskFilter
                ) {
                    selectRiskFilter(
                        button
                    );
                }

                if (
                    button.dataset
                        .typeFilter
                ) {
                    selectTypeFilter(
                        button
                    );
                }

                if (
                    button.dataset
                        .statusFilter
                ) {
                    selectStatusFilter(
                        button
                    );
                }

                filterModerationCases();
            }
        );
    }
);

//handles top navigation filters

moderationNavFilters.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                const selectedStatus =
                    button.dataset
                        .statusFilter;

                const alreadyActive =
                    activeStatus ===
                        selectedStatus &&
                    button.classList
                        .contains(
                            "active"
                        );

                moderationNavFilters
                    .forEach(item => {
                        item.classList
                            .remove(
                                "active"
                            );
                    });

                clearFilterGroup(
                    "statusFilter"
                );

                if (alreadyActive) {
                    activeStatus = "";
                } else {
                    activeStatus =
                        selectedStatus;

                    button.classList.add(
                        "active"
                    );
                }

                filterModerationCases();
            }
        );
    }
);

//clears all moderation filters

if (clearModerationFilters) {
    clearModerationFilters
        .addEventListener(
            "click",
            () => {
                activeRisk = "";
                activeType = "";
                activeStatus = "";

                if (moderationSearch) {
                    moderationSearch.value =
                        "";
                }

                moderationFilterButtons
                    .forEach(button => {
                        button.classList
                            .remove(
                                "active"
                            );
                    });

                moderationNavFilters
                    .forEach(button => {
                        button.classList
                            .remove(
                                "active"
                            );
                    });

                filterModerationCases();
            }
        );
}

//opens the first moderation case

if (moderationCards.length) {
    filterModerationCases();
}