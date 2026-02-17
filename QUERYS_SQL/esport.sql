-- ==========================================================
-- 1. TABLA DE USUARIOS (Con todos los Roles)
-- ==========================================================
CREATE TABLE USUARIO (
    USUARIO_ID SERIAL PRIMARY KEY,
    USERNAME VARCHAR(50) UNIQUE NOT NULL,
    RIOT_ID VARCHAR(100), -- Ejemplo: "Alejandro#PERU"
    EMAIL VARCHAR(100) UNIQUE NOT NULL,
    PASS_HASH TEXT NOT NULL,
    
    -- BILLETERA (Doble Saldo)
    SALDO_REAL DECIMAL(10, 2) DEFAULT 0.00 CHECK (SALDO_REAL >= 0),
    SALDO_BONO DECIMAL(10, 2) DEFAULT 0.00 CHECK (SALDO_BONO >= 0),
    
    -- ROLES DEFINIDOS:
    -- 'SUPERADMIN': Acceso total (Dinero + Gestión Técnica).
    -- 'HOST': Puede crear/cancelar salas y vetar mapas. NO toca dinero.
    -- 'USER': Solo juega y pide recargas.
    ROL VARCHAR(20) DEFAULT 'USER', 
    
    PARTIDAS_JUGADAS INT DEFAULT 0, -- Candado para retiros
    FECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 2. MAPAS (Para el sistema de Veto)
-- ==========================================================
CREATE TABLE MAPA (
    MAPA_ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL, -- 'Ascent', 'Bind', 'Haven'
    IMAGEN_URL TEXT,
    ACTIVO BOOLEAN DEFAULT TRUE
);

-- ==========================================================
-- 3. TORNEOS (El Evento de 3 Días)
-- ==========================================================
CREATE TABLE TORNEO (
    TORNEO_ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(100) NOT NULL, -- "Copa Relámpago Fin de Semana"
    PREMIO_POZO DECIMAL(10, 2) NOT NULL,
    COSTO_INSCRIPCION DECIMAL(10, 2) NOT NULL,
    ESTADO VARCHAR(20) DEFAULT 'REGISTRO', -- 'REGISTRO', 'EN_CURSO', 'FINALIZADO'
    FECHA_INICIO TIMESTAMP,
    FECHA_FIN TIMESTAMP
);

-- ==========================================================
-- 4. SALAS (El centro de la acción)
-- ==========================================================
CREATE TABLE SALA (
    SALA_ID SERIAL PRIMARY KEY,
    -- Aquí está la clave: El CREADOR puede ser un ADMIN o un HOST
    CREADOR_ID INT REFERENCES USUARIO(USUARIO_ID), 
    TORNEO_ID INT REFERENCES TORNEO(TORNEO_ID), 
    
    NOMBRE VARCHAR(100), -- "Sala Intermedia #4"
    TIPO_SALA VARCHAR(50) DEFAULT 'BASICA', -- 'BASICA', 'INTERMEDIA', 'PERSONALIZADA'
    
    -- ECONOMÍA
    COSTO_ENTRADA DECIMAL(10, 2) NOT NULL, 
    PREMIO_A_REPARTIR DECIMAL(10, 2) NOT NULL,
    GANANCIA_PLATAFORMA DECIMAL(10, 2) NOT NULL, 
    
    ESTADO VARCHAR(20) DEFAULT 'ESPERANDO', -- 'ESPERANDO', 'VETO_MAPAS', 'JUGANDO', 'FINALIZADA', 'CANCELADA'
    
    -- MAP VETO
    MAPA_ELEGIDO_ID INT REFERENCES MAPA(MAPA_ID),
    VETO_LOG JSONB, -- Historial: { "turno": 1, "ban": "Bind", "team": "A" }
    
    RESULTADO_GANADOR VARCHAR(20), -- 'TEAM_A', 'TEAM_B'
    FECHA_CREACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 5. PARTICIPANTES (Gestión de Equipos)
-- ==========================================================
CREATE TABLE PARTICIPANTE_SALA (
    PARTICIPACION_ID SERIAL PRIMARY KEY,
    SALA_ID INT REFERENCES SALA(SALA_ID),
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID),
    
    EQUIPO VARCHAR(10) NOT NULL, -- 'A' o 'B'
    ES_CAPITAN BOOLEAN DEFAULT FALSE, -- Importante para decidir quién banea mapas
    
    SLOT_INDEX INT, -- 0-4 (Equipo A), 5-9 (Equipo B)
    
    -- Registro de cómo pagó
    PAGO_CON_BONO DECIMAL(10, 2) DEFAULT 0,
    PAGO_CON_REAL DECIMAL(10, 2) DEFAULT 0,
    
    UNIQUE(SALA_ID, SLOT_INDEX) -- Opcional si usas slots fijos
);

-- ==========================================================
-- 6. SOLICITUDES DE DINERO (Solo SUPERADMIN aprueba)
-- ==========================================================
CREATE TABLE SOLICITUD_RECARGA (
    RECARGA_ID SERIAL PRIMARY KEY,
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID),
    MONTO DECIMAL(10, 2) NOT NULL,
    METODO VARCHAR(50), 
    CODIGO_OPERACION VARCHAR(100), 
    FOTO_VOUCHER_URL TEXT, 
    
    -- ESTADOS: 'PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'RECHAZADA'
    ESTADO VARCHAR(20) DEFAULT 'PENDIENTE',
    
    -- Quien tomó la tarea (Bloqueo)
    ADMIN_ATENDIENDO_ID INT REFERENCES USUARIO(USUARIO_ID), 
    
    FECHA_SOLICITUD TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FECHA_CIERRE TIMESTAMP
);

CREATE TABLE SOLICITUD_RETIRO (
    RETIRO_ID SERIAL PRIMARY KEY,
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID),
    MONTO DECIMAL(10, 2) NOT NULL CHECK (MONTO >= 20),
    CUENTA_DESTINO TEXT NOT NULL,
    
    -- ESTADOS: 'PENDIENTE', 'EN_PROCESO', 'PAGADO', 'RECHAZADO'
    ESTADO VARCHAR(20) DEFAULT 'PENDIENTE',
    
    -- EL CANDADO: Este campo dice "Este retiro es mío, no lo toquen"
    ADMIN_ATENDIENDO_ID INT REFERENCES USUARIO(USUARIO_ID),
    
    FOTO_CONSTANCIA_PAGO TEXT, -- Admin sube foto de que ya pagó
    FECHA_SOLICITUD TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FECHA_PAGO TIMESTAMP
);

-- ==========================================================
-- 7. LOGS DE ACCIONES (Auditoría para Hosts)
-- ==========================================================
-- Esta tabla es vital para vigilar a tus Hosts.
CREATE TABLE LOG_ACCIONES (
    LOG_ID SERIAL PRIMARY KEY,
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID), -- Quien hizo la acción (Host o Admin)
    ACCION VARCHAR(50), -- 'CREAR_SALA', 'CANCELAR_SALA', 'EDITAR_RESULTADO'
    DETALLE JSONB, -- { "sala_id": 10, "motivo": "jugador desconectado" }
    FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);