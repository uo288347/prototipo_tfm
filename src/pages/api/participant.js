import { query } from '@/lib/db';

export default async function handler(req, res) {
    // Permitir CORS para desarrollo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const {
                sessionId,
                experimentId,
                handedness,
                sex,
                birthYear,
                ecommerceFrequency,
                preferredDevice,
                selectedLanguage,
                browserName,
                browserVersion,
                browserLanguage,
                browserPlatform,
                screenWidth,
                screenHeight,
                devicePixelRatio,
                isTouchDevice
            } = req.body;

            if (!sessionId) {
                return res.status(400).json({ error: 'sessionId is required' });
            }

            // Usar INSERT ... ON DUPLICATE KEY UPDATE para upsert
            const sql = `
                INSERT INTO participant_data (
                    session_id, experiment_id, handedness, sex, birth_year,
                    ecommerce_frequency, preferred_device, selected_language,
                    browser_name, browser_version, browser_language, browser_platform,
                    screen_width, screen_height, device_pixel_ratio, is_touch_device
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    handedness = COALESCE(VALUES(handedness), handedness),
                    sex = COALESCE(VALUES(sex), sex),
                    birth_year = COALESCE(VALUES(birth_year), birth_year),
                    ecommerce_frequency = COALESCE(VALUES(ecommerce_frequency), ecommerce_frequency),
                    preferred_device = COALESCE(VALUES(preferred_device), preferred_device),
                    selected_language = COALESCE(VALUES(selected_language), selected_language),
                    browser_name = COALESCE(VALUES(browser_name), browser_name),
                    browser_version = COALESCE(VALUES(browser_version), browser_version),
                    browser_language = COALESCE(VALUES(browser_language), browser_language),
                    browser_platform = COALESCE(VALUES(browser_platform), browser_platform),
                    screen_width = COALESCE(VALUES(screen_width), screen_width),
                    screen_height = COALESCE(VALUES(screen_height), screen_height),
                    device_pixel_ratio = COALESCE(VALUES(device_pixel_ratio), device_pixel_ratio),
                    is_touch_device = COALESCE(VALUES(is_touch_device), is_touch_device),
                    updated_at = CURRENT_TIMESTAMP
            `;

            const result = await query(sql, [
                sessionId,
                experimentId || 32,
                handedness || null,
                sex || null,
                birthYear || null,
                ecommerceFrequency || null,
                preferredDevice || null,
                selectedLanguage || null,
                browserName || null,
                browserVersion || null,
                browserLanguage || null,
                browserPlatform || null,
                screenWidth || null,
                screenHeight || null,
                devicePixelRatio || null,
                isTouchDevice !== undefined ? isTouchDevice : null
            ]);

            return res.status(200).json({ 
                success: true, 
                message: 'Participant data saved successfully',
                sessionId: sessionId
            });

        } catch (error) {
            console.error('Error saving participant data:', error);
            return res.status(500).json({ 
                error: 'Failed to save participant data',
                details: error.message 
            });
        }
    }

    if (req.method === 'GET') {
        try {
            const { sessionId } = req.query;
            
            if (sessionId) {
                const result = await query(
                    'SELECT * FROM participant_data WHERE session_id = ?',
                    [sessionId]
                );
                return res.status(200).json(result[0] || null);
            }
            
            // Obtener todos los participantes (para admin/análisis)
            const results = await query('SELECT * FROM participant_data ORDER BY created_at DESC');
            return res.status(200).json(results);

        } catch (error) {
            console.error('Error fetching participant data:', error);
            return res.status(500).json({ 
                error: 'Failed to fetch participant data',
                details: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
