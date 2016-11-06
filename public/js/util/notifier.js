function Notifier() {
    // bind a simple alert window to this controller to display any errors //
    this.dialogEl = $('#dialog');
    this.titleEl = $('#message-title');
    this.bodyEl = $('#message-body');
}

Notifier.prototype.showMessage = function showMessage(title, body) {
    this.titleEl.text(title);
    this.bodyEl.html(body);
    this.dialogEl.modal('show');
};
