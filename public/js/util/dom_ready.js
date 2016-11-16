/* eslint-disable no-unused-expressions, callback-return */

/**
 * Calls the required method on successful load of DOM.
 * Equivalent to $(callback) with jQuery
 *
 * @see http://beeker.io/jquery-document-ready-equivalent-vanilla-javascript
 *
 * @param {Function} callback
 */
function domReady(callback) {
    document.readyState === 'interactive' || document.readyState === 'complete' ?
        callback() :
        document.addEventListener('DOMContentLoaded', callback);
}

domReady(function() {
    // Since we are keeping a app div in layout, this should be safe
    document.getElementById('loading-spinner').className = 'hidden';
    document.getElementById('app').className = 'animate-bottom';
});
