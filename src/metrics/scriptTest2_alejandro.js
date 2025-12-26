import html2canvas from "./html2canvas";
import $ from "jquery";

const EVENT_ON_MOUSE_MOVE = 0;
const EVENT_ON_TOUCH_MOVE = 7;
const EVENT_ON_CLICK = 1;
const EVENT_ON_DOUBLE_CLICK = 2;
const EVENT_ON_MOUSE_DOWN = 3;
const EVENT_ON_MOUSE_UP = 4;
const EVENT_ON_WHEEL = 5;
const EVENT_CONTEXT_MENU = 6;
const EVENT_WINDOW_SCROLL = 11;
const EVENT_WINDOW_RESIZE = 12;
const EVENT_KEY_DOWN = 13;
const EVENT_KEY_PRESS = 14;
const EVENT_KEY_UP = 15;
const EVENT_FOCUS = 16;
const EVENT_BLUR = 17;
const EVENT_ON_CHANGE_SELECTION_OBJECT = 18;
const EVENT_ON_CLICK_SELECTION_OBJECT = 19;
const EVENT_INIT_TRACKING = 100;
const EVENT_TRACKING_END = 200;
const COMPONENT_COMBOBOX = 2;
const COMPONENT_OPTION = 3;

let user = createUser();

let list = [];
let sceneId = 0;
let eventCounter = 0;
let trackingOn = false;
let TOP_LIMIT = 500;
let sentRequest = 0;
let pendingRequest = 0;

let pendingBackgroundsDelivered = 0;
let backgroundsDelivered = 0;
let eventsDelivered = false;
let finishedExperiment = false;

let newPage = null;
let elements = [];
let emittingData = false;

let idExperiment = 25;
let urlBase = "https://interactionlab.hci.uniovi.es:8443";

let url = urlBase + "/TrackerServer/restws/track";
let urlBackgroundTracker = urlBase + "/TrackerServer/restws/backgroundTracker";
let urlRegisterComponent = urlBase + "/TrackerServer/restws/registerComponent";
let urlRegisterUserData = urlBase + "/TrackerServer/restws/registerUserData";
let urlDemographicData = urlBase + "/TrackerServer/restws/registerDemographicData";
let urlExperimentStatus = urlBase + "/TrackerServer/restws/experiment/status/" + idExperiment;

export function startExperiment() {
    //We create a new user
    user = createUser();
    console.log("Creating user session " + user);
}

export function finishExperiment() {
    //We flag the end of the experiment
    finishedExperiment = true;
}

function takeSnapshot(sceneId) {
    html2canvas(document.body).then(canvas => {
        console.log("Delivering background for scene " + sceneId);
        deliverSnapshot(sceneId, canvas);
    });
}

function deliverSnapshot(sceneId, canvas) {

    let parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "experiment": idExperiment,
        "sceneId": sceneId,
        "canvas": canvas.toDataURL("image/png"),
        "timeStamp": Date.now(),
        "sessionId": user
    };

    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros), url: urlBackgroundTracker, type: "post", beforeSend: function () {
                //We incremente the pendingbackgroundsdelivered number
                pendingBackgroundsDelivered++;
                console.log("Sending background. Pending backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
            }, success: function (response) {
                pendingBackgroundsDelivered--;
                backgroundsDelivered++;
                console.log("Result: " + response);
                console.log("Pending Backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
            }, complete: function (jqXHR, textStatus) {
                console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
                //checkReadyToLeave();
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                //alert("Status: " + textStatus); alert("Error: " + errorThrown);
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            }
        }).always(function (jqXHR, textStatus) {
            if (textStatus !== "success") {
                alert("ERROR: " + jqXHR.statusText);
            }
        });
    }
}

function getDate() {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    return (`${month}${day}${year}`);
}

