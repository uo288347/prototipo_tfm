
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
				taskId,
				taskName,
				completed
			} = req.body;

			if (!sessionId || !taskId) {
				return res.status(400).json({ error: 'sessionId and taskId are required' });
			}

			// Usar INSERT ... ON DUPLICATE KEY UPDATE para upsert por sessionId+taskId
			const sql = `
				INSERT INTO completed_tasks (
					session_id, experiment_id, task_id, task_name, completed
				) VALUES (?, ?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE
					task_name = COALESCE(VALUES(task_name), task_name),
					completed = COALESCE(VALUES(completed), completed),
					created_at = CURRENT_TIMESTAMP
			`;

			const result = await query(sql, [
				sessionId,
				experimentId || 32,
				taskId,
				taskName || null,
				completed !== undefined ? completed : false
			]);

			return res.status(200).json({
				success: true,
				message: 'Task data saved successfully',
				sessionId,
				taskId
			});
		} catch (error) {
			console.error('Error saving task data:', error);
			return res.status(500).json({
				error: 'Failed to save task data',
				details: error.message
			});
		}
	}

	if (req.method === 'GET') {
		try {
			const { sessionId, taskId } = req.query;
			if (sessionId && taskId) {
				const result = await query(
					'SELECT * FROM completed_tasks WHERE session_id = ? AND task_id = ?',
					[sessionId, taskId]
				);
				return res.status(200).json(result[0] || null);
			}
			if (sessionId) {
				const result = await query(
					'SELECT * FROM completed_tasks WHERE session_id = ? ORDER BY created_at DESC',
					[sessionId]
				);
				return res.status(200).json(result);
			}
			// Obtener todas las tareas completadas (admin/análisis)
			const results = await query('SELECT * FROM completed_tasks ORDER BY created_at DESC');
			return res.status(200).json(results);
		} catch (error) {
			console.error('Error fetching task data:', error);
			return res.status(500).json({
				error: 'Failed to fetch task data',
				details: error.message
			});
		}
	}

	return res.status(405).json({ error: 'Method not allowed' });
}
