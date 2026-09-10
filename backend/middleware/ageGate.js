//checks whether the visitor confirmed the age requirement
function requireAgeConfirmation(req, res, next) {
    if (!req.session.ageConfirmed) {
        return res.redirect("/age-check");
    }

    next();
}

module.exports = {
    requireAgeConfirmation
};