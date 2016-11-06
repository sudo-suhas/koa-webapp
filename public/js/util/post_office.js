function postOffice(buttonId, formId, url, callback) {
    var button = $('#' + buttonId),
        form = $('#' + formId),
        parsleyForm = form.parsley != null ? form.parsley() : null;

    var postSettings = {
        type: 'POST',
        url: url,
        success: function(data, status, jqXHR) {
            callback(null, data, status, jqXHR);
        },
        error: function(jqXHR, status, err) {
            var data;
            try {
                data = JSON.parse(jqXHR.responseText);
            } catch (ignore) {
                data = { success: false };
            }
            callback(err, data, status, jqXHR);
        },
        // I expect a JSON response
        dataType: 'json'
    };

    function sendPost() {
        postSettings.data = form.serialize();
        $.ajax(postSettings);
    }

    button.click(function(event) {
        event.preventDefault();

        if (parsleyForm == null || parsleyForm.isValid()) {
            sendPost();
        }
    });

}
