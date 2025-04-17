const { getDB } = require("../config/db");
const bcryptor = require("../modules/bcryptor");

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
                res.render('login', {user: null, currentPage: "login", message: 'This account does not exist.'})
                // debug - add more later
                console.log("User does not exist.")
                return;
            }
        }

        const passwordMatch = await bcryptor.verifyPassword(password, account.password);
        if(!passwordMatch) {
            res.render('login', {user: null, currentPage: "login", message: 'Invalid email or password.'})
            // debug
            console.log("Invalid email or password.")
            return;
        }

        req.session.user = {
            _id: account._id,
            name: account.name,
            email: account.email,
            role: account.role
        };

        // confirm info - remove later
        console.log(req.session.user);
        
        if(account.role === 'admin'){
            res.redirect('/admins/dashboard');
        } else  {
            res.redirect('/users/dashboard');
        }
    } catch (error) {

    }
};