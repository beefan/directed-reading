/**
 * Listening for content command to toggle badge info
 */
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

  /**
   * Callback function to inject content script when
   * a user clicks the extension from context menu
   * 
   * @param {Object} info containing context from what was clicked    
   * @param {Tab.tab} tab Chrome tab
   */
  function injectContentScript(info, tab) {
    chrome.tabs.executeScript(tab.id, {file: "content.js"}, () => {
      console.log("directed reading extension enabled");
    })
  }

  // create chrome context menus so that 
  // ext can be activated explicitly 
  chrome.contextMenus.create({"title": 'Enable Directed Reading'})
  chrome.contextMenus.onClicked.addListener(injectContentScript);