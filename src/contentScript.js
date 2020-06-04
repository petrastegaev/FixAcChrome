ACCOUNT='ideaSupport';

function setAccount() {
    chrome.storage.sync.get({
    twitterAccount: 'ideaSupport',
        }, function(items) {
            window.ACCOUNT = items.twitterAccount;
            console.log(items);
            waitForElementToDisplay(".twitter-handle-picker",300);
        });

}


function gettwitterHandle(container){
   var twitterHandle = container.querySelectorAll("button");
   return twitterHandle;
}


function checkTwitterList(selector){
    var TwitterList = document.querySelector(selector);
    var TwitterListEnabled = TwitterList.querySelector('.zd-menu-root.zd-menu-autofit-mode').style.cssText;
    console.log(TwitterListEnabled.includes('none'));
    if(TwitterList != null && !TwitterListEnabled.includes('none')){
        return true
    } else{
        return false
    }
}

function getNodeId(TwitterList){
for (let i = 0; i < TwitterList.length; i++) {
  if(TwitterList[i].childNodes[0].innerText.includes(ACCOUNT)){
      console.log(i);
      return i;
  }
}
}

function clickTwitterList(time){
    console.log("entered clickTwitterList");
    console.log(document.querySelector(".twitter-select-menu.zd-selectmenu.zd-state-open"));
    if(document.querySelector(".twitter-select-menu.zd-selectmenu.zd-state-open") != null ){
        var TwitterList = document.querySelector(".twitter-select-menu.zd-selectmenu.zd-state-open").querySelectorAll(".zd-menu-item.zd-leaf");
            console.log(ACCOUNT);
            var i = getNodeId(TwitterList);
            simulate(TwitterList[i], "mouseup");
    } else {
        setTimeout(function () {
            clickTwitterList(time);
        }, time);

    }


}

function getTwitterList(twitterHandle, selector, time){
    if(checkTwitterList(selector)){
            console.log("it's alive!");
            clickTwitterList(100);
        } else {
            console.log("retrying")
            //twitterHandle.click();
            simulate(twitterHandle, "mousedown");
            setTimeout(function () {
            getTwitterList(twitterHandle, selector, time);
        }, time);
        }
}

function waitForElementToDisplay(selector, time) {
    if (document.querySelector(selector) != null) {
        //alert("The element is displayed, you can put your code instead of this alert.")
        var container = document.querySelector(selector);
        console.log(container);
        var twitterHandle = gettwitterHandle(container)[0];
        console.log(twitterHandle);
        getTwitterList(twitterHandle, '.twitter-select-menu', 100);



    } else {
        setTimeout(function () {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

setAccount();
