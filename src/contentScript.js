async function setAccount() {
    try {
        if (!await checkTicket()) {
            console.info("not a twitter  ticket, doing nothing");
            return false;
        } else {
            console.info("twitter  ticket, detected");
        }
        let p = new Promise(function (resolve, reject) {
            chrome.storage.sync.get({twitterAccount: 'IntelliJSupport'}, function (options) {
                resolve(options.twitterAccount);
            })
        });
        const twitterAccount = await p;
        console.log(document.querySelectorAll(".header.pane_header"));
        let twitterHandle = await getTwitterHandle(".twitter-handle-picker");
        console.log("twitterHandle", twitterHandle);
        await getTwitterList(twitterHandle, '.twitter-select-menu');
        await clickTwitterList(twitterAccount);
        await setFocus();
        console.info("done");
        return true;
    } catch (e) {
        console.error(e);
    }
}

async function checkTicket() {
    await rafAsync();
    await new Promise(resolve => setTimeout(resolve, 500));
    return await checkElements(".header.pane_header.mast.clearfix.twitter").then(async (twitterTag) => {
        let result = false;
        console.log(twitterTag);
        if (twitterTag && twitterTag.length > 0) {
            for (let i = 0; i < twitterTag.length; ++i) {
                //console.log(twitterTag[i].offsetWidth);
                //console.log(twitterTag[i].classList);
                if (twitterTag[i].classList.contains('twitter') && twitterTag[i].offsetWidth > 0 && twitterTag[i].offsetHeight > 0) {
                    //console.log(twitterTag[i].className.split(' '));
                    result = true;
                }
            }
        }
        return result;
    });

}

async function setFocus() {
    console.log("Setting Focus");
    await checkElements(".comment_input_wrapper").then(async (InputField) => {
        for (let i = 0; i < InputField.length; i++) {
            console.log(InputField);
            if (InputField[i].offsetWidth > 0 && InputField[i].offsetHeight > 0) {
                let textArea = InputField[i].querySelector(".ember-text-area");
                console.log(textArea);
                //setTimeout(textArea.click(), 30);
                //await simulate(textArea, "mousemove");
                await simulate(textArea, "mousedown");
                //await textArea.preventDefault();
                await textArea.focus();
                await simulate(textArea, "mouseup");
                await textArea.click();
            }
        }
    });
}


function checkTwitterList(selector) {
    const TwitterList = document.querySelectorAll(selector);
    //console.log(TwitterList);
    let result = true;
    for (let i = 0; i < TwitterList.length; ++i) {
        const TwitterListEnabled = TwitterList[i].querySelector('.zd-menu-root.zd-menu-autofit-mode').style.cssText;
        //console.log(TwitterListEnabled);
        if (!TwitterListEnabled.includes('none')) {
            console.log("TwitterList enabled");
            result = false;
        }

    }
    console.log("checkTwitterList result ", result);
    return result;
}

async function clickTwitterList(twitterAccount) {
    await checkElements('.twitter-select-menu.zd-selectmenu.zd-state-open').then(async (element) => {
        let list = element;
        //console.log(list);
        for (let i = 0; i < list.length; ++i) {
            const TwitterList = list[i].childNodes[0];
            //console.log(TwitterList);
            if (TwitterList.offsetWidth > 0 && TwitterList.offsetHeight > 0) {
                console.log(twitterAccount);
                let TwitterNodeList = TwitterList.querySelectorAll(".zd-menu-item.zd-leaf");
                for (let i = 0; i < TwitterNodeList.length; i++) {
                    //console.log(TwitterNodeList[i].childNodes[0].innerText);
                    if (TwitterNodeList[i].childNodes[0].innerText.includes(twitterAccount)) {
                        TwitterNodeList[i].scrollIntoView();
                        TwitterNodeList[i].focus();
                        //console.log(TwitterNodeList[i]);
                        await simulate(TwitterNodeList[i], "mousemove");
                        console.log("clicking");
                        await simulate(TwitterNodeList[i], "mousedown");
                        await simulate(TwitterNodeList[i], "mouseup");
                    }
                }
            }
        }


    });

}

async function getTwitterList(twitterHandle, selector) {
    while (checkTwitterList(selector)) { //TODO Refactor endless cycle
        console.log("opening twitter list");
        await simulate(twitterHandle, "mouseup");
        await simulate(twitterHandle, "mousedown");
        //await new Promise(resolve => setTimeout(resolve, 1000));
        await rafAsync();
    }
    console.log("getTwitterList finished");

}

async function getTwitterHandle(selector) {
    let twitterHandle = await checkElements(selector).then(async function handlefunc(element) {
        let list = document.querySelectorAll(selector);
        console.log(list);
        let handle;
        for (let i = 0; i < list.length; ++i) {
            if (list[i].offsetWidth > 0 && list[i].offsetHeight > 0) {
                handle = list[i].querySelectorAll("button")[0];
            }
        }
        if (handle == null) {
            console.log("twitterHandle is null");
            await rafAsync();
            return await handlefunc(); //TODO refactor this
        } else {
            console.log("twitterHandle returned ", handle);
            return handle;
        }
    });
    console.log(twitterHandle);
    return twitterHandle;
}

async function checkElements(selector) {
    while (document.querySelectorAll(selector) === null) {
        await rafAsync()
    }
    return document.querySelectorAll(selector);
}

function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

async function simulate(element, eventName) {
    const options = extend(defaultOptions, arguments[2] || {});
    let oEvent, eventType = null;
    console.log("enter simulate function");
    for (let name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) {
            eventType = name;
            //console.log("simulate function break!");
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
        let evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    console.log("exit simulate function");
    console.log(element);
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

async function changeWorkspaceFocus(workspace) {
    console.log(`changeWorkspaceFocus`);
    if (workspace.tagName === 'DIV') {
        const style = workspace.getAttribute('style');
        console.log(workspace);
        if (!style || !style.match('.*display:\\s*none;.*')) {
            console.log(`setAccount`);
            await setAccount();
        }
    }
};


async function workspaceHook(mutations) {
    await mutations.forEach(async mutation => {
        await mutation.addedNodes.forEach(async node => {
            console.log(`Hook`);
            await changeWorkspaceFocus(node);
            const observer = await new MutationObserver(workspaceWatcher);
            await observer.observe(node, {attributes: true, attributeFilter: ['style']});
        });
    });
};

async function workspaceWatcher(mutations) {
    await mutations.forEach(async mutation => {
        await changeWorkspaceFocus(mutation.target);
        console.log(`Watcher`);
    });
};

async function mutationLoader() {
    console.log(`Loader`);
    const mainPanes = document.getElementById('main_panes');
    if (mainPanes) {
        console.log(mainPanes);
        const observer = await new MutationObserver(workspaceHook);
        await observer.observe(mainPanes, {childList: true});
        await mainPanes.childNodes.forEach(async x => {
            await changeWorkspaceFocus(x);
        });
    } else {
        window.setTimeout(mutationLoader, 1000);
    }
    return true;
};

mutationLoader().then((result) => {
    if (result) {
        console.info("mutation loader finished");
    } else {
        console.info("error");
    }
});
;
