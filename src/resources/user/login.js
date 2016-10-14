'use strict';

module.exports = passport => passport.authenticate('local-login', {
    successRedirect: '/app', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
});
