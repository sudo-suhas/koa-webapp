function defaultReject(error) {
    // Handle error
    console.log(error.message);
}

function postData(url, body, resolve, reject) {
    if (reject == null) {
        reject = defaultReject;
    }
    fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    }).then(function(response) {
        return response.json().then(function(json) {
            response.json = json;
            return response;
        });
    }).then(resolve).catch(reject);
}
