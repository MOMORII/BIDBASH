//loads authentication services

const bcrypt =
    require("bcrypt");

const userService =
    require("../services/user");

//renders the login page

function showLogin(req, res) {
    res.render("login", {
        pageTitle:
            "Login - BIDBASH"
    });
}

//handles login submissions

async function login(req, res) {
    const username =
        String(
            req.body.username || ""
        ).trim();

    const password =
        String(
            req.body.password || ""
        );

    if (
        !username ||
        !password
    ) {
        return res.status(400).render(
            "login",
            {
                pageTitle:
                    "Login - BIDBASH",
                error:
                    "Enter your username and password."
            }
        );
    }

    const user =
        userService.getByUsername(
            username
        );

    if (!user) {
        return res.status(401).render(
            "login",
            {
                pageTitle:
                    "Login - BIDBASH",
                error:
                    "Invalid username or password."
            }
        );
    }

    if (
        user.account_status !==
        "active"
    ) {
        return res.status(403).render(
            "login",
            {
                pageTitle:
                    "Login - BIDBASH",
                error:
                    "This account is not currently active."
            }
        );
    }

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!passwordMatches) {
        return res.status(401).render(
            "login",
            {
                pageTitle:
                    "Login - BIDBASH",
                error:
                    "Invalid username or password."
            }
        );
    }

    req.session.user = {
        id:
            user.user_id,
        username:
            user.username,
        role:
            user.role
    };

    if (
        user.role ===
        "moderator"
    ) {
        return res.redirect(
            "/moderation"
        );
    }

    res.redirect("/");
}

//renders the registration page

function showRegister(req, res) {
    res.render("register", {
        pageTitle:
            "Sign Up - BIDBASH",
        formData: {
            username:
                "",
            email:
                "",
            termsAccepted:
                false
        }
    });
}

//handles registration submissions

async function register(req, res) {
    const username =
        String(
            req.body.username || ""
        ).trim();

    const email =
        String(
            req.body.email || ""
        )
            .trim()
            .toLowerCase();

    const password =
        String(
            req.body.password || ""
        );

    const confirmPassword =
        String(
            req.body.confirmPassword || ""
        );

    const termsAccepted =
        req.body.terms === "on";

    const formData = {
        username,
        email,
        termsAccepted
    };

    if (
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        return res.status(400).render(
            "register",
            {
                pageTitle:
                    "Sign Up - BIDBASH",
                error:
                    "Username, email and password are required.",
                formData
            }
        );
    }

    if (
        username.length < 3 ||
        username.length > 50
    ) {
        return res.status(400).render(
            "register",
            {
                pageTitle:
                    "Sign Up - BIDBASH",
                error:
                    "Username must be between 3 and 50 characters.",
                formData
            }
        );
    }

    if (password.length < 8) {
        return res.status(400).render(
            "register",
            {
                pageTitle:
                    "Sign Up - BIDBASH",
                error:
                    "Password must contain at least 8 characters.",
                formData
            }
        );
    }

    if (
        password !==
        confirmPassword
    ) {
        return res.status(400).render(
            "register",
            {
                pageTitle:
                    "Sign Up - BIDBASH",
                error:
                    "Passwords do not match.",
                formData
            }
        );
    }

    if (!termsAccepted) {
        return res.status(400).render(
            "register",
            {
                pageTitle:
                    "Sign Up - BIDBASH",
                error:
                    "You must agree to the Terms & Conditions and Privacy Policy.",
                formData
            }
        );
    }

    const existingUsername =
        userService.getByUsername(
            username
        );

    if (existingUsername) {
        return res.status(409).render(
            "register",
            {
                pageTitle:
                    "Sign Up - BIDBASH",
                error:
                    "That username is already in use.",
                formData
            }
        );
    }

    const existingEmail =
        userService.getByEmail(
            email
        );

    if (existingEmail) {
        return res.status(409).render(
            "register",
            {
                pageTitle:
                    "Sign Up - BIDBASH",
                error:
                    "That email address is already registered.",
                formData
            }
        );
    }

    const passwordHash =
        await bcrypt.hash(
            password,
            12
        );

    const newUser =
        userService.create({
            username,
            email,
            passwordHash
        });

    req.session.user = {
        id:
            newUser.user_id,
        username:
            newUser.username,
        role:
            newUser.role
    };

    res.redirect("/");
}

//ends the active session

function logout(req, res) {
    req.session.destroy(
        error => {
            if (error) {
                return res.status(500).send(
                    "Unable to log out."
                );
            }

            res.redirect(
                "/age-check"
            );
        }
    );
}

module.exports = {
    showLogin,
    login,
    showRegister,
    register,
    logout
};