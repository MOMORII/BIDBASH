const statusText = document.getElementById("status");
const form = document.getElementById("listing-form");
const titleInput = document.getElementById("listing-title");
const feedback = document.getElementById("feedback");
const listingList = document.getElementById("listing-list");


async function checkBackend() {
    const response = await fetch("/api/status");
    const data = await response.json();

    statusText.textContent = data.message;
}


async function loadListings() {
    const response = await fetch("/api/listings");
    const listings = await response.json();

    listingList.innerHTML = "";

    for (const listing of listings) {
        const item = document.createElement("li");

        item.textContent =
            `${listing.title} — ${listing.created_at}`;

        listingList.appendChild(item);
    }
}


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value;

    const response = await fetch("/api/listings", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title
        })
    });

    const data = await response.json();

    if (!response.ok) {
        feedback.textContent = data.error;
        return;
    }

    feedback.textContent = "Listing saved successfully.";

    titleInput.value = "";

    await loadListings();
});


checkBackend();
loadListings();