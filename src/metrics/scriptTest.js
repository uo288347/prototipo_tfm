
import html2canvas from "html2canvas";
import $ from "jquery";

const VERSION = 3;

const EVENT_ON_POINTER_DOWN = 20;
const EVENT_ON_POINTER_UP = 21;
const EVENT_ON_POINTER_MOVE = 22;
const EVENT_ON_POINTER_CANCEL = 23;
const EVENT_ON_MOUSE_MOVE = 0;
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
const EVENT_TRACKIND_END = 200;
const COMPONENT_TEXT_FIELD = 1;
const COMPONENT_COMBOBOX = 2;
const COMPONENT_OPTION = 3;
const COMPONENT_RADIO_BUTTON = 4;
const COMPONENT_CHECK_BOX = 5;
const COMPONENT_BUTTON = 6;
const COMPONENT_CARD = 7;
const COMPONENT_RATE = 8;
const COMPONENT_IMAGE = 9;
const COMPONENT_STEPPER = 10;
const COMPONENT_CAROUSEL = 11;
const COMPONENT_LINK = 12;
const COMPONENT_BANNER = 13;
const COMPONENT_TOUR = 14;

//const user = createUser();
var user = null;

function getUser() {
	if (user === null && typeof window !== "undefined" && typeof localStorage !== "undefined") {
		user = createUser();
	}
	return user;
}

function getCurrentSceneId() {
	//console.log("CURRENT SCENE ID: " + sceneId);
	return sceneId;
}


var list = [];
var sceneId = 0;
var eventCounter = 0;
var trackingOn = false;
var TOP_LIMIT = 50;
var sentRequest = 0;
var pendingRequest = 0;

var listenersInitialized = false;
var activeScene = null;

var pendingBackgroundsDelivered = 0;
var backgroundsDelivered = 0;
var eventsDelivered = false;
var finishedExperiment = false;

var lastPointerX = null;
var lastPointerY = null;

var newPage = null;
var elements = [];
var emittingData = true;

var idExperiment = 42;
var urlBase = 'https://interactionlab.hci.uniovi.es:8443'

var url = urlBase + '/TrackerServer/restws/track';
var urlBackgroundTracker = urlBase + '/TrackerServer/restws/backgroundTracker';
var urlRegisterComponent = urlBase + '/TrackerServer/restws/registerComponent';
var urlRegisterUserData = urlBase + '/TrackerServer/restws/registerUserData';
var urlDemographicData = urlBase + '/TrackerServer/restws/registerDemographicData';
var urlExperimentStatus = urlBase + '/TrackerServer/restws/experiment/status/' + idExperiment;


function startExperiment() {
	//We create a new user
	var user = createUser();
	console.log("Creating user session " + user);
}

function finishExperiment() {
	//We flag the end of the experiment
	finishedExperiment = true;
}

function takeSnapshot(sceneId) {
	// Use requestIdleCallback to avoid blocking navigation
	const doSnapshot = () => {
		html2canvas(document.body, {
			logging: false,
			useCORS: true,
			// Optimizaciones para mejorar el rendimiento
			scale: 0.5, // Reducir la escala a la mitad
			allowTaint: true,
			backgroundColor: '#ffffff'
		}).then(canvas => {
			deliverSnapshot(sceneId, canvas);
		}).catch(err => {
			console.log("Snapshot error: " + err);
		});
	};

	// Usar un delay más largo para asegurar que la navegación se complete primero
	if (typeof requestIdleCallback !== 'undefined') {
		requestIdleCallback(doSnapshot, { timeout: 5000 });
	} else {
		setTimeout(doSnapshot, 500); // Aumentado de 100ms a 500ms
	}
}

