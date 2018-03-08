module.exports = function(app, webdir,passport) {

var express = require('express');
app.use(express.static(webdir));
app.get('/profile', function(req, res) {
    if (req.isAuthenticated()) {
        res.json({ success: true, user: req.user })
    } else {
        req.logout()
        res.json({ success: false, info: "Login ou mot de passe incorrect" })
    }
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // if authentification succeeds, /profile will return user info
    failureRedirect: '/profile', // if authentification fails, /profile will return {success:false}
}));
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/profile', // redirect back to the signup page if there is an error
}));

}
