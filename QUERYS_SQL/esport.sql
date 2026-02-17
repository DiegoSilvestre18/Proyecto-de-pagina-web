-- ==========================================================
-- 1. TABLA DE USUARIOS (Identidad y Billetera)
-- ==========================================================
CREATE TABLE USUARIO (
    USUARIO_ID SERIAL PRIMARY KEY,
    USERNAME VARCHAR(50) UNIQUE NOT NULL,
    EMAIL VARCHAR(100) UNIQUE NOT NULL,
    PASS_HASH TEXT NOT NULL,
    
    -- BILLETERA (Doble Saldo: Real vs Bono)
    SALDO_REAL DECIMAL(10, 2) DEFAULT 0.00 CHECK (SALDO_REAL >= 0),
    SALDO_BONO DECIMAL(10, 2) DEFAULT 0.00 CHECK (SALDO_BONO >= 0),
    
    -- ROLES: 
    -- 'SUPERADMIN': Acceso total (Dinero + Gestión Técnica).
    -- 'HOST': Puede crear/cancelar salas y vetar mapas. NO toca dinero.
    -- 'USER': Solo juega y pide recargas.
    ROL VARCHAR(20) DEFAULT 'USER', 
    
    -- CANDADO DE SEGURIDAD:
    -- Evita que retiren dinero sin haber jugado.
    PARTIDAS_JUGADAS INT DEFAULT 0, 
    
    FECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 2. CUENTAS DE JUEGO (Vinculación Steam/Riot)
-- ==========================================================
CREATE TABLE GAME_ACCOUNT (
    GAME_ACCOUNT_ID SERIAL PRIMARY KEY,
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID),
    
    JUEGO VARCHAR(50) NOT NULL, -- 'VALORANT' o 'DOTA2'
    ID_EXTERNO VARCHAR(100) NOT NULL, -- SteamID64 o Riot PUUID
    ID_VISIBLE VARCHAR(100), -- Ejemplo: "Alejandro#PERU" o Nick de Steam
    
    -- SISTEMA DE RANGOS
    RANGO_ACTUAL VARCHAR(50), -- 'Ascendant 1', 'Ancient 5'
    ES_RANGO_MANUAL BOOLEAN DEFAULT FALSE, -- Si es TRUE, la API no lo actualiza (Poder del Admin)
    
    FECHA_VINCULACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- REGLA CLAVE: Un usuario puede tener 1 cuenta de Valorant Y 1 de Dota.
    UNIQUE(USUARIO_ID, JUEGO) 
);

-- ==========================================================
-- 3. MAPAS (Para el sistema de Veto en Valorant)
-- ==========================================================
CREATE TABLE MAPA (
    MAPA_ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL, -- 'Ascent', 'Bind', 'Haven'
    IMAGEN_URL TEXT,
    ACTIVO BOOLEAN DEFAULT TRUE -- Permite sacar mapas rotos o viejos
);

