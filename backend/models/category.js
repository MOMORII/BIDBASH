//represents a listing category
class Category {
    constructor({
        id,
        name,
        description = null
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

module.exports = Category;