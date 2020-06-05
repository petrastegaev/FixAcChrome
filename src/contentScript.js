setAccount();

async function setAccount() {
    let p = new Promise(function(resolve, reject){chrome.storage.sync.get({twitterAccount: 'ideaSupport'}, function(options){
            resolve(options.twitterAccount);
        })
    });
    const twitterAccount = await p;
    let twitterHandle = await getTwitterHandle(".twitter-handle-picker",300);
    await getTwitterList(twitterHandle[0],'.twitter-select-menu', 100);
    await clickTwitterList(twitterAccount,300);
}


function checkTwitterList(selector){
    var TwitterList = document.querySelector(selector);
    var TwitterListEnabled = TwitterList.querySelector('.zd-menu-root.zd-menu-autofit-mode').style.cssText;
    if(TwitterList != null && !TwitterListEnabled.includes('none')){
        return true
    } else{
        return false
    }
}

async function clickTwitterList(twitterAccount, time){
    console.log("entered clickTwitterList");
    while (!document.querySelector(".twitter-select-menu.zd-selectmenu.zd-state-open")){
        await new Promise(resolve => setTimeout(resolve,time));
    }
    const TwitterList = document.querySelector(".twitter-select-menu.zd-selectmenu.zd-state-open").querySelectorAll(".zd-menu-item.zd-leaf");
    for (let i = 0; i < TwitterList.length; i++) {
        if(TwitterList[i].childNodes[0].innerText.includes(twitterAccount)){
            console.log(i);
            simulate(TwitterList[i], "mouseup");
        }
    }
}

async function getTwitterList(twitterHandle, selector, time){
    while(!checkTwitterList(selector)){
        simulate(twitterHandle, "mousedown");
        await new Promise(resolve => setTimeout(resolve,time));
    }

}

async function getTwitterHandle(selector, time) {
    while (!document.querySelector(selector) ) { //wait for element to load
        await new Promise(resolve => setTimeout(resolve, time));
    }
    let container = document.querySelector(selector)
    let twitterHandle = container.querySelectorAll("button");
    return twitterHandle;
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