function deliverSnapshot(sceneId, canvas) {

	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"experiment": idExperiment,
		"sceneId": sceneId,
		"canvas": canvas.toDataURL("image/png"),
		"timeStamp": Date.now(),
		"sessionId": user
	};

	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: urlBackgroundTracker,
			type: 'post',
			beforeSend: function () {
				//We incremente the pendingbackgroundsdelivered number
				pendingBackgroundsDelivered++;
				//console.log("Sending background. Pending backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
			},
			success: function (response) {
				pendingBackgroundsDelivered--;
				backgroundsDelivered++;
				//console.log('Result: ' + response);
				//console.log("Pending Backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
			},
			complete: function (jqXHR, textStatus) {
				//console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
				//checkReadyToLeave();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//alert("Status: " + textStatus); alert("Error: " + errorThrown);
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		}).always(function (jqXHR, textStatus) {
			if (textStatus != "success") {
				alert("ERROR: " + jqXHR.statusText);
			}
		});
	}
}

function getDate() {
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1;
	var year = today.getFullYear();
	return (`${month}${day}${year}`);
}


function createUser() {
	if (localStorage.getItem("user") === null || localStorage.getItem("user") === undefined) {
		let lettrs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		localStorage.setItem("user",
			lettrs[Math.floor(Math.random() * lettrs.length)] +
			lettrs[Math.floor(Math.random() * lettrs.length)] +
			lettrs[Math.floor(Math.random() * lettrs.length)] +
			(Math.floor(Math.random() * (999999999999 - 100000000000)) + 100000000000).toString() +
			Date.now().toString() + getDate()
		);
	}
	return localStorage.getItem("user");
}

function registerUserData() {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"timeOpened": new Date(),
		"pageon": window.location.pathname,
		"referrer": document.referrer,
		"previousSites": history.length,
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
		"sizeScreenW": screen.width,
		"sizeScreenH": screen.height,
		"sizeDocW": document.body.clientWidth,
		"sizeDocH": document.body.clientHeight,
		"sizeInW": innerWidth,
		"sizeInH": innerHeight,
		"sizeAvailW": screen.availWidth,
		"sizeAvailH": screen.availHeight,
		"scrColorDepth": screen.colorDepth,
		"scrPixelDepth": screen.pixelDepth,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: urlRegisterUserData,
			type: 'post',
			beforeSend: function () {
			},
			success: function (response) {
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log("registerUserData error: " + textStatus);
			}
		});
	}
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
		if (this.x < mX && mX < this.xF && this.y < mY && mY < this.yF) {
			return true;
		}
		else {
			return false;
		}
	}
}

function isVisible(elementId) {
	//console.log("Checking visibility for element: " + elementId);
	const el = document.getElementById(elementId);
	// 1. Verificar si el elemento existe en el DOM actual
	if (!el) {
		//console.log("Element " + elementId + " does not exist in the current DOM.");
		return false;
	}
	// 2. Verificar si el elemento está realmente conectado al documento
	// Esto detecta elementos que fueron removidos del DOM pero aún existen en memoria
	if (!document.body.contains(el)) {
		//console.log("Element " + elementId + " is not in the current DOM.");
		return false;
	}

	// 3. Verificar estilos CSS
	const style = window.getComputedStyle(el);
	if (style.display === "none" || style.visibility === "hidden" || el.offsetParent === null) {
		//console.log("Element " + elementId + " is hidden by CSS.");
		return false;
	}

	// 4. Verificar si el elemento está en el viewport visible
	const rect = el.getBoundingClientRect();
	const isInViewport = (
		rect.top < window.innerHeight &&
		rect.bottom > 0 &&
		rect.left < window.innerWidth &&
		rect.right > 0 &&
		rect.width > 0 &&
		rect.height > 0
	);

	//console.log("Element " + elementId + " is " + (isInViewport ? "visible" : "not visible") + " in the viewport.");
	return isInViewport;
}

function detectElement(x, y) {
	//console.log("[by position] Detecting element at position: " + x + "," + y);
	var found = -1;
	elements.forEach(function (entry) {
		if (entry.isOver(x, y) && isVisible(entry.id)) { /*(entry.getScene() === sceneId ||*/
			found = entry.id;
		}
	});
	return found;
}

