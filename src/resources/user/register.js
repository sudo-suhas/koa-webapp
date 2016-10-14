'use strict';

module.exports = passport => passport.authenticate('local-register', {
    successRedirect: '/app', // redirect to the secure profile section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
});
