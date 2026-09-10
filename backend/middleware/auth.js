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

module.exports = {
    requireLogin,
    requireModerator
};