function detectElementByName(name) {
	//console.log("[by name] Detecting element by name: " + name);
	var found = -1;
	elements.forEach(function (entry) {
		if (entry.id === name && isVisible(entry.id)) { /* && (entry.getScene() === sceneId ||*/
			found = entry.id;
		}
	});
	return found;
}

function registerElement(id, x, y, xF, yF, typeId, sceneId) {
	//console.log("{id: " + id + ", x: " + x + ", y: " + y + ", xF: " + xF + ", yF: " + yF + ", typeId: " + typeId + ", sceneId: " + sceneId + "}");
	elements.push(new Element(id, x, y, xF, yF, sceneId));
	addFocusAndBlurEvents(id);
	if (typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION) {
		addSelectionEvent(id);
	}
}

function addFocusAndBlurEvents(elementId) {
	var element = document.getElementById(elementId);
	if (element != undefined && element != null) {
		element.addEventListener('focus', function (event) {
			trackFocusEvent(event);
		});
		element.addEventListener('blur', function (event) {
			trackBlurEvent(event);
		});
	}
}

function addSelectionEvent(elementId) {
	var element = document.getElementById(elementId);
	if (element != undefined && element != null) {
		element.addEventListener('change', function (event) {
			trackOnChangeSelectionEvent(event);
		});
		element.addEventListener('click', function (event) {
			trackOnClickSelectionEvent(event);
		});
	}
}

function trackWithEvent(eventType, event) {
	if (trackingOn) {
		if (eventType === EVENT_ON_POINTER_MOVE) {
			const cx = event.clientX;
			const cy = event.clientY;
			if (lastPointerX !== null && lastPointerY !== null) {
				if (cx === lastPointerX && cy === lastPointerY) {
					return; // Sin movimiento, ignorar
				}
			}
			lastPointerX = cx;
			lastPointerY = cy;
		}
		trackEventOverElement(eventType, -1, event);
	}
}

function trackEvent(eventType) {
	if (trackingOn) {
		trackEventOverElement(eventType, -1, null);
	}
}

