// Saves options to chrome.storage
function save_options() {
    var account = document.getElementById('account').value;
    chrome.storage.sync.set({
        twitterAccount: account
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value
    chrome.storage.sync.get({
        twitterAccount: 'IntelliJSupport',
    }, function (items) {
        document.getElementById('account').value = items.twitterAccount;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