-- ==========================================================
-- 4. TORNEOS (El Evento de 3 Días)
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
-- 5. SALAS (El centro de la acción)
-- ==========================================================
CREATE TABLE SALA (
    SALA_ID SERIAL PRIMARY KEY,
    -- CREADOR: Puede ser un ADMIN o un HOST
    CREADOR_ID INT REFERENCES USUARIO(USUARIO_ID), 
    TORNEO_ID INT REFERENCES TORNEO(TORNEO_ID), -- Opcional
    
    NOMBRE VARCHAR(100), -- "Sala Intermedia #4"
    TIPO_SALA VARCHAR(50) DEFAULT 'BASICA', -- 'BASICA', 'INTERMEDIA', 'PERSONALIZADA'
    JUEGO VARCHAR(50) NOT NULL, -- 'DOTA2' o 'VALORANT'

    -- ECONOMÍA DE LA SALA
    COSTO_ENTRADA DECIMAL(10, 2) NOT NULL, 
    PREMIO_A_REPARTIR DECIMAL(10, 2) NOT NULL,
    GANANCIA_PLATAFORMA DECIMAL(10, 2) NOT NULL, 
    
    ESTADO VARCHAR(20) DEFAULT 'ESPERANDO', -- 'ESPERANDO', 'VETO_MAPAS', 'JUGANDO', 'FINALIZADA', 'CANCELADA'
    
    -- MAP VETO LOGIC
    MAPA_ELEGIDO_ID INT REFERENCES MAPA(MAPA_ID),
    VETO_LOG JSONB, -- Historial: { "turno": 1, "ban": "Bind", "team": "A" }
    
    RESULTADO_GANADOR VARCHAR(20), -- 'TEAM_A', 'TEAM_B'
    FECHA_CREACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 6. PARTICIPANTES (Gestión de Equipos y Slots)
-- ==========================================================
CREATE TABLE PARTICIPANTE_SALA (
    PARTICIPACION_ID SERIAL PRIMARY KEY,
    SALA_ID INT REFERENCES SALA(SALA_ID),
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID),
    -- Opcional: Vincular qué cuenta usó para jugar esta partida específica
    GAME_ACCOUNT_ID INT REFERENCES GAME_ACCOUNT(GAME_ACCOUNT_ID), 
    
    EQUIPO VARCHAR(10) NOT NULL, -- 'A' o 'B'
    ES_CAPITAN BOOLEAN DEFAULT FALSE, -- Importante para decidir quién banea mapas
    SLOT_INDEX INT, -- 0-4 (Equipo A), 5-9 (Equipo B)
    
    -- Registro de cómo pagó (Auditoría)
    PAGO_CON_BONO DECIMAL(10, 2) DEFAULT 0,
    PAGO_CON_REAL DECIMAL(10, 2) DEFAULT 0,
    
    UNIQUE(SALA_ID, SLOT_INDEX) -- Evita que dos jugadores ocupen la misma silla
);

-- ==========================================================
-- 7. SOLICITUDES DE RECARGA (Ingreso de Dinero)
-- ==========================================================
CREATE TABLE SOLICITUD_RECARGA (
    RECARGA_ID SERIAL PRIMARY KEY,
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID),
    MONTO DECIMAL(10, 2) NOT NULL CHECK (MONTO > 0),
    METODO VARCHAR(50), -- 'YAPE', 'PLIN', 'BINANCE'
    CODIGO_OPERACION VARCHAR(100), -- Para evitar duplicados
    FOTO_VOUCHER_URL TEXT, -- OBLIGATORIO
    
    -- ESTADOS: 'PENDIENTE', 'EN_PROCESO' (Tomado por Admin), 'COMPLETADA', 'RECHAZADA'
    ESTADO VARCHAR(20) DEFAULT 'PENDIENTE',
    
    -- SEMÁFORO: Qué admin está atendiendo esto ahora mismo
    ADMIN_ATENDIENDO_ID INT REFERENCES USUARIO(USUARIO_ID), 
    
    FECHA_SOLICITUD TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FECHA_CIERRE TIMESTAMP
);

-- ==========================================================
-- 8. SOLICITUDES DE RETIRO (Salida de Dinero)
-- ==========================================================
CREATE TABLE SOLICITUD_RETIRO (
    RETIRO_ID SERIAL PRIMARY KEY,
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID),
    
    -- REGLA DE NEGOCIO: Mínimo 20 soles
    MONTO DECIMAL(10, 2) NOT NULL CHECK (MONTO >= 20.00),
    CUENTA_DESTINO TEXT NOT NULL,
    
    -- ESTADOS: 'PENDIENTE', 'EN_PROCESO', 'PAGADO', 'RECHAZADO'
    ESTADO VARCHAR(20) DEFAULT 'PENDIENTE',
    
    -- SEMÁFORO: Evita el doble pago
    ADMIN_ATENDIENDO_ID INT REFERENCES USUARIO(USUARIO_ID),
    
    FOTO_CONSTANCIA_PAGO TEXT, -- Admin sube foto de que ya pagó
    FECHA_SOLICITUD TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FECHA_PAGO TIMESTAMP
);

-- ==========================================================
-- 9. LOG DE ACCIONES (Vigilancia para Hosts)
-- ==========================================================
CREATE TABLE LOG_ACCIONES (
    LOG_ID SERIAL PRIMARY KEY,
    USUARIO_ID INT REFERENCES USUARIO(USUARIO_ID), -- Quien hizo la acción (Host o Admin)
    ACCION VARCHAR(50), -- 'CREAR_SALA', 'CANCELAR_SALA', 'EDITAR_RESULTADO', 'BANEAR_MAPA'
    DETALLE JSONB, -- { "sala_id": 10, "motivo": "jugador desconectado" }
    FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