function trackEventOverElement(eventType, elementId, event) {
	//console.log(`[trackEventOverElement] Tracking event type ${eventType} over element ${elementId}`);
	var item = new Object();
	item.id = eventCounter++;
	item.sceneId = sceneId;
	item.eventType = eventType;
	item.timeStamp = Date.now();
	if (event && typeof event.clientX === "number" && typeof event.clientY === "number") {
		/*item.x = Math.round(event.clientX);
		item.y = Math.round(event.clientY);*/

		// Obtener scroll del ManualScrollEngine si existe
		let scrollX = 0;
		let scrollY = 0;

		if (typeof window !== "undefined" && window.__currentScrollEngine) {
			const scrollOffset = window.__currentScrollEngine.getScrollOffset();
			scrollX = scrollOffset.x;
			scrollY = scrollOffset.y;
			console.log(`Using ManualScrollEngine offset: scrollX=${scrollX}, scrollY=${scrollY}`);
		} else {
			console.log("No ManualScrollEngine detected, using window scroll.");
			// Fallback a scroll nativo si no hay ManualScrollEngine
			scrollX = window.scrollX || 0;
			scrollY = window.scrollY || 0;
		}

		// Coordenadas absolutas (viewport + scroll manual)
		item.x = Math.round(event.clientX + scrollX);
		item.y = Math.round(event.clientY + scrollY);

		// Coordenadas del viewport (sin scroll)
		item.clientX = Math.round(event.clientX);
		item.clientY = Math.round(event.clientY);

		// Información del viewport para normalización
		item.viewportWidth = window.innerWidth;
		item.viewportHeight = window.innerHeight;

		// Scroll actual (manual o nativo)
		item.scrollX = Math.round(scrollX);
		item.scrollY = Math.round(scrollY);
	}
	else {
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
	item.pointerId = (event && event.pointerId !== undefined) ? event.pointerId : -1;
	item.isPrimary = (event && event.isPrimary !== undefined) ? event.isPrimary : null;

	// Unificar obtención de elementId
	if (event && event.target && event.target.id) {
		item.elementId = detectElementByName(event.target.id);
	} else {
		item.elementId = detectElement(item.x, item.y);
	}
	if (eventType == EVENT_KEY_DOWN || eventType == EVENT_KEY_PRESS || eventType == EVENT_KEY_UP) {
		item.keyValueEvent = event.key;
		item.keyCodeEvent = event.keyCode;
	}
	/*
	if (eventType == EVENT_KEY_DOWN || eventType == EVENT_KEY_PRESS || eventType == EVENT_KEY_UP) {
		item.keyValueEvent = event.key;
		item.keyCodeEvent = event.keyCode;
		item.elementId = detectElementByName(event.target.id);
	}
	else if (eventType == EVENT_FOCUS || eventType == EVENT_BLUR) {
		item.elementId = detectElementByName(event.target.id);
	}
	else if (eventType == EVENT_ON_CHANGE_SELECTION_OBJECT) {
		item.elementId = detectElementByName(event.target.id);
	}
	else if (eventType == EVENT_ON_CLICK_SELECTION_OBJECT) {
		item.elementId = detectElementByName(event.target.id);
	}
	else {
		item.elementId = detectElement(item.x, item.y);
	}*/

	console.log(item);
	list[list.length] = item;

	if (list.length >= TOP_LIMIT) {
		var deliverPackage = list;
		list = [];
		deliverData(deliverPackage);
	}
}

function initTracking(_sceneId) {
	if (activeScene === _sceneId) return;
	activeScene = _sceneId;
	trackingOn = true;
	getExperimentStatus();
	sceneId = _sceneId;
	console.log("Initializing tracking for scene " + _sceneId);

	if (!listenersInitialized) {
		initializeGlobalListeners();
		listenersInitialized = true;
	}

	trackEvent(EVENT_INIT_TRACKING);
}

function initializeGlobalListeners() {
	document.addEventListener('pointerdown', function (event) {
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		trackWithEvent(EVENT_ON_POINTER_DOWN, event);
	});

	document.addEventListener('pointermove', function (event) {
		trackWithEvent(EVENT_ON_POINTER_MOVE, event);
	});

	document.addEventListener('pointerup', function (event) {
		trackWithEvent(EVENT_ON_POINTER_UP, event);
	});

	document.addEventListener('pointercancel', function (event) {
		trackWithEvent(EVENT_ON_POINTER_CANCEL, event);
	});

	document.addEventListener('keydown', function (event) {
		trackWithEvent(EVENT_KEY_DOWN, event);
	});

	document.addEventListener('keyup', function (event) {
		trackWithEvent(EVENT_KEY_UP, event);
	});
}

function trackMouseMovement() {
	trackEvent(EVENT_ON_MOUSE_MOVE);
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
	trackWithEvent(EVENT_KEY_DOWN, event)
}

function trackEventKeypress(event) {
	trackWithEvent(EVENT_KEY_PRESS, event)
}

function trackEventKeyup(event) {
	trackWithEvent(EVENT_KEY_UP, event)
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

function finishTracking(_newPage) {
	console.log("Finishing tracking for scene " + sceneId);
	activeScene = null;
	trackEvent(EVENT_TRACKIND_END);
	trackingOn = false;

	//We take the snapshot.
	takeSnapshot(sceneId);

	deliverData(list);
	list = [];
	newPage = _newPage;
	checkReadyToLeave();
}


function checkReadyToLeave() {

	if (eventsDelivered == false || pendingRequest > 0) {
		//console.log("Not ready to leave page, events still pending");
	}
	else {
		//Events are delivered, we wait for the background delivery
		if (pendingBackgroundsDelivered > 0) {
			//console.log("Not ready to leave page, " + pendingBackgroundsDelivered + " backgrounds still pending");
			setTimeout(() => {
				checkReadyToLeave();
			}, 2000);
			return;
		}

		//console.log("Ready to leave page, pending request:" + pendingRequest + ", pending backgrounds " + pendingBackgroundsDelivered + "/" + backgroundsDelivered);
		if (finishedExperiment) {
			//We delete the user
			console.log("Experiment finished, deleting user " + localStorage.getItem("user"));
			localStorage.removeItem("user");
		}
		if (newPage != null) {
			window.location.href = newPage;
		}
	}

}

function finishSubsceneTracking() {
	console.log("Finishing subscene tracking for scene " + sceneId);
	trackEvent(EVENT_TRACKIND_END);
	trackingOn = false;
	//We take the snapshot
	takeSnapshot(sceneId);
}

function registerComponent(sceneId, componentId, x, y, xF, yF, typeId, componentAssociated) {
	registerElement(componentId, x, y, xF, yF, typeId, sceneId);
	var parametros = {
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
			data: JSON.stringify(parametros),
			url: urlRegisterComponent,
			type: 'post',
			beforeSend: function () {

			},
			success: function (response) {

			}
		});
	}
}