function createUser() {
    if (localStorage.getItem("user") === null || localStorage.getItem("user") === undefined) {
        let lettrs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        localStorage.setItem("user", lettrs[Math.floor(Math.random() * lettrs.length)] + lettrs[Math.floor(Math.random() * lettrs.length)] + lettrs[Math.floor(Math.random() * lettrs.length)] + (Math.floor(Math.random() * (999999999999 - 100000000000)) + 100000000000).toString() + Date.now().toString() + getDate());
    }
    return localStorage.getItem("user");
}

export function registerUserData() {
    let parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "timeOpened": new Date(),
        "pageon": window.location.pathname,
        "referrer": document.referrer,
        "previousSites": window.history.length,
        "browserName": navigator.appName,
        "browserEngine": navigator.product,
        "browserVersion1a": navigator.appVersion,
        "browserVersion1b": navigator.userAgent,
        "browserLanguage": navigator.language,
        "browserOnline": navigator.onLine,
        "browserPlatform": navigator.platform,
        "javaEnabled": navigator.javaEnabled(),
        "dataCookiesEnabled": navigator.cookieEnabled,
        "dataCookies1": document.cookie,
        "dataCookies2": decodeURIComponent(document.cookie.split(";")),
        "sizeScreenW": window.screen.width,
        "sizeScreenH": window.screen.height,
        "sizeDocW": document.body.clientWidth,
        "sizeDocH": document.body.clientHeight,
        "sizeInW": window.innerWidth,
        "sizeInH": window.innerHeight,
        "sizeAvailW": window.screen.availWidth,
        "sizeAvailH": window.screen.availHeight,
        "scrColorDepth": window.screen.colorDepth,
        "scrPixelDepth": window.screen.pixelDepth,
        "idExperiment": idExperiment,
        "sessionId": user
    };
    $.ajax({
        data: JSON.stringify(parametros), url: urlRegisterUserData, type: "post", beforeSend: function () {
            $("#resultado").html("Registering user data...");
        }, success: function (response) {
            $("#result").html(response);
        }, async: false
    });
}

class Element {
    constructor(id, x, y, xF, yF, sceneId) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.xF = xF;
        this.yF = yF;
        this.sceneId = sceneId;
    }

    getScene() {
        return this.sceneId;
    }

    isOver(mX, mY) {
        return this.x < mX && mX < this.xF && this.y < mY && mY < this.yF;
    }
}

function detectElement(x, y) {
    let found = -1;
    elements.forEach(function (entry) {
        if (entry.isOver(x, y) && entry.getScene() === sceneId) {
            found = entry.id;
        }
    });
    return found;
}

function detectElementByName(name) {
    let found = -1;
    elements.forEach(function (entry) {
        if (entry.id === name && entry.getScene() === sceneId) {
            found = entry.id;
        }
    });
    return found;
}

export function registerElement(id, x, y, xF, yF, typeId, sceneId) {
    elements.push(new Element(id, x, y, xF, yF, sceneId));
    addFocusAndBlurEvents(id);
    if (typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION) {
        addSelectionEvent(id);
    }
}

function addFocusAndBlurEvents(elementId) {
    let element = document.getElementById(elementId);
    if (element !== undefined && element != null) {
        element.addEventListener("focus", function (event) {
            trackFocusEvent(event);
        });
        element.addEventListener("blur", function (event) {
            trackBlurEvent(event);
        });
    }
}

function addSelectionEvent(elementId) {
    let element = document.getElementById(elementId);
    if (element !== undefined && element != null) {
        element.addEventListener("change", function (event) {
            trackOnChangeSelectionEvent(event);
        });
        element.addEventListener("click", function (event) {
            trackOnClickSelectionEvent(event);
        });
    }
}

function trackWithEvent(eventType, event) {
    if (trackingOn) {
        trackEventOverElement(eventType, -1, event);
    }
}

function trackEvent(eventType) {
    if (trackingOn) {
        trackEventOverElement(eventType, -1, null);
    }
}

