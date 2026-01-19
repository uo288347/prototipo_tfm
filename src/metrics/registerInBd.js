import { getUser, idExperiment } from './script_v2.js';
		/**
		 * Registra datos del participante en la base de datos MySQL local
		 * @param {Object} data - Datos del participante
		 * @param {string} data.handedness - 'left' o 'right'
		 * @param {string} data.sex - 'man', 'woman', 'other', 'prefer_not_say'
		 * @param {number} data.birthYear - Año de nacimiento
		 * @param {string} data.ecommerceFrequency - Frecuencia de uso de e-commerce
		 * @param {string} data.preferredDevice - Dispositivo preferido
		 * @param {string} data.selectedLanguage - Idioma seleccionado
		 */
		async function registerParticipantData(data) {
			const sessionId = getUser();
			if (!sessionId) {
				console.error('[registerParticipantData] No session ID available');
				return null;
			}

			// Obtener datos del navegador automáticamente
			const browserData = {
				browserName: navigator.appName || 'unknown',
				browserVersion: navigator.userAgent || 'unknown',
				browserLanguage: navigator.language || 'unknown',
				browserPlatform: navigator.platform || 'unknown',
				screenWidth: typeof screen !== 'undefined' ? screen.width : null,
				screenHeight: typeof screen !== 'undefined' ? screen.height : null,
				devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : null,
				isTouchDevice: typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
			};

			const payload = {
				sessionId: sessionId,
				experimentId: idExperiment,
				...data,
				...browserData
			};

			console.log('[registerParticipantData] Sending data:', payload);

			try {
				const response = await fetch('/api/participant', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				console.log('[registerParticipantData] Success:', result);
				return result;
			} catch (error) {
				console.error('[registerParticipantData] Error:', error);
				// Fallback: intentar guardar en localStorage si falla la DB
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('participantData_' + sessionId, JSON.stringify(payload));
					console.log('[registerParticipantData] Saved to localStorage as fallback');
				}
				return null;
			}
		}

		/**
		 * Registra los resultados del cuestionario SUS
		 * @param {Object} susData - Respuestas del SUS (q1-q10 y susScore)
		 */
		async function registerSUSResults(susData) {
			const sessionId = getUser();
			if (!sessionId) {
				console.error('[registerSUSResults] No session ID available');
				return null;
			}

			const payload = {
				sessionId: sessionId,
				experimentId: idExperiment,
				...susData
			};

			console.log('[registerSUSResults] Sending data:', payload);

			try {
				const response = await fetch('/api/sus-results', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				console.log('[registerSUSResults] Success:', result);
				return result;
			} catch (error) {
				console.error('[registerSUSResults] Error:', error);
				return null;
			}
		}

		/**
		 * Actualiza un campo específico del participante
		 * @param {string} field - Nombre del campo
		 * @param {any} value - Valor del campo
		 */
		async function updateParticipantField(field, value) {
			return registerParticipantData({ [field]: value });
		}
	

export {
        registerParticipantData,
        registerSUSResults,
        updateParticipantField
    };