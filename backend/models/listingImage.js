//represents an image belonging to a listing
class ListingImage {
    constructor({
        id,
        listingId,
        filePath,
        displayOrder = 1
    }) {
        this.id = id;
        this.listingId = listingId;
        this.filePath = filePath;
        this.displayOrder = displayOrder;
    }
}

module.exports = ListingImage;