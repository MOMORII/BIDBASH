//represents the shared properties of bidbash users
class User {
    constructor({
        id,
        username,
        email,
        verified = false,
        accountStatus = "active"
    }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.verified = verified;
        this.accountStatus = accountStatus;
    }
}

//represents a standard bidder or seller account
class StandardUser extends User {
    constructor(data) {
        super(data);
        this.role = "user";
    }
}

//represents a moderation account
class Moderator extends User {
    constructor(data) {
        super(data);
        this.role = "moderator";
    }
}

module.exports = {
    User,
    StandardUser,
    Moderator
};