function trackEventOverElement(eventType, elementId, event) {
    let item = {};
    item.id = eventCounter++;
    item.sceneId = sceneId;
    item.eventType = eventType;
    item.timeStamp = Date.now();
    if (eventType === EVENT_ON_TOUCH_MOVE) {
        item.x = event.changedTouches[0].clientX;
        item.y = event.changedTouches[0].clientY;
    } else if (window.event !== undefined) {
        item.x = window.event.clientX;
        item.y = window.event.clientY;
    } else {
        item.x = 0;
        item.y = 0;
    }

    if (item.x == null) {
        item.x = -1;
    }
    if (item.y == null) {
        item.y = -1;
    }

    item.keyValueEvent = -1;
    item.keyCodeEvent = -1;

    if (eventType === EVENT_KEY_DOWN || eventType === EVENT_KEY_PRESS || eventType === EVENT_KEY_UP) {
        item.keyValueEvent = event.key;
        item.keyCodeEvent = event.keyCode;
        item.elementId = detectElementByName(event.target.id);
    } else if (eventType === EVENT_FOCUS || eventType === EVENT_BLUR) {
        item.elementId = detectElementByName(event.target.id);
    } else if (eventType === EVENT_ON_CHANGE_SELECTION_OBJECT) {
        item.elementId = detectElementByName(event.target.id);
    } else if (eventType === EVENT_ON_CLICK_SELECTION_OBJECT) {
        item.elementId = detectElementByName(event.target.id);
    } else {
        item.elementId = detectElement(item.x, item.y);
    }

    list[list.length] = item;

    if (list.length >= TOP_LIMIT) {
        let deliverPackage = list;
        list = [];
        deliverData(deliverPackage);
    }
}

export function initTracking(_sceneId) {
    trackingOn = true;
    getExperimentStatus();
    sceneId = _sceneId;
    console.log("Initializing tracking for scene " + _sceneId);

    trackEvent(EVENT_INIT_TRACKING);
    window.parent.addEventListener("scroll", function () {
        trackWindowScroll();
    });
    window.parent.addEventListener("resize", function () {
        trackWindowResize();
    });
    window.parent.addEventListener("mousemove", function () {
        trackMouseMovement();
    });
    window.parent.addEventListener("touchmove", function (event) {
        trackTouchMovement(event);
    });
    window.parent.addEventListener("mousedown", function () {
        trackMouseDown();
    });
    window.parent.addEventListener("mouseup", function () {
        trackMouseUp();
    });
    window.parent.addEventListener("click", function () {
        trackClick();
    });
    window.parent.addEventListener("dblclick", function () {
        trackDblclick();
    });
    window.parent.addEventListener("contextmenu", function () {
        trackContextmenu();
    });
    window.parent.addEventListener("wheel", function () {
        trackWheel();
    });
    window.parent.addEventListener("keydown", function (event) {
        trackEventKeydown(event);
    });
    window.parent.addEventListener("keypress", function (event) {
        trackEventKeypress(event);
    });
    window.parent.addEventListener("keyup", function (event) {
        trackEventKeyup(event);
    });
}

function trackMouseMovement() {
    trackEvent(EVENT_ON_MOUSE_MOVE);
}

function trackTouchMovement(event) {
    trackWithEvent(EVENT_ON_TOUCH_MOVE, event);
}

function trackClick() {
    trackEvent(EVENT_ON_CLICK);
}

function trackDblclick() {
    trackEvent(EVENT_ON_DOUBLE_CLICK);
}

function trackMouseDown() {
    trackEvent(EVENT_ON_MOUSE_DOWN);
}

function trackMouseUp() {
    trackEvent(EVENT_ON_MOUSE_UP);
}

function trackWheel() {
    trackEvent(EVENT_ON_WHEEL);
}

function trackContextmenu() {
    trackEvent(EVENT_CONTEXT_MENU);
}

