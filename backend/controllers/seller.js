//renders the temporary seller area
function dashboard(req, res) {
    res.send(
        `Seller area accessible. Logged in as ${req.session.user.username}.`
    );
}

module.exports = {
    dashboard
};