function deliverChunk(chunk) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"list": chunk,
		"idExperiment": idExperiment,
		"sessionId": user
	};

	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: url,
			type: 'post',
			beforeSend: function () {
				pendingRequest++;
				sentRequest++;
				//console.log("Sending request. Pending requests: " + pendingRequest + "/" + sentRequest);
			},
			success: function (response) {
				//console.log('Result: ' + response);
				//console.log("Pending Requests: " + pendingRequest + "/" + sentRequest);
			},
			complete: function (jqXHR, textStatus) {
				pendingRequest--;
				//console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);

				if (pendingRequest == 0) {
					eventsDelivered = true;
				}
				checkReadyToLeave();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Status: " + textStatus); alert("Error: " + errorThrown);
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		}).always(function (jqXHR, textStatus) {
			if (textStatus != "success") {
				alert("ERROR: " + jqXHR.statusText);
			}
		});
	}
}

function deliverData(list) {
	var i = 0;
	var chunk = [];
	var chunkCounter = 0;
	list.forEach(myFunction);
	function myFunction(item, index) {
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
	var parametros = {
		"sessionId": sessionId,
		"sceneId": sceneId,
		"idExperiment": idExperiment
	};

	if (emittingData) {
		$.ajax({
			data: parametros,
			url: url,
			type: 'get',
			beforeSend: function () {
				$("#result").html("Procesando, espere por favor...");
			},
			success: function (response) {
				$("#result").html(response);
				paintTracking(response);
			}
		});
	}
}

function showTrace(sessionId, sceneId) {
	getBackground(sessionId, sceneId);
	getTracking(sessionId, sceneId);

}
function getBackground(sessionId, sceneId) {
	var parametros = {
		"sessionId": sessionId,
		"sceneId": sceneId,
		"idExperiment": idExperiment
	};
	if (emittingData) {
		$.ajax({
			data: parametros,
			url: urlBackgroundTracker,
			type: 'get',
			beforeSend: function () {
				$("#result").html("Procesando, espere por favor...");
			},
			success: function (response) {
				var img = new Image();
				img.src = response;

				var canvas = document.getElementById('myCanvas');
				var ctx = canvas.getContext('2d');
				img.onload = function () {
					if (ctx) {
						canvas.width = img.width;
						canvas.height = img.height;

						ctx.drawImage(img, 0, 0);
					}
				}
			}
		});
	}
}
function getExperimentStatus() {

	$.ajax({
		url: urlExperimentStatus,
		type: 'get',
		success: function (response) {
			if (response === 'OPEN') {
				emittingData = true;
			}
			else {
				emittingData = false;
			}
		},
		error: function () { }
	});
}

function paintTracking(response) {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	responseJSON = JSON.parse(response);

	responseJSON.list.forEach(paintPoint);
	function paintPoint(item, index) {
		ctx.beginPath();
		ctx.arc(item['x'], item['y'], 1, 0, 2 * Math.PI);
		ctx.strokeStyle = getColor(item['eventType']);
		ctx.stroke();
	}
}

function getColor(eventType) {
	switch (eventType) {
		case EVENT_ON_MOUSE_MOVE:
			return "#FF0000";
			break;
		case EVENT_ON_CLICK:
			return "#FFF000";
			break;
		case 2:
			return "#FFFF00";
			break;
		case 3:
			return "#FFFFF0";
			break;
		case 4:
			return "#FF00FF";
			break;
		case EVENT_INIT_TRACKING:
			return "#74FF33";
			break;
		case EVENT_TRACKIND_END:
			return "#336BFF";
			break;
		default:
			return "#000F00";
	}
}

function postNumberDD(id, value) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"id": id,
		"numberValue": value,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	postAJAXDemographicData(parametros);
}

