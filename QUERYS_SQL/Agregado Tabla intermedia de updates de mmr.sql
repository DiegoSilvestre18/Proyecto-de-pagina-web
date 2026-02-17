-- 1. Aplicar el candado a la tabla que ya existe
ALTER TABLE GAME_ACCOUNT 
ADD CONSTRAINT UQ_USUARIO_JUEGO UNIQUE (USUARIO_ID, JUEGO);

-- 2. Crear la nueva tabla intermedia que nace de la relación "CAMBIA"
-- Observacion si se cambia al mismo jugador el mismo admin entonces mejor agregar su pripio
-- id
CREATE TABLE HISTORIAL_MMR_ADMIN (
    HISTORIAL_ID SERIAL PRIMARY KEY,
    ADMINISTRADOR_ID INT REFERENCES ADMINISTRADOR(ADMINISTRADOR_ID),
    USER_STAT_ID INT REFERENCES USUARIO_STATS(USER_STAT_ID),
    MMR_ANTERIOR INT NOT NULL,
    MMR_NUEVO INT NOT NULL,
    MOTIVO TEXT NOT NULL, -- Ej: 'Sanción por Smurf' o 'Calibración manual'
    FECHA_CAMBIO TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Commentario
COMMENT ON TABLE HISTORIAL_MMR_ADMIN IS 'Auditoría: Historial de cambios manuales de MMR por Administradores (Control de Smurfs)';