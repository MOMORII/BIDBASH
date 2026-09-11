//checks whether a login session exists
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

//checks whether the active session belongs to a moderator
function requireModerator(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    if (req.session.user.role !== "moderator") {
        return res.status(403).send("Access denied.");
    }

    next();
}

//checks whether the requested user dashboard belongs to the active session
function requireOwnUser(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    const requestedUserId = Number(req.params.id);
    const loggedInUserId = Number(req.session.user.id);

    //rejects access to another user's private dashboard
    if (requestedUserId !== loggedInUserId) {
        return res.status(403).send("Access denied.");
    }

    next();
}

module.exports = {
    requireLogin,
    requireModerator,
    requireOwnUser
};