function trackWindowScroll() {
    trackEvent(EVENT_WINDOW_SCROLL);
}

function trackWindowResize() {
    trackEvent(EVENT_WINDOW_RESIZE);
}

function trackEventKeydown(event) {
    trackWithEvent(EVENT_KEY_DOWN, event);
}

function trackEventKeypress(event) {
    trackWithEvent(EVENT_KEY_PRESS, event);
}

function trackEventKeyup(event) {
    trackWithEvent(EVENT_KEY_UP, event);
}

function trackFocusEvent(event) {
    trackWithEvent(EVENT_FOCUS, event);
}

function trackBlurEvent(event) {
    trackWithEvent(EVENT_BLUR, event);
}

function trackOnChangeSelectionEvent(event) {
    trackWithEvent(EVENT_ON_CHANGE_SELECTION_OBJECT, event);
}

function trackOnClickSelectionEvent(event) {
    trackWithEvent(EVENT_ON_CLICK_SELECTION_OBJECT, event);
}

export function finishTracking(_newPage) {
    trackEvent(EVENT_TRACKING_END);
    trackingOn = false;

    //We take the snapshot.
    takeSnapshot(sceneId);

    deliverData(list);
    list = [];
    newPage = _newPage;
    checkReadyToLeave();
}

function checkReadyToLeave() {

    if (eventsDelivered === false || pendingRequest > 0) {
        console.log("Not ready to leave page, events still pending");
    } else {
        //Events are delivered, we wait for the background delivery
        if (pendingBackgroundsDelivered > 0) {
            console.log("Not ready to leave page, " + pendingBackgroundsDelivered + " backgrounds still pending");
            setTimeout(() => {
                checkReadyToLeave();
            }, 2000);
            return;
        }

        console.log("Ready to leave page, pending request:" + pendingRequest + ", pending backgrounds " + pendingBackgroundsDelivered + "/" + backgroundsDelivered);
        if (finishedExperiment) {
            //We delete the user
            console.log("Experiment finished, deleting user " + localStorage.getItem("user"));
            localStorage.removeItem("user");
        }
        /*if (newPage != null) {
            window.location.href = newPage;
        }*/
    }

}

export function finishSubsceneTracking() {
    trackEvent(EVENT_TRACKING_END);
    trackingOn = false;
    //We take the snapshot
    takeSnapshot(sceneId);
}

export function registerComponent(sceneId, componentId, x, y, xF, yF, typeId, componentAssociated) {
    registerElement(componentId, x, y, xF, yF, typeId, sceneId);
    let parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "sceneId": sceneId,
        "componentId": componentId,
        "x": Math.round(x),
        "y": Math.round(y),
        "xF": Math.round(xF),
        "yF": Math.round(yF),
        "timeStamp": Date.now(),
        "idExperiment": idExperiment,
        "typeId": typeId,
        "componentAssociated": componentAssociated,
        "sessionId": user
    };

    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros), url: urlRegisterComponent, type: "post", beforeSend: function () {

            }, success: function (response) {

            }
        });
    }
}

function deliverChunk(chunk) {
    let parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "list": chunk,
        "idExperiment": idExperiment,
        "sessionId": user
    };

    if (emittingData) {
        $.ajax({
            data: JSON.stringify(parametros), url: url, type: "post", beforeSend: function () {
                pendingRequest++;
                sentRequest++;
                console.log("Sending request. Pending requests: " + pendingRequest + "/" + sentRequest);
            }, success: function (response) {
                console.log("Result: " + response);
                console.log("Pending Requests: " + pendingRequest + "/" + sentRequest);
            }, complete: function (jqXHR, textStatus) {
                pendingRequest--;
                console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);

                if (pendingRequest === 0) {
                    eventsDelivered = true;
                }
                checkReadyToLeave();
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus);
                alert("Error: " + errorThrown);
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            }
        }).always(function (jqXHR, textStatus) {
            if (textStatus !== "success") {
                alert("ERROR: " + jqXHR.statusText);
            }
        });
    }
}

