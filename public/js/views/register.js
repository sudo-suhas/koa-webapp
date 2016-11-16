domReady(function() {
    var vm = new Vue({
        el: '#app',
        data: window.vueData,
        methods: {
            registerSubmit: function registerSubmit() {
                postData('/register', JSON.stringify(vm.registerForm),
                    function resolve(resp) {
                        console.log(resp);
                        var body = resp.json;
                        vm.message = body.message;
                        if (resp.ok === true) {
                            window.location.href = '/app';
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
