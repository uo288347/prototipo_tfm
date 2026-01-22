		import { track } from "framer-motion/client";
import html2canvas from "html2canvas";
		import $ from "jquery";

		const VERSION = 3;

		
		const EVENT_ON_POINTER_DOWN = 20;
		const EVENT_ON_POINTER_UP = 21;
		const EVENT_ON_POINTER_MOVE = 22;
		const EVENT_ON_POINTER_CANCEL = 23;
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
		
		var user = null;

		var listenersInitialized = false;
		var activeScene = null;

		let lastPointerPos = { x: null, y: null };
		let lastTrackedPos = { x: null, y: null, time: 0 };

		const MOVE_THRESHOLD = 2;   // píxeles
		const TIME_THRESHOLD = 30; // ms

		function getUser() {
			if (user === null && typeof window !== "undefined" && typeof localStorage !== "undefined") {
				user = createUser();
			}
			return user;
		}

		function getCurrentSceneId() {
			return sceneId;
		}
		
		var list = [];
		var sceneId = 0;
		var eventCounter = 0;
		var trackingOn = false;
		var TOP_LIMIT = 50;
		var sentRequest = 0;
		var pendingRequest = 0;
	
		var pendingBackgroundsDelivered = 0;
		var backgroundsDelivered=0;
		var eventsDelivered = false;
		var finishedExperiment = false;
		
		var newPage = null;
		var elements = [];
		var emittingData = true;
		
		var idExperiment = 35;
		var urlBase='https://interactionlab.hci.uniovi.es:8443'
		
		var url = urlBase + '/TrackerServer/restws/track';
		var urlBackgroundTracker = urlBase + '/TrackerServer/restws/backgroundTracker';
		var urlRegisterComponent = urlBase + '/TrackerServer/restws/registerComponent';
		var urlRegisterUserData = urlBase +'/TrackerServer/restws/registerUserData';
		var urlDemographicData = urlBase + '/TrackerServer/restws/registerDemographicData';
		var urlExperimentStatus = urlBase + '/TrackerServer/restws/experiment/status/' + idExperiment;
	
		/* ================= ELEMENTOS ================= */


		class Element {
		  constructor(id,x,y,xF,yF,sceneId) {
		    this.id = id;
		    this.x=x;
		    this.y=y;
		    this.xF=xF;
		    this.yF=yF;
		    this.sceneId=sceneId;
		  }
		  getScene(){
			  return this.sceneId;
		  }
		  isOver(mX,mY) {
			  if(this.x < mX && mX< this.xF && this.y< mY && mY< this.yF){
				  return true;
			  }
			  else {
				  return false;
			  }
		  }
		}

		function startExperiment()
		{
			//We create a new user
			var user = createUser();
			console.log("Creating user session "+user);
		}
		
		function finishExperiment()
		{
			//We flag the end of the experiment
			finishedExperiment=true;
		}
		
		function takeSnapshot(sceneId) {
			html2canvas(document.body).then(canvas => { 
				console.log("Delivering background for scene "+sceneId)
				deliverSnapshot(sceneId, canvas);
				 });
		}

		function deliverSnapshot(sceneId, canvas) {
			
			var parametros = {
				"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
				"experiment": idExperiment,
				"sceneId": sceneId,
				"canvas": canvas.toDataURL("image/png"),
				"timeStamp": Date.now(),
				"sessionId": getUser()
			};
			
			if (emittingData) {
				$.ajax({
					data: JSON.stringify(parametros),
					url: urlBackgroundTracker,
					type: 'post',
					beforeSend: function() {
						//We incremente the pendingbackgroundsdelivered number
						pendingBackgroundsDelivered++;
						//console.log("Sending background. Pending backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
					},
					success: function(response) {
						pendingBackgroundsDelivered--;
						backgroundsDelivered++;
						//console.log('Result: ' + response);
						//console.log("Pending Backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
					},
					complete: function(jqXHR, textStatus) {
						//console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
						//checkReadyToLeave();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						//alert("Status: " + textStatus); alert("Error: " + errorThrown);
						//console.log("Status: " + textStatus);
						//console.log("Error: " + errorThrown);
					}
				}).always(function(jqXHR, textStatus) {
					if (textStatus != "success") {
						alert("ERROR: " + jqXHR.statusText);
					}
				});
			}
		}
		
		function getDate()
		{
			var today = new Date();
			var day = today.getDate();
			var month = today.getMonth() + 1;
			var year = today.getFullYear();
			return (`${month}${day}${year}`);
		}
				

		function createUser() {
				if (typeof window === "undefined" || typeof localStorage === "undefined") {
					return null;
				}
				if (localStorage.getItem("user") === null || localStorage.getItem("user") === undefined) {
					let lettrs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
					localStorage.setItem("user",
						lettrs[Math.floor(Math.random() * lettrs.length)] +
						lettrs[Math.floor(Math.random() * lettrs.length)] +
						lettrs[Math.floor(Math.random() * lettrs.length)] +
						(Math.floor(Math.random() * (999999999999 - 100000000000)) + 100000000000).toString() +
						Date.now().toString()+getDate()
					);
				}
				console.log("User created: " + localStorage.getItem("user"));
				return localStorage.getItem("user");
		}
	
		function registerUserData()
		{
		    var parametros = {
		    	"timezone": (new Date()).getTimezoneOffset()/60 * (-1),
		    	"timeOpened":new Date(),
		    	"pageon" : window.location.pathname,
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
			    "idExperiment" : idExperiment,
			    "sessionId" : getUser()
			};		
			if(true){
				$.ajax({
					data:  JSON.stringify(parametros),  
					url:   urlRegisterUserData,
					type:  'post',
					beforeSend: function () {
							$("#resultado").html("Registering user data...");		
					},
					success:  function (response) {
						//console.log("User data registered: ", response);
							$("#result").html(response);
					},
				    async: false
				});
			}
		}
		
		
		function isElementVisible(id) {
			const el = document.getElementById(id);
			if (!el) return false;
			
			const rect = el.getBoundingClientRect();
			const style = window.getComputedStyle(el);

			return (
				rect.width > 0 &&
				rect.height > 0 &&
				style.visibility !== 'hidden' &&
				style.display !== 'none' &&
				rect.bottom > 0 &&
				rect.right > 0 &&
				rect.top < window.innerHeight &&
				rect.left < window.innerWidth
			);
		}
		
		function detectElement(x,y){
			var found = -1 ;
			let highestZIndex = -Infinity;

			// Filtrar solo elementos visibles
			const visibleElements = elements.filter(entry => isElementVisible(entry.id));

			visibleElements.forEach(entry => {
				if (entry.isOver(x, y)) {
					const element = document.getElementById(entry.id);
					if (element) {
						const zIndex = parseInt(window.getComputedStyle(element).zIndex) || 0;
						if (zIndex > highestZIndex || highestZIndex === -Infinity) {
							highestZIndex = zIndex;
							found = entry.id;
						}
					}
				}
			});
			return found;

			// let found = -1;
			// elements.forEach((el) => {
			// 	if(el.getScene() === sceneId){
			// 		const elementDom = document.getElementById(el.id);
			// 		if(elementDom){
			// 			const rect = elementDom.getBoundingClientRect();
			// 			if(rect.left < x && x < rect.right && rect.top < y && y < rect.bottom){
			// 				found = el.id;
			// 			}
			// 		}
			// 	}
			// });
			// return found;
			
		}

		/**
		 * Busca el ID trackeable más cercano en el árbol DOM del elemento
		 * Útil cuando el click ocurre en un elemento hijo sin ID
		 */
		function findTrackableIdInAncestors(element) {
			let current = element;
			while (current && current !== document.body) {
				if (!isElementVisible(current.id)) {
					current = current.parentElement;
					continue;
				}
				// Buscar por data-trackable-id (nuestro atributo personalizado)
				const trackableId = current.getAttribute('data-trackable-id');
				if (trackableId) {
					return trackableId;
				}
				// Buscar por ID normal si está registrado
				if (current.id && detectElementByName(current.id) !== -1) {
					return current.id;
				}
				current = current.parentElement;
			}
			return null;
		}

		/**
		 * Detecta el elemento primero por coordenadas, y si no encuentra,
		 * busca en los ancestros del target del evento
		 */
		function detectElementEnhanced(x, y, eventTarget) {
			// Estrategia 1: Buscar en ancestros del target (más confiable)
			if (eventTarget) {
				const ancestorId = findTrackableIdInAncestors(eventTarget);
				if (ancestorId !== -1) {
					return ancestorId;
				}
			}
			
			// Estrategia 2: Solo si falla lo anterior, buscar por coordenadas
			return detectElement(x, y);
		}
		
		function detectElementByName(name){
			// var found = -1;
			// elements.forEach ( function(entry){
			// 	if(entry.id === name && entry.getScene() === sceneId){
			// 		found = entry.id;
			// 	}
			// });
			const entry = elements.find(e => e.id === name);
    		if (!entry) return -1;
    		return isElementVisible(name) ? entry.id : -1;
		}
		
		function registerElement(id, x, y, xF, yF, typeId,sceneId) {
			elements.push( new Element(id,x,y,xF,yF,sceneId));
			addFocusAndBlurEvents(id);
			if(typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION){
				addSelectionEvent(id);
			}
		}
		
		function ingestPointerSample(sample) {
			// sample = { x, y, t, pressure, width, ... , scrollY }
			trackEventOverElement(EVENT_ON_POINTER_MOVE, {
				clientX: sample.x,
				clientY: sample.y,
				pointerId: sample.pointerId,
				pointerType: "touch",
				pressure: sample.pressure,
				width: sample.width,
				height: sample.height,
				tiltX: sample.tiltX,
				tiltY: sample.tiltY,
				scrollX: 0,
				scrollY: sample.scrollY,
				target: document.elementFromPoint(sample.x, sample.y)
			});
		}

		function addFocusAndBlurEvents(elementId){
			var element = document.getElementById(elementId);
			if(element != undefined && element != null){
				element.addEventListener('focus', function(event) {
					trackFocusEvent(event);
				});
				element.addEventListener('blur', function(event) {
					trackBlurEvent(event);
				});
			}
		}
		
		function addSelectionEvent(elementId){
			var element = document.getElementById(elementId);
			if(element != undefined && element != null){
				element.addEventListener('change', function(event) {
					trackOnChangeSelectionEvent(event);
				});
			}
		}
		
		function trackWithEvent(eventType, event){
			if (trackingOn){
				trackEventOverElement(eventType, event);
			}
		}
		
		function trackEvent(eventType){
			if (trackingOn){
				trackEventOverElement(eventType, null);
			}
		}

		function getEventCoordinates(event) {
			if (!event) {
				return { x: -1, y: -1, docX: -1, docY: -1 };
			}
			
			const touch = event.touches?.[0] || event.changedTouches?.[0];
			let clientX, clientY;
			
			if (touch) {
				clientX = touch.clientX;
				clientY = touch.clientY;
			} else if (event.clientX !== undefined) {
				clientX = event.clientX;
				clientY = event.clientY;
			} else {
				return { x: -1, y: -1, docX: -1, docY: -1 };
			}
			
			// Coordenadas absolutas del documento (incluyendo scroll)
			const scrollX = window.scrollX || window.pageXOffset || 0;
			const scrollY = window.scrollY || window.pageYOffset || 0;
			
			return {
				x: clientX,           // Viewport
				y: clientY,           // Viewport
				docX: clientX + scrollX,  // Documento completo
				docY: clientY + scrollY   // Documento completo
			};
		}
		
		function trackEventOverElement(eventType, event) {
			const item = {
				id: eventCounter++,
				sceneId: sceneId,
				eventType: eventType,
				timeStamp: Date.now(),
				keyValueEvent: -1,
				keyCodeEvent: -1
			};
			
			// Obtener coordenadas
			const coords = getEventCoordinates(event);
			item.x = coords.x;
			item.y = coords.y;
			item.docX = coords.docX;
			item.docY = coords.docY;
			
			// Eventos de teclado
			if ([EVENT_KEY_DOWN, EVENT_KEY_PRESS, EVENT_KEY_UP].includes(eventType)) {
				item.keyValueEvent = event.key;
				item.keyCodeEvent = event.keyCode;
				item.elementId = detectElementByName(event.target.id);
				if (item.elementId === -1) {
					item.elementId = detectElementEnhanced(item.x, item.y, event.target);
				}
			}
			// Eventos de foco
			else if ([EVENT_FOCUS, EVENT_BLUR].includes(eventType)) {
				item.elementId = detectElementByName(event.target.id);
				if (item.elementId === -1) {
					item.elementId = detectElementEnhanced(item.x, item.y, event.target);
				}
			}
			// Eventos de selección
			else if ([EVENT_ON_CHANGE_SELECTION_OBJECT, EVENT_ON_CLICK_SELECTION_OBJECT].includes(eventType)) {
				item.elementId = detectElementByName(event.target.id);
			}
			// Evento de scroll
			else if (eventType === EVENT_WINDOW_SCROLL) {
				item.scrollX = event?.scrollX ?? window.scrollX ?? 0;
				item.scrollY = event?.scrollY ?? window.scrollY ?? 0;
				item.docX = item.x + item.scrollX;
				item.docY = item.y + item.scrollY;
				item.elementId = detectElementEnhanced(item.x, item.y, event?.target);
			}
			// Otros eventos (táctiles, ratón, etc.)
			else {
				item.elementId = detectElementEnhanced(item.x, item.y, event?.target);
			}
			
			enrichPointerData(item, event);
			console.log(item);
			list.push(item); // Más idiomático que list[list.length]
			
			if (list.length >= TOP_LIMIT) {
				const deliverPackage = list;
				list = [];
				deliverData(deliverPackage);
			}
		}

		let lastPointerState = null;

		function enrichPointerData(item, event) {
			if (!event) return;

			if (event.pointerId !== undefined) {
				item.pointerId = event.pointerId;
				item.pointerType = event.pointerType; // mouse | pen | touch
				item.isPrimary = event.isPrimary ?? true;
				item.pressure = event.pressure ?? 0;
				item.width = event.width ?? 0;
				item.height = event.height ?? 0;
				item.tiltX = event.tiltX ?? 0;
				item.tiltY = event.tiltY ?? 0;
				item.twist = event.twist ?? 0;
			}

			if (event.buttons !== undefined) {
				item.button = event.button;
				item.buttons = event.buttons;
			}

			const scrollX = event.scrollX ?? 0;
			const scrollY = event.scrollY ?? 0;

			item.scrollX = scrollX;
			item.scrollY = scrollY;

			if (item.x !== undefined && item.y !== undefined) {
				item.docX = item.x + scrollX;
				item.docY = item.y + scrollY;
			}

			const now = item.timeStamp;

			if (lastPointerState) {
				const dt = now - lastPointerState.time;

				if (dt > 0) {
				const dx = item.x - lastPointerState.x;
				const dy = item.y - lastPointerState.y;

				item.movementX = dx;
				item.movementY = dy;

				item.velocityX = dx / dt;
				item.velocityY = dy / dt;
				item.speed = Math.sqrt(item.velocityX ** 2 + item.velocityY ** 2);

				item.direction = Math.atan2(dy, dx); // radianes
				}
			}

			lastPointerState = {
				x: item.x,
				y: item.y,
				time: now
			};

			if (event.touches) {
				item.touchCount = event.touches.length;
			}

			if (event.target) {
				const t = event.target;

				item.targetTag = t.tagName?.toLowerCase() || null;
				item.targetId = t.id || null;
				item.targetRole = t.getAttribute?.('role') || null;
				item.targetAriaLabel = t.getAttribute?.('aria-label') || null;
			}
		}
		
		function initTracking(_sceneId) {
			if (activeScene === _sceneId) return;
  			activeScene = _sceneId;
			trackingOn = true;
			getExperimentStatus();
			sceneId = _sceneId;
			console.log("Initializing tracking for scene "+_sceneId);
			
			if (!listenersInitialized){
				initializeGlobalListeners();
				listenersInitialized = true;
			}
			trackEvent(EVENT_INIT_TRACKING);
		}

		function finishTracking(_newPage)	
		{
			activeScene = null;
			trackEvent(EVENT_TRACKING_END);
			trackingOn = false;
			
			//We take the snapshot.
			takeSnapshot(sceneId);
			
			deliverData(list);
			list=[];
			newPage = _newPage;
			checkReadyToLeave();
		}	

		function trackMoveIfNeeded(eventType, event) {
			if (!trackingOn) return;

			const now = Date.now();

			if (lastTrackedPos.x !== null) {
				const dx = Math.abs(event.clientX - lastTrackedPos.x);
				const dy = Math.abs(event.clientY - lastTrackedPos.y);
				const dt = now - lastTrackedPos.time;

				if (dx < MOVE_THRESHOLD && dy < MOVE_THRESHOLD && dt < TIME_THRESHOLD) {
					return;
				}
			}

			lastTrackedPos = { x: event.clientX, y: event.clientY, time: now };

			trackEventOverElement(eventType, event);
		}

		// Variable para rastrear la última posición de scroll
		let lastScrollPos = { x: 0, y: 0, time: 0 };
		const SCROLL_THRESHOLD = 5; // píxeles mínimos de cambio para registrar

		function trackScrollEvent(scrollX, scrollY, target) {
			if (!trackingOn) return;

			const now = Date.now();

			// Filtrar eventos de scroll muy pequeños o muy frecuentes
			if (lastScrollPos.x !== null) {
				const dx = Math.abs(scrollX - lastScrollPos.x);
				const dy = Math.abs(scrollY - lastScrollPos.y);
				const dt = now - lastScrollPos.time;

				if (dx < SCROLL_THRESHOLD && dy < SCROLL_THRESHOLD && dt < TIME_THRESHOLD) {
					return;
				}
			}

			lastScrollPos = { x: scrollX, y: scrollY, time: now };

			// Crear evento sintético con la posición del puntero Y la posición de scroll
			trackEventOverElement(EVENT_WINDOW_SCROLL, -1, {
				clientX: lastPointerPos.x,
				clientY: lastPointerPos.y,
				scrollX: scrollX,
				scrollY: scrollY,
				target: target
			});
		}
	
		function initializeGlobalListeners(){
			document.addEventListener('pointerdown', function(event) {
				lastPointerPos.x = event.clientX;
				lastPointerPos.y = event.clientY;

				trackWithEvent(EVENT_ON_POINTER_DOWN, event);
			});
			
			document.addEventListener('pointermove', function(event) {
				// Actualizar última posición del puntero
				lastPointerPos.x = event.pageX;
				lastPointerPos.y = event.pageY;

				//console.log(`[pointermove] `, event);
				trackWithEvent(EVENT_ON_POINTER_MOVE, event);
				trackMoveIfNeeded(EVENT_ON_POINTER_MOVE, event);
			});
			
			document.addEventListener('pointerup', function(event) {
				trackWithEvent(EVENT_ON_POINTER_UP, event);
			});

			document.addEventListener('pointercancel', function(event) {
				trackWithEvent(EVENT_ON_POINTER_CANCEL, event);	
			});

			document.addEventListener('keydown', function(event) {
				trackWithEvent(EVENT_KEY_DOWN, event);
			});
			
			document.addEventListener('keyup', function(event) {
				trackWithEvent(EVENT_KEY_UP, event);
			});
		}
		
		function trackFocusEvent(event){
			trackWithEvent(EVENT_FOCUS, event);
		}
		
		function trackBlurEvent(event){
			trackWithEvent(EVENT_BLUR, event);
		}
		
		function trackOnChangeSelectionEvent(event){
			trackWithEvent(EVENT_ON_CHANGE_SELECTION_OBJECT, event);
		}
		
		function checkReadyToLeave() {	
			if (eventsDelivered == false || pendingRequest > 0) {
				//console.log("Not ready to leave page, events still pending");
			}
			else {
				//Events are delivered, we wait for the background delivery
				if ( pendingBackgroundsDelivered > 0) {
					//console.log("Not ready to leave page, "+ pendingBackgroundsDelivered+" backgrounds still pending");
					setTimeout(() => {
						checkReadyToLeave();
					}, 2000);
					return;
				}
		
				//console.log("Ready to leave page, pending request:" + pendingRequest+", pending backgrounds "+pendingBackgroundsDelivered+"/"+backgroundsDelivered);
				if ( finishedExperiment )
				{
					//We delete the user
					if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
						//console.log("Experiment finished, deleting user "+ localStorage.getItem("user"));
						localStorage.removeItem("user");
					}
				}
				if (newPage != null) {
					window.location.href = newPage;
				}
			}
		}
		
		function finishSubsceneTracking()	
		{
			trackEvent(EVENT_TRACKING_END);
			trackingOn = false;
			//We take the snapshot
			takeSnapshot(sceneId);
		}	
		
		function registerComponent(sceneId, componentId, x, y, xF, yF, typeId, componentAssociated)
		{
			registerElement(componentId,x,y,xF,yF, typeId, sceneId);
		    var parametros = {
		    	"timezone": (new Date()).getTimezoneOffset()/60 * (-1),
				"sceneId" : sceneId,
				"componentId": componentId,
				"x": Math.round(x),
				"y": Math.round(y),
				"xF": Math.round(xF),
				"yF": Math.round(yF),
				"timeStamp": Date.now(),
				"idExperiment" : idExperiment,
				"typeId" : typeId,
				"componentAssociated": componentAssociated,
			    "sessionId" : getUser()
			};
			
			if(emittingData){
				$.ajax({
					data:  JSON.stringify(parametros),  
					url:   urlRegisterComponent,
					type:  'post',
					beforeSend: function () {
						
					},
					success:  function (response) {
						/*console.log("Component registered: "+componentId+"("+x+", "+y+"), type " + 
							typeId + " in scene "+sceneId+", response: "+response);*/
					}
				});
			}
		}
		
		function deliverChunk(chunk) {
			var parametros = {
				"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
				"list": chunk,
				"idExperiment": idExperiment,
				"sessionId": getUser()
			};
			//console.log("Delivering chunk of "+chunk.length+" events: " + JSON.stringify(chunk));
		
			if (emittingData) {
				$.ajax({
					data: JSON.stringify(parametros),
					url: url,
					type: 'post',
					beforeSend: function() {
						pendingRequest++;
						sentRequest++;
						//console.log("Sending request. Pending requests: " + pendingRequest + "/" + sentRequest);
					},
					success: function(response) {
						//console.log('Result: ' + response);
						//console.log("Pending Requests: " + pendingRequest + "/" + sentRequest);
					},
					complete: function(jqXHR, textStatus) {
						pendingRequest--;
						//console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
		
						if (pendingRequest == 0) {
							eventsDelivered = true;
						}
						checkReadyToLeave();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert("Status: " + textStatus); alert("Error: " + errorThrown);
						//console.log("Status: " + textStatus);
						//console.log("Error: " + errorThrown);
					}
				}).always(function(jqXHR, textStatus) {
					if (textStatus != "success") {
						alert("ERROR: " + jqXHR.statusText);
					}
				});
			}
		}
		
		/* ================= ENVÍO ================= */

		function deliverData(list) {
			if (!list.length) return;
		    var i=0;
			var chunk = [];
			var chunkCounter = 0;
			list.forEach(myFunction);
			function myFunction(item, index) {
				chunk[i]= item;
				i++;
				if (i>=TOP_LIMIT)
				{
					i=0;
					deliverChunk(chunk);
					chunkCounter++;
					chunk=[];
				}			
			}
			deliverChunk(chunk);
			chunkCounter++ ;
			chunk=[];
		}
		
		function getTracking(sessionId, sceneId)
		{
		    var parametros = {
			    "sessionId" : sessionId,
			    "sceneId":sceneId,
			    "idExperiment" : idExperiment
			};
			
			if(emittingData){
				$.ajax({
					data:  parametros,
					url:   url,
					type:  'get',
					beforeSend: function () {
						$("#result").html("Procesando, espere por favor...");
					},
					success:  function (response) {
						$("#result").html(response);
						paintTracking(response);
					}
				});
			}
		}

		function showTrace(sessionId, sceneId)
		{
			getBackground(sessionId, sceneId);
			getTracking(sessionId,sceneId);
			
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
					beforeSend: function() {
						$("#result").html("Procesando, espere por favor...");
					},
					success: function(response) {
						var img = new Image();
						img.src = response;
		
						var canvas = document.getElementById('myCanvas');
						var ctx = canvas.getContext('2d');
						img.onload = function() {
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

		function getExperimentStatus(){
			$.ajax({
				url:   urlExperimentStatus,
				type:  'get',
				success:  function (response) {
					if(response === 'OPEN'){
						emittingData = true;
						//console.log("Experiment is OPEN: emitting data");
					}
					else{
						emittingData = false;
						//console.log("Experiment is CLOSED: not emitting data");
					}
				},
				error: function (){}
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
		
		function getColor( eventType )
		{
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
			  case EVENT_TRACKING_END: 
				return "#336BFF";
				break;
			  default:
				  return "#000F00";
			}
		}
		
		function postNumberDD(id, value) {
			var parametros = {
				"timezone": (new Date()).getTimezoneOffset()/60 * (-1),
		    	"id": id,
				"numberValue": value,
				"idExperiment" : idExperiment,
			    "sessionId" : getUser()
			};
			postAJAXDemographicData(parametros);
		}
		
		function postStringDD(id, value) {
			var parametros = {
				"timezone": (new Date()).getTimezoneOffset()/60 * (-1),
		    	"id": id,
				"stringValue": value,
				"idExperiment" : idExperiment,
			    "sessionId" : getUser()
			};
			postAJAXDemographicData(parametros);
		}
		
		function postDateDD(id, value) {
			var parametros = {
				"timezone": (new Date()).getTimezoneOffset()/60 * (-1),
		    	"id": id,
				"dateValue": value,
				"idExperiment" : idExperiment,
			    "sessionId" : getUser()
			};
			postAJAXDemographicData(parametros);
		}
		
		function postAJAXDemographicData(parametros){
			if(emittingData){
				$.ajax({
					data:  JSON.stringify(parametros),  
					url:   urlDemographicData,
					type:  'post',
					success:  function (response) {
					},
					error: function (){
					}
				});
			}
		}

function registerid(value) {
	console.log("Registering id: "+value);
	postStringDD(161, value);}
function registerhandedness(value) {
	console.log("Registering handedness: "+value);
	postStringDD(162, value);}
function registersex(value) {
	console.log("Registering sex: "+value);
	postStringDD(163, value);}
function registerbirth_year(value) {
	console.log("Registering birth year: "+value);
	postNumberDD(164, value);}
function registerecommerce_frequency(value) {
	console.log("Registering ecommerce frequency: "+value);
	postStringDD(165, value);}
function registerpreferred_device(value) {
	console.log("Registering preferred device: "+value);
	postStringDD(166, value);}
function registersus1(value) {
	console.log("Registering SUS 1: "+value);
	postNumberDD(167, value);}
function registersus2(value) {
	console.log("Registering SUS 2: "+value);
	postNumberDD(168, value);}
function registersus3(value) {
	console.log("Registering SUS 3: "+value);
	postNumberDD(169, value);}
function registersus4(value) {
	console.log("Registering SUS 4: "+value);
	postNumberDD(170, value);}
function registersus5(value) {
	console.log("Registering SUS 5: "+value);
	postNumberDD(171, value);}
function registersus6(value) {
	console.log("Registering SUS 6: "+value);
	postNumberDD(172, value);}
function registersus7(value) {
	console.log("Registering SUS 7: "+value);
	postNumberDD(173, value);}
function registersus8(value) {
	console.log("Registering SUS 8: "+value);
	postNumberDD(174, value);}
function registersus9(value) {
	console.log("Registering SUS 9: "+value);
	postNumberDD(175, value);}
function registersus10(value) {
	console.log("Registering SUS 10: "+value);
	postNumberDD(176, value);}

// Exportar funciones para uso en otros componentes
export { 
	startExperiment, 
	finishExperiment, 
	initTracking, 
	finishTracking, 
	finishSubsceneTracking,
	registerUserData, 
	registerComponent,
	registerid,
	postNumberDD,
	postStringDD,
	postDateDD,
	trackWithEvent,
	getCurrentSceneId,
	getUser,
	ingestPointerSample,
	registerhandedness,
	registersex,
	registerbirth_year,
	registerecommerce_frequency,
	registerpreferred_device,
	registersus1,
	registersus2,
	registersus3,
	registersus4,
	registersus5,
	registersus6,
	registersus7,
	registersus8,
	registersus9,
	registersus10,
	idExperiment,
	// Constantes de tipos de componentes
	COMPONENT_TEXT_FIELD,
	COMPONENT_COMBOBOX,
	COMPONENT_OPTION,
	COMPONENT_RADIO_BUTTON,
	COMPONENT_CHECK_BOX,
	COMPONENT_BUTTON,
	COMPONENT_CARD,
	COMPONENT_RATE,
	COMPONENT_IMAGE,
	COMPONENT_STEPPER,
	COMPONENT_CAROUSEL,
	COMPONENT_LINK,
	COMPONENT_BANNER,
	COMPONENT_TOUR,
	// Constantes de eventos
	EVENT_ON_POINTER_DOWN,
	EVENT_ON_POINTER_UP,
	EVENT_ON_POINTER_MOVE,
	EVENT_ON_POINTER_CANCEL
};