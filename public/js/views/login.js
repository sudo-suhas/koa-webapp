domReady(function() {
    var vm = new Vue({
        el: '#app',
        data: window.vueData,
        methods: {
            loginSubmit: function loginSubmit() {
                postData('/login', JSON.stringify(vm.loginForm),
                    function resolve(resp) {
                        var body = resp.json;
                        vm.message = body.message;
                        if (resp.ok === true) {
                            window.location.href = body.response.redirectUrl;
                        } else if (body.error === true) {
                            // TODO: Process error details and update UI
                        }
                    },
                    function reject(err) {
                        console.log(err);
                    });
            }
        }
    });
});