function deliverData(list) {
    let i = 0;
    let chunk = [];
    let chunkCounter = 0;
    list.forEach(myFunction);

    function myFunction(item, _index) {
        chunk[i] = item;
        i++;
        if (i >= TOP_LIMIT) {
            i = 0;
            deliverChunk(chunk);
            chunkCounter++;
            chunk = [];
        }
    }

    deliverChunk(chunk);
    chunkCounter++;
    chunk = [];
}

function getTracking(sessionId, sceneId) {
    let parametros = {
        "sessionId": sessionId, "sceneId": sceneId, "idExperiment": idExperiment
    };

    if (emittingData) {
        $.ajax({
            data: parametros, url: url, type: "get", beforeSend: function () {
                $("#result").html("Procesando, espere por favor...");
            }, success: function (response) {
                $("#result").html(response);
                paintTracking(response);
            }
        });
    }
}

export function showTrace(sessionId, sceneId) {
    getBackground(sessionId, sceneId);
    getTracking(sessionId, sceneId);

}

function getBackground(sessionId, sceneId) {
    let parametros = {
        "sessionId": sessionId, "sceneId": sceneId, "idExperiment": idExperiment
    };
    if (emittingData) {
        $.ajax({
            data: parametros, url: urlBackgroundTracker, type: "get", beforeSend: function () {
                $("#result").html("Procesando, espere por favor...");
            }, success: function (response) {
                let img = new Image();
                img.src = response;

                let canvas = document.getElementById("myCanvas");
                let ctx = canvas.getContext("2d");
                img.onload = function () {
                    if (ctx) {
                        canvas.width = img.width;
                        canvas.height = img.height;

                        ctx.drawImage(img, 0, 0);
                    }
                };
            }
        });
    }
}

function getExperimentStatus() {

    $.ajax({
        url: urlExperimentStatus, type: "get", success: function (response) {
            emittingData = response === "OPEN";
        }, error: function () {
        }
    });
}

function paintTracking(response) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");

    let responseJSON = JSON.parse(response);

    responseJSON.list.forEach(paintPoint);

    function paintPoint(item, _index) {
        ctx.beginPath();
        ctx.arc(item["x"], item["y"], 1, 0, 2 * Math.PI);
        ctx.strokeStyle = getColor(item["eventType"]);
        ctx.stroke();
    }
}

function getColor(eventType) {
    switch (eventType) {
        case EVENT_ON_MOUSE_MOVE:
            return "#FF0000";
        case EVENT_ON_CLICK:
            return "#FFF000";
        case 2:
            return "#FFFF00";
        case 3:
            return "#FFFFF0";
        case 4:
            return "#FF00FF";
        case EVENT_INIT_TRACKING:
            return "#74FF33";
        case EVENT_TRACKING_END:
            return "#336BFF";
        default:
            return "#000F00";
    }
}

function postNumberDD(id, value) {
    let parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "id": id,
        "numberValue": value,
        "idExperiment": idExperiment,
        "sessionId": user
    };
    postAJAXDemographicData(parametros);
}

function postStringDD(id, value) {
    let parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "id": id,
        "stringValue": value,
        "idExperiment": idExperiment,
        "sessionId": user
    };
    postAJAXDemographicData(parametros);
}

function postDateDD(id, value) {
    let parametros = {
        "timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
        "id": id,
        "dateValue": value,
        "idExperiment": idExperiment,
        "sessionId": user
    };
    postAJAXDemographicData(parametros);
}

function postAJAXDemographicData(parametros) {
    //if (emittingData) {
    $.ajax({
        data: JSON.stringify(parametros), url: urlDemographicData, type: "post", success: function (response) {
        }, error: function () {
        }
    });
    //}
}

export function registerID(value) {
    postStringDD(59, value);
}