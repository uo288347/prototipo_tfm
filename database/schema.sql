-- Schema para la base de datos del experimento
-- Ejecutar este script en MySQL/MariaDB para crear las tablas necesarias

CREATE DATABASE IF NOT EXISTS experiment_data;
USE experiment_data;

-- Tabla principal para datos demográficos y de sesión
CREATE TABLE IF NOT EXISTS participant_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    experiment_id INT NOT NULL,
    
    -- Datos demográficos
    handedness ENUM('left', 'right') NULL,
    sex ENUM('man', 'woman', 'other', 'prefer_not_say') NULL,
    birth_year INT NULL,
    
    -- Datos de uso de e-commerce
    ecommerce_frequency ENUM('never', 'once_month', '2_3_times_month', '1_3_times_week', 'everyday') NULL,
    preferred_device ENUM('computer', 'phone', 'tablet') NULL,
    
    -- Idioma seleccionado
    selected_language VARCHAR(10) NULL,
    
    -- Datos del dispositivo/navegador (automáticos)
    browser_name VARCHAR(100) NULL,
    browser_version VARCHAR(200) NULL,
    browser_language VARCHAR(20) NULL,
    browser_platform VARCHAR(50) NULL,
    screen_width INT NULL,
    screen_height INT NULL,
    device_pixel_ratio FLOAT NULL,
    is_touch_device BOOLEAN NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_experiment (experiment_id),
    INDEX idx_created (created_at)
);

-- Tabla para resultados SUS (System Usability Scale)
CREATE TABLE IF NOT EXISTS sus_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    experiment_id INT NOT NULL,
    
    -- Preguntas SUS (1-10)
    q1 INT NULL CHECK (q1 BETWEEN 1 AND 5),
    q2 INT NULL CHECK (q2 BETWEEN 1 AND 5),
    q3 INT NULL CHECK (q3 BETWEEN 1 AND 5),
    q4 INT NULL CHECK (q4 BETWEEN 1 AND 5),
    q5 INT NULL CHECK (q5 BETWEEN 1 AND 5),
    q6 INT NULL CHECK (q6 BETWEEN 1 AND 5),
    q7 INT NULL CHECK (q7 BETWEEN 1 AND 5),
    q8 INT NULL CHECK (q8 BETWEEN 1 AND 5),
    q9 INT NULL CHECK (q9 BETWEEN 1 AND 5),
    q10 INT NULL CHECK (q10 BETWEEN 1 AND 5),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (session_id) REFERENCES participant_data(session_id) ON DELETE CASCADE,
    INDEX idx_session (session_id)
);

-- Tabla para notas/comentarios adicionales
CREATE TABLE IF NOT EXISTS experiment_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    experiment_id INT NOT NULL,
    note_type VARCHAR(50) NULL,
    note_content TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES participant_data(session_id) ON DELETE CASCADE,
    INDEX idx_session (session_id)
);

-- Tabla para tareas completadas
CREATE TABLE IF NOT EXISTS completed_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    experiment_id INT NOT NULL,
    task_id VARCHAR(50) NOT NULL,
    task_name VARCHAR(200) NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES participant_data(session_id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_task (task_id)
);
