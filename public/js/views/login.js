$(document).ready(function() {
    // Setup parsley
    $('#form-login').parsley();

    var notifier = new Notifier();

    function postCallback(err, data, status, jqXHR) {
        console.log(err, data, status, jqXHR);
        if (err || data.success === false) {
            console.log('OH MAI GAD!!');
            if (data.error === true) {
                // Do something with field level error info.
                // Use parsley? http://parsleyjs.org/doc/index.html
            } else {
                notifier.showMessage('Login Failed!', data.message);
            }
            return;
        }
        // Response should have the redirect url
        window.location.href = data.response.redirectUrl;
    }

    // Setup form submit using ajax post
    postOffice('btn-login', 'form-login', '/login', postCallback);

});
