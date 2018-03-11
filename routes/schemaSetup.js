module.exports = function(app,passport) {

    app.get('/setSchema', function(req, res) {
        if (req.isAuthenticated()) {
            res.json({ success: true, user: req.user })
        } else {
            req.logout()
            res.json({ success: false, info: "Login ou mot de passe incorrect" })
        }
    });
    
    }
    