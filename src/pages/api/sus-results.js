import { query } from '@/lib/db';

export default async function handler(req, res) {
    // Permitir CORS para desarrollo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const {
                sessionId,
                experimentId,
                q1, q2, q3, q4, q5, q6, q7, q8, q9, q10
            } = req.body;

            if (!sessionId) {
                return res.status(400).json({ error: 'sessionId is required' });
            }

            const sql = `
                INSERT INTO sus_results (
                    session_id, experiment_id,
                    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await query(sql, [
                sessionId,
                experimentId || 32,
                q1 || null, q2 || null, q3 || null, q4 || null, q5 || null,
                q6 || null, q7 || null, q8 || null, q9 || null, q10 || null
            ]);

            return res.status(200).json({ 
                success: true, 
                message: 'SUS results saved successfully' 
            });

        } catch (error) {
            console.error('Error saving SUS results:', error);
            return res.status(500).json({ 
                error: 'Failed to save SUS results',
                details: error.message 
            });
        }
    }

    if (req.method === 'GET') {
        try {
            const { sessionId } = req.query;
            
            if (sessionId) {
                const result = await query(
                    'SELECT * FROM sus_results WHERE session_id = ?',
                    [sessionId]
                );
                return res.status(200).json(result);
            }
            
            const results = await query('SELECT * FROM sus_results ORDER BY created_at DESC');
            return res.status(200).json(results);

        } catch (error) {
            console.error('Error fetching SUS results:', error);
            return res.status(500).json({ 
                error: 'Failed to fetch SUS results',
                details: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
