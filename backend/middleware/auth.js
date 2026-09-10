// i am preventing guests from accessing authenticated routes
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

// i am preventing non-moderator accounts from accessing moderation routes
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