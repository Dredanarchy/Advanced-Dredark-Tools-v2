var attachedTabs = {};
var version = "1.3";
var letsdo = null;
var debugIdGlobal;
let debuggerEnabled = false;
names=["Kittycraft0","NEW","mentallmoky395","AbsentTeaLady"];
var opened = false;
function randomNumber(min, max) {  
  return Math.random() * (max - min) + min; 
}  
var xC, yC;
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.id :
      "from the extension");
      
    if (request.eventPlease === "trusted")
    
  if (debuggerEnabled & opened){
      sendResponse({ yourEvent: "dispatching event, one moment" });


    //console.log(request.x, request.y); 
    xC = request.x; yC = request.y;
    if (request.mouse == "D") {
      //console.log("down");
      chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Input.dispatchMouseEvent", { type: "mousePressed", x: xC, y: yC, button: "left", clickCount: 1 }, function (e) { console.log('clickDown', e) });


    } else if (request.mouse == "U") {
      //console.log("up");

      chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Input.dispatchMouseEvent", { type: "mouseReleased", x: xC, y: yC, button: "left", clickCount: 1 }, function (e) { console.log('clickUp', e) });

    }else if (request.mouse == "J") {
      //console.log("jump");
      //alert("LETS JUMP BABY!")
      chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Input.dispatchKeyEvent", {type: 'keyDown', key: "Space", code: "Space", windowsVirtualKeyCode:32, nativeVirtualKeyCode : 32, macCharCode: 32  }, function (e) { console.log('jump', e) });
      setTimeout(() => {chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Input.dispatchKeyEvent", {type: 'keyUp', key: "Space", code: "Space", windowsVirtualKeyCode:32, nativeVirtualKeyCode : 32, macCharCode: 32  }, function (e) { console.log('jump', e) });}, randomNumber(500,1000));
    }
    else if (request.mouse == "A") {
      //console.log("jump");
      //alert("LETS JUMP BABY!")
      chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Input.dispatchKeyEvent", {type: 'keyDown', windowsVirtualKeyCode:65, nativeVirtualKeyCode : 65, macCharCode: 65  }, function (e) { console.log('jump', e) });
      setTimeout(() => {chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Input.dispatchKeyEvent", {type: 'keyUp', windowsVirtualKeyCode:65, nativeVirtualKeyCode : 65, macCharCode: 65  }, function (e) { console.log('jump', e) });}, randomNumber(500,1000));
    }

} else {
  sendResponse({ yourEvent: "failed" });
  
}


  });


chrome.debugger.onEvent.addListener(onEvent);
chrome.debugger.onDetach.addListener(onDetach);

chrome.browserAction.onClicked.addListener(function (tab) {
  var tabId = tab.id;
  var debuggeeId = { tabId: tabId };
  debugIdGlobal = debuggeeId;

  if (!attachedTabs[tabId]){
    chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId));
}
else {
  chrome.debugger.detach(debuggeeId, onDetach.bind(null, debuggeeId));
}

});

function onAttach(debuggeeId) {
  if (chrome.runtime.lastError) {
    //alert(chrome.runtime.lastError.message);
    return;
  }

  tabId = debuggeeId.tabId;
  chrome.browserAction.setIcon({ tabId: tabId, path: "debuggerPause.png" });
  chrome.browserAction.setTitle({ tabId: tabId, title: "pause debugger" });
  attachedTabs[tabId] = "working";
  chrome.debugger.sendCommand(
    debuggeeId, "Debugger.enable", {},
    onDebuggerEnabled.bind(null, debuggeeId));
  opened = true;
  //("healbot started click on the shields to begin")
}


function onDebuggerEnabled(debuggeeId) {
  debuggerEnabled = true
}

function onDebuggerDisabled(debuggeeId) {
  debuggerEnabled = false
}

function onEvent(debuggeeId, method, frameId, resourceType) {

  tabId = debuggeeId.tabId;
  if (method == "Debugger.paused") {
    attachedTabs[tabId] = "paused";
    chrome.browserAction.setIcon({ tabId: tabId, path: "debuggerStart.png" });
    chrome.browserAction.setTitle({ tabId: tabId, title: "Resume debugging" });
    opened = false;
  }
}

function onDetach(debuggeeId) {
  var tabId = debuggeeId.tabId;
  chrome.debugger.sendCommand(
    debuggeeId, "Debugger.disable", {},
    onDebuggerDisabled.bind(null, debuggeeId));
  delete attachedTabs[tabId];
  chrome.browserAction.setIcon({ tabId: tabId, path: "debuggerStart.png" });
  chrome.browserAction.setTitle({ tabId: tabId, title: "Resume debugging" });
  debuggerEnabled = false
}
