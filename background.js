chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.cmd == "badge-on") {
      chrome.browserAction.setBadgeText({text: 'ON'});
      chrome.browserAction.setBadgeBackgroundColor({color: 'rgb(173, 64, 64)'});
      sendResponse({msg: "successful set badge"});
    }else {
      chrome.browserAction.setBadgeText({text: ''});
      sendResponse({msg: "turned badge off"});
    }
  });