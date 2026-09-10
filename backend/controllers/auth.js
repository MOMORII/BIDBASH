//stores temporary accounts until sqlite authentication exists
const users = {
    user: {
        username: "user",
        password: "test123",
        role: "user"
    },

    moderator: {
        username: "moderator",
        password: "mod123",
        role: "moderator"
    }
};

//renders the login page
function showLogin(req, res) {
    res.render("login", {
        pageTitle: "Login - BIDBASH"
    });
}

//authenticates temporary development accounts
function login(req, res) {
    const { username, password } = req.body;
    const user = users[username];

    //rejects incorrect credentials
    if (!user || user.password !== password) {
        return res.status(401).render("login", {
            pageTitle: "Login - BIDBASH",
            error: "Incorrect username or password."
        });
    }

    //stores required session information
    req.session.user = {
        username: user.username,
        role: user.role
    };

    //redirects moderators to their dashboard
    if (user.role === "moderator") {
        return res.redirect("/moderation");
    }

    res.redirect("/");
}

//destroys the active login session
function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/age-check");
    });
}

module.exports = {
    showLogin,
    login,
    logout
};