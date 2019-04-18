var isDisabled = false;

// extension can be disabled temporarily
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key].newValue;
    if (key === 'disabled') {
      console.log(storageChange);
      isDisabled = storageChange;
      console.log(isDisabled);
    }
  }
});

// block outgoing requests for help widgets
chrome.webRequest.onBeforeRequest.addListener(
              function(details) {
                // set badge text to indicate that a help widget is available
                chrome.browserAction.setBadgeText({text: "HELP", tabId: details.tabId});

                if (!isDisabled && details.initiator.indexOf("atlassian.net") != -1) {
                  return { cancel: true }
                } else {
                  return { cancel: false }
                }
              },
              {urls: [
                "*://widget.intercom.io/*"
              ]},
              ["blocking"]);
