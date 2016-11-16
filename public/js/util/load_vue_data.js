function loadVueData() {
    var vueDataEl = document.getElementById('vue-data-text');
    try {
        window.vueData = JSON.parse(vueDataEl.innerHTML);
    } catch (ignore) {
        window.vueData = {};
    }
}

domReady(loadVueData);
