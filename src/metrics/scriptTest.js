

	
		
		const VERSION = 3;
		
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
		// Gesture events
		const EVENT_GESTURE_TAP = 30;
		const EVENT_GESTURE_DOUBLE_TAP = 31;
		const EVENT_GESTURE_LONG_TAP = 32;
		const EVENT_GESTURE_SWIPE = 33;
		const EVENT_GESTURE_DRAG = 34;
		const EVENT_GESTURE_SCROLL = 35;
		const EVENT_GESTURE_PINCH = 36;
		const EVENT_INIT_TRACKING = 100;
		const EVENT_TRACKIND_END = 200;
		const COMPONENT_TEXT_FIELD = 1;
		const COMPONENT_COMBOBOX = 2;
		const COMPONENT_OPTION = 3;
		const COMPONENT_RADIO_BUTTON = 4;
		const COMPONENT_CHECK_BOX = 5;
		
		const user = createUser();
	
			
		
		var list = [];
		var sceneId = 0;
		var eventCounter = 0;
		var trackingOn = false;
		var TOP_LIMIT = 500;
		var sentRequest = 0;
		var pendingRequest = 0;
		
		var pendingBackgroundsDelivered = 0;
		var backgroundsDelivered=0;
		var eventsDelivered = false;
		var finishedExperiment = false;
		
		var newPage = null;
		var elements = [];
		var emittingData = true;
		
	var idExperiment = 32;
	var urlBase='https://interactionlab.hci.uniovi.es:8443'
		
		var url = urlBase + '/TrackerServer/restws/track';
		var urlBackgroundTracker = urlBase + '/TrackerServer/restws/backgroundTracker';
		var urlRegisterComponent = urlBase + '/TrackerServer/restws/registerComponent';
		var urlRegisterUserData = urlBase +'/TrackerServer/restws/registerUserData';
		var urlDemographicData = urlBase + '/TrackerServer/restws/registerDemographicData';
		var urlExperimentStatus = urlBase + '/TrackerServer/restws/experiment/status/' + idExperiment;
	
	
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
				"sessionId": user
			};
			
			if (emittingData) {
				$.ajax({
					data: JSON.stringify(parametros),
					url: urlBackgroundTracker,
					type: 'post',
					beforeSend: function() {
						//We incremente the pendingbackgroundsdelivered number
						pendingBackgroundsDelivered++;
						console.log("Sending background. Pending backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
					},
					success: function(response) {
						pendingBackgroundsDelivered--;
						backgroundsDelivered++;
						console.log('Result: ' + response);
						console.log("Pending Backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
					},
					complete: function(jqXHR, textStatus) {
						console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
						//checkReadyToLeave();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						//alert("Status: " + textStatus); alert("Error: " + errorThrown);
						console.log("Status: " + textStatus);
						console.log("Error: " + errorThrown);
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
			    "scrPixelDepth": screen.pixelDepth,		    "touchSupport": 'ontouchstart' in window,
		    "pointerSupport": 'PointerEvent' in window,
		    "maxTouchPoints": navigator.maxTouchPoints || 0,			    "idExperiment" : idExperiment,
			    "sessionId" : user
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
							$("#result").html(response);
					},
				    async: false
				});
			}
		}
		
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
		
		function detectElement(x,y){
			var found = -1 ;
			elements.forEach ( function(entry){
				if (entry.isOver(x,y) && entry.getScene() === sceneId) {
					found = entry.id;
				}
			});
			return found;
		}
		
		function detectElementByName(name){
			var found = -1;
			elements.forEach ( function(entry){
				if(entry.id === name && entry.getScene() === sceneId){
					found = entry.id;
				}
			});
			return found;
		}
		
		function registerElement(id, x, y, xF, yF, typeId,sceneId) {
			elements.push( new Element(id,x,y,xF,yF,sceneId));
			addFocusAndBlurEvents(id);
			if(typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION){
				addSelectionEvent(id);
			}
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
				element.addEventListener('click', function(event) {
					trackOnClickSelectionEvent(event);
				});
			}
		}
		
		function trackWithEvent(eventType, event){
			if (trackingOn){
				trackEventOverElement(eventType, -1, event);
			}
		}
		
		function trackEvent(eventType){
			if (trackingOn){
				trackEventOverElement(eventType, -1, null);
			}
		}
		
		// Función para muestrear trayectoria y reducir volumen de datos
		function sampleTrajectory(events, maxSamples) {
			maxSamples = maxSamples || 10;
			if (!events || events.length === 0) return [];
			
			if (events.length <= maxSamples) {
				return events.map(function(e) {
					return {
						x: e.normalizedClientX,
						y: e.normalizedClientY,
						t: e.timestamp
					};
				});
			}
			
			var step = Math.floor(events.length / maxSamples);
			var sampled = [];
			for (var i = 0; i < events.length; i += step) {
				sampled.push({
					x: events[i].normalizedClientX,
					y: events[i].normalizedClientY,
					t: events[i].timestamp
				});
			}
			return sampled;
		}
		
		// Función para trackear gestos detectados por GestureDetectorHook
		function trackGestureEvent(gesture) {
			if (!trackingOn) return;
			
			var eventTypeMap = {
				'tap': EVENT_GESTURE_TAP,
				'double_tap': EVENT_GESTURE_DOUBLE_TAP,
				'long_tap': EVENT_GESTURE_LONG_TAP,
				'swipe': EVENT_GESTURE_SWIPE,
				'drag': EVENT_GESTURE_DRAG,
				'scroll': EVENT_GESTURE_SCROLL,
				'pinch': EVENT_GESTURE_PINCH
			};
			
			var item = new Object();
			item.id = eventCounter++;
			item.sceneId = sceneId;
			item.eventType = eventTypeMap[gesture.gestureType] || -1;
			item.timeStamp = gesture.endTime;
			item.x = Math.round(gesture.endPosition.x);
			item.y = Math.round(gesture.endPosition.y);
			item.keyValueEvent = -1;
			item.keyCodeEvent = -1;
			
			// Detectar elemento tocado
			if (gesture.eventName) {
				item.elementId = detectElementByName(gesture.eventName);
			} else {
				item.elementId = detectElement(item.x, item.y);
			}
			
			// Datos específicos del gesto
			item.gestureData = {
				gestureId: gesture.gestureId,
				gestureType: gesture.gestureType,
				duration: gesture.duration,
				eventCount: gesture.eventCount,
				
				// Posiciones absolutas
				startX: Math.round(gesture.startPosition.x),
				startY: Math.round(gesture.startPosition.y),
				endX: Math.round(gesture.endPosition.x),
				endY: Math.round(gesture.endPosition.y),
				
				// Posiciones normalizadas (0-1, comparable entre dispositivos)
				normalizedStartX: gesture.normalizedStartPosition.x,
				normalizedStartY: gesture.normalizedStartPosition.y,
				normalizedEndX: gesture.normalizedEndPosition.x,
				normalizedEndY: gesture.normalizedEndPosition.y,
				
				// Métricas de velocidad y aceleración
				averageVelocity: gesture.averageVelocity,
				maxVelocity: gesture.maxVelocity,
				minVelocity: gesture.minVelocity,
				averageAcceleration: gesture.averageAcceleration,
				
				// Métricas de presión y contacto
				averagePressure: gesture.averagePressure,
				maxPressure: gesture.maxPressure,
				minPressure: gesture.minPressure,
				averageContactWidth: gesture.averageContactWidth,
				averageContactHeight: gesture.averageContactHeight,
				maxContactWidth: gesture.maxContactWidth,
				maxContactHeight: gesture.maxContactHeight,
				
				// Métricas espaciales
				totalDistance: gesture.totalNormalizedDistance,
				straightDistance: gesture.straightNormalizedDistance,
				curvature: gesture.normalizedCurvature,
				direction: gesture.direction,
				jitter: gesture.normalizedJitter,
				
				// Tipo de puntero
				pointerType: gesture.pointerType,
				
				// Trayectoria muestreada (máximo 10 puntos)
				trajectorySample: sampleTrajectory(gesture.events, 10),
				
				// Información del elemento objetivo
				targetInfo: gesture.events && gesture.events[0] ? {
					tagName: gesture.events[0].targetInfo?.tagName,
					id: gesture.events[0].targetInfo?.id,
					className: gesture.events[0].targetInfo?.className,
					ariaLabel: gesture.events[0].targetInfo?.ariaLabel,
					eventName: gesture.events[0].targetInfo?.eventName,
					elementWidth: gesture.events[0].targetInfo?.elementWidth,
					elementHeight: gesture.events[0].targetInfo?.elementHeight,
					distanceFromCenter: gesture.events[0].targetInfo?.distanceFromCenter,
					normalizedDistanceFromCenter: gesture.events[0].targetInfo?.normalizedDistanceFromCenter,
					quadrant: gesture.events[0].targetInfo?.quadrant
				} : null
			};
			
			// Añadir datos específicos según tipo de gesto
			if (gesture.gestureType === 'pinch') {
				item.gestureData.pinchInitialDistance = gesture.pinchInitialDistance;
				item.gestureData.pinchFinalDistance = gesture.pinchFinalDistance;
				item.gestureData.pinchScaleFactor = gesture.pinchScaleFactor;
				item.gestureData.pinchType = gesture.pinchType;
			} else if (gesture.gestureType === 'double_tap') {
				item.gestureData.doubleTapInterval = gesture.doubleTapInterval;
				item.gestureData.doubleTapDistance = gesture.doubleTapDistance;
			} else if (gesture.gestureType === 'long_tap') {
				item.gestureData.longTapDuration = gesture.longTapDuration;
				item.gestureData.longTapPressure = gesture.longTapPressure;
			}
			
			list[list.length] = item;
			
			if (list.length >= TOP_LIMIT) {
				var deliverPackage = list;
				list = [];
				deliverData(deliverPackage);
			}
		}
		
		// Exponer función globalmente para que React pueda llamarla
		if (typeof window !== 'undefined') {
			window.trackGestureEvent = trackGestureEvent;
		}
		
		function trackEventOverElement(eventType, elementId, event)
		{
			var item = new Object();
			item.id=eventCounter++;
			item.sceneId=sceneId;
			item.eventType=eventType;
			item.timeStamp = Date.now();
			if ( window.event !== undefined ) {
				item.x=	window.event.clientX;
				item.y= window.event.clientY;
			}
			else {
				item.x=	0;
				item.y= 0;
			}
			
			if(item.x == null ){
				item.x=-1;
			}
			if(item.y== null){
				item.y=-1;
			}
			
			item.keyValueEvent = -1;
			item.keyCodeEvent = -1;
			
			if(eventType == EVENT_KEY_DOWN || eventType == EVENT_KEY_PRESS || eventType == EVENT_KEY_UP){
				item.keyValueEvent = event.key;
				item.keyCodeEvent = event.keyCode;
				item.elementId = detectElementByName(event.target.id);
			}
			else if(eventType == EVENT_FOCUS || eventType == EVENT_BLUR){
				item.elementId = detectElementByName(event.target.id);
			}
			else if(eventType == EVENT_ON_CHANGE_SELECTION_OBJECT){
				item.elementId = detectElementByName(event.target.id);
			}
			else if(eventType == EVENT_ON_CLICK_SELECTION_OBJECT){
				item.elementId = detectElementByName(event.target.id);
			}
			else{
				item.elementId = detectElement(item.x, item.y);
			}
			
			list[list.length] = item;
			
			if ( list.length >= TOP_LIMIT ){
				var deliverPackage = list;
				list = [];
				deliverData(deliverPackage);
			}
		}
		
		function initTracking(_sceneId) {
			trackingOn = true;
			getExperimentStatus();
			sceneId = _sceneId;
			console.log("Initializing tracking for scene "+_sceneId);
			
			trackEvent(EVENT_INIT_TRACKING);
			parent.addEventListener('scroll', function() {
				trackWindowScroll();
			});
			parent.addEventListener('resize', function() {
				trackWindowResize();
			});
			parent.addEventListener('mousemove', function() {
				trackMouseMovement();
			});
			parent.addEventListener('mousedown', function() {
				trackMouseDown();
			});
			parent.addEventListener('mouseup',  function() {
				trackMouseUp();
			});
			parent.addEventListener('click',  function() {
				trackClick();
			});
			parent.addEventListener('dblclick', function() {
				trackDblclick();
			}); 
			parent.addEventListener('contextmenu', function() {
				trackContextmenu();
			}); 
			parent.addEventListener('wheel',  function() {
				trackWheel();
			});
			parent.addEventListener('keydown',  function(event) {
				trackEventKeydown(event);
			});
			parent.addEventListener('keypress',  function(event) {
				trackEventKeypress(event);
			});
			parent.addEventListener('keyup',  function(event) {
				trackEventKeyup(event);
			});  
		}
		
		function trackMouseMovement() {
			trackEvent(EVENT_ON_MOUSE_MOVE);
		}	
		
		function trackClick(){
			trackEvent(EVENT_ON_CLICK);
		}	
		
		function trackDblclick(){
			trackEvent(EVENT_ON_DOUBLE_CLICK);
		}
		
		function trackMouseDown(){
			trackEvent(EVENT_ON_MOUSE_DOWN);
		}	
		
		function trackMouseUp(){
			trackEvent(EVENT_ON_MOUSE_UP);
		}	
		
		function trackWheel(){
			trackEvent(EVENT_ON_WHEEL);
		}	
		
		function trackContextmenu()	{
			trackEvent(EVENT_CONTEXT_MENU);
		}
		
		function trackWindowScroll(){
			trackEvent(EVENT_WINDOW_SCROLL);
		}
		
		function trackWindowResize(){
			trackEvent(EVENT_WINDOW_RESIZE);
		}
		
		function trackEventKeydown(event){
			trackWithEvent(EVENT_KEY_DOWN, event)
		}
		
		function trackEventKeypress(event){
			trackWithEvent(EVENT_KEY_PRESS, event)
		}
		
		function trackEventKeyup(event){
			trackWithEvent(EVENT_KEY_UP, event)
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
		
		function trackOnClickSelectionEvent(event){
			trackWithEvent(EVENT_ON_CLICK_SELECTION_OBJECT, event);
		}
		
		function finishTracking(_newPage)	
		{
			trackEvent(EVENT_TRACKIND_END);
			trackingOn = false;
			
			//We take the snapshot.
			takeSnapshot(this.sceneId);
			
			deliverData(list);
			list=[];
			newPage = _newPage;
			checkReadyToLeave();
		}	
		
		
		function checkReadyToLeave() {	

			if (eventsDelivered == false || pendingRequest > 0) {
				console.log("Not ready to leave page, events still pending");
			}
			else {
				//Events are delivered, we wait for the background delivery
				if ( pendingBackgroundsDelivered > 0) {
					console.log("Not ready to leave page, "+ pendingBackgroundsDelivered+" backgrounds still pending");
					setTimeout(() => {
						this.checkReadyToLeave();
					}, 2000);
					return;
				}
		
				console.log("Ready to leave page, pending request:" + pendingRequest+", pending backgrounds "+pendingBackgroundsDelivered+"/"+backgroundsDelivered);
				if ( finishedExperiment )
				{
					//We delete the user
					console.log("Experiment finished, deleting user "+	localStorage.getItem("user"));
					localStorage.removeItem("user");	
				}
				if (newPage != null) {
					window.location.href = newPage;
				}
			}
		
		}
		
		
		function finishSubsceneTracking()	
		{
			trackEvent(EVENT_TRACKIND_END);
			trackingOn = false;
			//We take the snapshot
			takeSnapshot(this.sceneId);
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
			    "sessionId" : user
			};
			
			if(emittingData){
				$.ajax({
					data:  JSON.stringify(parametros),  
					url:   urlRegisterComponent,
					type:  'post',
					beforeSend: function () {
						
					},
					success:  function (response) {
						
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
					beforeSend: function() {
						pendingRequest++;
						sentRequest++;
						console.log("Sending request. Pending requests: " + pendingRequest + "/" + sentRequest);
					},
					success: function(response) {
						console.log('Result: ' + response);
						console.log("Pending Requests: " + pendingRequest + "/" + sentRequest);
					},
					complete: function(jqXHR, textStatus) {
						pendingRequest--;
						console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
		
						if (pendingRequest == 0) {
							eventsDelivered = true;
						}
						checkReadyToLeave();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert("Status: " + textStatus); alert("Error: " + errorThrown);
						console.log("Status: " + textStatus);
						console.log("Error: " + errorThrown);
					}
				}).always(function(jqXHR, textStatus) {
					if (textStatus != "success") {
						alert("ERROR: " + jqXHR.statusText);
					}
				});
			}
		}
		
		function deliverData(list)
		{
		    var i=0;
			chunk = [];
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
					}
					else{
						emittingData = false;
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
			  case EVENT_TRACKIND_END: 
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
			    "sessionId" : user
			};
			postAJAXDemographicData(parametros);
		}
		
		function postStringDD(id, value) {
			var parametros = {
				"timezone": (new Date()).getTimezoneOffset()/60 * (-1),
		    	"id": id,
				"stringValue": value,
				"idExperiment" : idExperiment,
			    "sessionId" : user
			};
			postAJAXDemographicData(parametros);
		}
		
		function postDateDD(id, value) {
			var parametros = {
				"timezone": (new Date()).getTimezoneOffset()/60 * (-1),
		    	"id": id,
				"dateValue": value,
				"idExperiment" : idExperiment,
			    "sessionId" : user
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
	
function registerid(value) {postNumberDD(158, value);}