const { getDB } = require("../config/db");
const bcryptor = require("../modules/bcryptor");
// const jwt = require("jsonwebtoken");

/*
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDB();

        // Find user in either admins or users collection
        const user = await db.collection("admins").findOne({ email }) || await db.collection("users").findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }



        const passwordMatch = await bcryptor.verifyPassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const tokenPayload = {
            id: user._id.toString(), // Convert ObjectId to string
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            company: user.company,
            role: user.role || "user" // Default to "user" if undefined
        };


        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login Error:", err); // Debugging
        res.status(500).json({ error: "Login failed", details: err.message });
    }
};
*/

exports.renderLogin = async (req, res) => {
    res.render('login', {currentPage: 'login', user : null});
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        const db = getDB();
        let account = await db.collection("users").findOne({ email });
        if(!account) {
            account = await db.collection("admins").findOne({ email });

            if(!account) {
                res.render('login', {message: 'This account does not exist.'})
                // debug
                console.log("User does not exist.")
            }
        }

        const passwordMatch = await bcryptor.verifyPassword(password, account.password);
        if(!passwordMatch) {
            res.render('login', {message: 'Invalid email or password.'})
            // debug
            console.log("Invalid email or password.")
        }

        req.session.user = {
            _id: account._id,
            name: account.name,
            email: account.email,
            role: account.role
        };

        // confirm info
        console.log(req.session.user);
        
        if(account.role === 'admin'){
            res.redirect('/admins/dashboard');
        } else {
            res.redirect('/users/dashboard');
        }
        
    } catch (error) {

    }
};