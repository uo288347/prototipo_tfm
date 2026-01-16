import html2canvas from "html2canvas";
import $ from "jquery";

const VERSION = 3;


const EVENT_ON_POINTER_DOWN = 20;
const EVENT_ON_POINTER_UP = 21;
const EVENT_ON_POINTER_MOVE = 22;
const EVENT_ON_POINTER_CANCEL = 23;
const EVENT_WINDOW_SCROLL = 11;
const EVENT_KEY_DOWN = 13;
const EVENT_KEY_PRESS = 14;
const EVENT_KEY_UP = 15;
const EVENT_FOCUS = 16;
const EVENT_BLUR = 17;
const EVENT_ON_CHANGE_SELECTION_OBJECT = 18;
const EVENT_ON_CLICK_SELECTION_OBJECT = 19;
const EVENT_INIT_TRACKING = 100;
const EVENT_TRACKING_END = 200;

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

let user = null;

let listenersInitialized = false;
let activeScene = null;
let trackingOn = false;

let elements = [];
let list = [];

let sceneId = 0;
let eventCounter = 0;

const TOP_LIMIT = 50;

/* ================= USUARIO ================= */

function getUser() {
	if (!user && typeof window !== "undefined") {
		user = createUser();
	}
	return user;
}

function getCurrentSceneId() {
    return sceneId;
}

function createUser() {
	if (!localStorage.getItem("user")) {
		localStorage.setItem(
			"user",
			Math.random().toString(36).substring(2) + Date.now()
		);
	}
	return localStorage.getItem("user");
}

/* ================= ELEMENTOS ================= */

class Element {
	constructor(id, sceneId) {
		this.id = id;
		this.sceneId = sceneId;
	}
	getScene() {
		return this.sceneId;
	}
}

/* ================= REGISTRO COMPONENTES ================= */

function registerComponent(sceneId, componentId, x, y, xF, yF, typeId) {
	elements.push(new Element(componentId, sceneId));
	addFocusAndBlurEvents(componentId);
}

/* ================= EVENTOS DOM ================= */

function addFocusAndBlurEvents(id) {
	const el = document.getElementById(id);
	if (!el) return;

	el.addEventListener("focus", trackFocusEvent);
	el.addEventListener("blur", trackBlurEvent);
}

function trackFocusEvent(e) {
	trackWithEvent(EVENT_FOCUS, e);
}

function trackBlurEvent(e) {
	trackWithEvent(EVENT_BLUR, e);
}

/* ================= DETECCIÓN ELEMENTO ================= */
function findTrackableIdInAncestors(element) {
	let current = element;
	while (current && current !== document.body) {
		if (current.id && isRegisteredElement(current.id)) {
			return current.id;
		}
		current = current.parentElement;
	}
	return null;
}

function isRegisteredElement(id) {
	return elements.some(
		(el) => el.id === id && el.getScene() === sceneId
	);
}

function isElementVisible(id) {
	const el = document.getElementById(id);
	if (!el) return false;

	const rect = el.getBoundingClientRect();
	const style = window.getComputedStyle(el);

	return (
		rect.width > 0 &&
		rect.height > 0 &&
		style.display !== "none" &&
		style.visibility !== "hidden"
	);
}

/* ================= COORDENADAS RELATIVAS ================= */

function getRelativePointerPosition(event, element) {
	const rect = element.getBoundingClientRect();

	let clientX, clientY;
	if (event.touches && event.touches.length > 0) {
		clientX = event.touches[0].clientX;
		clientY = event.touches[0].clientY;
	} else {
		clientX = event.clientX;
		clientY = event.clientY;
	}

	const relX = (clientX - rect.left) / rect.width;
	const relY = (clientY - rect.top) / rect.height;

	return {
		relX: Math.min(Math.max(relX, 0), 1),
		relY: Math.min(Math.max(relY, 0), 1),
		width: rect.width,
		height: rect.height,
	};
}

/* ================= TRACKING ================= */

function trackWithEvent(eventType, event) {
	if (!trackingOn) return;
	trackEventOverElement(eventType, event);
}

function trackEventOverElement(eventType, event) {
	const item = {};
	item.id = eventCounter++;
	item.sceneId = sceneId;
	item.eventType = eventType;
	item.timeStamp = Date.now();

	/* Coordenadas absolutas */
	if (event?.clientX !== undefined) {
		item.x = event.clientX;
		item.y = event.clientY;
	} else {
		item.x = -1;
		item.y = -1;
	}

	item.scrollX = window.scrollX || 0;
	item.scrollY = window.scrollY || 0;

	item.docX = item.x + item.scrollX;
	item.docY = item.y + item.scrollY;

	/* ⭐ NUEVO: detección por DOM */
	const target = event?.target;
	const elementId = target
		? findTrackableIdInAncestors(target)
		: null;

	item.elementId = elementId ?? -1;

	/* ⭐ NUEVO: coordenadas relativas */
	if (elementId && isElementVisible(elementId)) {
		const el = document.getElementById(elementId);
		if (el) {
			const rel = getRelativePointerPosition(event, el);
			item.relX = rel.relX;
			item.relY = rel.relY;
			item.elementWidth = rel.width;
			item.elementHeight = rel.height;
		}
	}

	list.push(item);

	if (list.length >= TOP_LIMIT) {
		deliverData(list);
		list = [];
	}
}

/* ================= INICIO / FIN ================= */

function initTracking(_sceneId) {
	if (activeScene === _sceneId) return;

	// ⭐ NUEVO: limpiar componentes antiguos
	elements = elements.filter((el) => el.getScene() === _sceneId);

	sceneId = _sceneId;
	activeScene = _sceneId;
	trackingOn = true;

	if (!listenersInitialized) {
		initializeGlobalListeners();
		listenersInitialized = true;
	}

	trackEventOverElement(EVENT_INIT_TRACKING);
}

function finishTracking() {
	trackEventOverElement(EVENT_TRACKING_END);
	trackingOn = false;
	deliverData(list);
	list = [];
}

/* ================= LISTENERS ================= */

function initializeGlobalListeners() {
	document.addEventListener("pointerdown", (e) =>
		trackWithEvent(EVENT_ON_POINTER_DOWN, e)
	);
	document.addEventListener("pointerup", (e) =>
		trackWithEvent(EVENT_ON_POINTER_UP, e)
	);
	document.addEventListener("pointermove", (e) =>
		trackWithEvent(EVENT_ON_POINTER_MOVE, e)
	);
	document.addEventListener("pointercancel", (e) =>
		trackWithEvent(EVENT_ON_POINTER_CANCEL, e)
	);

	document.addEventListener("scroll", () =>
		trackWithEvent(EVENT_WINDOW_SCROLL, {
			clientX: -1,
			clientY: -1,
			target: document.elementFromPoint(0, 0),
		})
	);

	document.addEventListener("keydown", (e) =>
		trackWithEvent(EVENT_KEY_DOWN, e)
	);
	document.addEventListener("keyup", (e) =>
		trackWithEvent(EVENT_KEY_UP, e)
	);
}

/* ================= ENVÍO ================= */

function deliverData(list) {
	if (!list.length) return;
	console.log("Delivering", list);
}

/* ================= EXPORTS ================= */

export {
	initTracking,
	finishTracking,
	registerComponent,
	getUser,
	COMPONENT_BUTTON,
	EVENT_ON_POINTER_DOWN,
	EVENT_ON_POINTER_UP,
	EVENT_ON_POINTER_MOVE,
};
