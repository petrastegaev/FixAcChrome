setAccount();

async function setAccount() {
    try {
        let p = new Promise(function (resolve, reject) {
            chrome.storage.sync.get({twitterAccount: 'ideaSupport'}, function (options) {
                resolve(options.twitterAccount);
            })
        });
        const twitterAccount = await p;
        let twitterHandle = await getTwitterHandle(".twitter-handle-picker");
        await getTwitterList(twitterHandle, '.twitter-select-menu');
        await clickTwitterList(twitterAccount);
    }catch(e){
        console.error(e);
    }
}


function checkTwitterList(selector) {
    const TwitterList = document.querySelector(selector);
    const TwitterListEnabled = TwitterList.querySelector('.zd-menu-root.zd-menu-autofit-mode').style.cssText;
    if (TwitterListEnabled.includes('none')) {
        return true
    } else {
        return false
    }
}

async function clickTwitterList(twitterAccount) {
    checkElement('.twitter-select-menu.zd-selectmenu.zd-state-open').then((element) => {
        const TwitterList = element.querySelectorAll(".zd-menu-item.zd-leaf");
        for (let i = 0; i < TwitterList.length; i++) {
            if (TwitterList[i].childNodes[0].innerText.includes(twitterAccount)) {
                simulate(TwitterList[i], "mouseup");
            }
        }
    });

}

async function getTwitterList(twitterHandle, selector) {
    while (checkTwitterList(selector)) {
        simulate(twitterHandle, "mousedown");
        //await new Promise(resolve => setTimeout(resolve, 1000));
        await rafAsync();
    }

}

async function getTwitterHandle(selector) {
    let twitterHandle = checkElement(selector).then((element) => {
        return element.querySelectorAll("button")[0];
    });
    return twitterHandle;
}

async function checkElement(selector) {
    while (document.querySelector(selector) === null) {
        await rafAsync()
    }
    return document.querySelector(selector);
}

function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) {
            eventType = name;
            break;
        }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        } else {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    } else {
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


