ALTER TABLE sala ADD COLUMN "mmr_minimo" integer NOT NULL DEFAULT 0;
ALTER TABLE sala ADD COLUMN "mmr_maximo" integer NOT NULL DEFAULT 10000;

ALTER TABLE sala ADD COLUMN formato VARCHAR(50) DEFAULT '1v1';
ALTER TABLE sala ADD COLUMN capitan1_id INTEGER NULL;
ALTER TABLE sala ADD COLUMN capitan2_id INTEGER NULL;
ALTER TABLE sala ADD COLUMN ganador_sorteo_id INTEGER NULL;
ALTER TABLE sala ADD COLUMN turno_actual_id INTEGER NULL;

-- Primero, por si acaso, renombramos la de formato
ALTER TABLE sala RENAME COLUMN formato TO "Formato";

-- Luego, las de los capitanes y el turno (con las comillas dobles para que PostgreSQL respete las mayúsculas)
ALTER TABLE sala RENAME COLUMN capitan1_id TO "Capitan1Id";
ALTER TABLE sala RENAME COLUMN capitan2_id TO "Capitan2Id";
ALTER TABLE sala RENAME COLUMN ganador_sorteo_id TO "GanadorSorteoId";
ALTER TABLE sala RENAME COLUMN turno_actual_id TO "TurnoActualId";

-- Ampliamos la columna equipo para que entre "ESPERANDO_DRAFT"
ALTER TABLE participante_sala ALTER COLUMN equipo TYPE VARCHAR(50);

-- Por si acaso, ampliamos también el tipo en la tabla movimientos
ALTER TABLE movimientos ALTER COLUMN tipo TYPE VARCHAR(50);


ALTER TABLE sala ADD nombrelobby TEXT;
ALTER TABLE sala ADD passwordlobby TEXT;

UPDATE sala 
SET "Capitan1Id" = 13, "Capitan2Id" = 14, "TurnoActualId" = 13, estado = 'SORTEO'
WHERE sala_id = 17;