function postStringDD(id, value) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"id": id,
		"stringValue": value,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	postAJAXDemographicData(parametros);
}

function postDateDD(id, value) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"id": id,
		"dateValue": value,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	postAJAXDemographicData(parametros);
}

function postAJAXDemographicData(parametros) {
	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: urlDemographicData,
			type: 'post',
			success: function (response) {
			},
			error: function () {
			}
		});
	}
}

function registersus1(value) { postNumberDD(251, value); }
function registerid(value) { postStringDD(252, value); }
function registersus2(value) { postNumberDD(253, value); }
function registerpreferred_device(value) { postStringDD(254, value); }
function registersex(value) { postStringDD(255, value); }
function registerbirth_year(value) { postNumberDD(256, value); }
function registerusername(value) { postStringDD(257, value); }
function registersus7(value) { postNumberDD(258, value); }
function registerecommerce_frequency(value) { postStringDD(259, value); }
function registerhandedness(value) { postStringDD(260, value); }
function registersus9(value) { postNumberDD(261, value); }
function registercountry(value) { postStringDD(262, value); }
function registersus8(value) { postNumberDD(263, value); }
function registersus10(value) { postNumberDD(264, value); }
function registersus5(value) { postNumberDD(265, value); }
function registersus4(value) { postNumberDD(266, value); }
function registersus3(value) { postNumberDD(267, value); }
function registersus6(value) { postNumberDD(268, value); }
function registerpassword(value) { postStringDD(269, value); }
function registercity(value) { postStringDD(270, value); }
export {
	COMPONENT_BANNER, COMPONENT_BUTTON,
	COMPONENT_CARD, COMPONENT_CAROUSEL, COMPONENT_CHECK_BOX, COMPONENT_COMBOBOX, COMPONENT_IMAGE, COMPONENT_LINK, COMPONENT_OPTION,
	COMPONENT_RADIO_BUTTON, COMPONENT_RATE, COMPONENT_STEPPER,
	// Constantes de tipos de componentes
	COMPONENT_TEXT_FIELD, COMPONENT_TOUR, EVENT_ON_POINTER_CANCEL,
	// Constantes de eventos
	EVENT_ON_POINTER_DOWN, EVENT_ON_POINTER_MOVE, EVENT_ON_POINTER_UP, finishExperiment, finishSubsceneTracking, finishTracking, getCurrentSceneId,
	getUser, idExperiment, initTracking, postDateDD, postNumberDD,
	postStringDD, registerbirth_year, registercity, registerComponent, registercountry, registerecommerce_frequency, registerhandedness, registerid, registerpassword, registerpreferred_device, registersex, registersus1, registersus10, registersus2,
	registersus3,
	registersus4,
	registersus5,
	registersus6,
	registersus7,
	registersus8,
	registersus9, registerUserData, registerusername, startExperiment, trackWithEvent
};
