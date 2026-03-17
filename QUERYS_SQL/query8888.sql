-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

-- DROP SEQUENCE public.baneo_baneo_id_seq;

CREATE SEQUENCE public.baneo_baneo_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.baneo_baneo_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.baneo_baneo_id_seq TO postgres;

-- DROP SEQUENCE public.clan_clan_id_seq;

CREATE SEQUENCE public.clan_clan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.clan_clan_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.clan_clan_id_seq TO postgres;

-- DROP SEQUENCE public.game_account_game_account_id_seq;

CREATE SEQUENCE public.game_account_game_account_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.game_account_game_account_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.game_account_game_account_id_seq TO postgres;

-- DROP SEQUENCE public.historial_mmr_admin_historial_id_seq;

CREATE SEQUENCE public.historial_mmr_admin_historial_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.historial_mmr_admin_historial_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.historial_mmr_admin_historial_id_seq TO postgres;

-- DROP SEQUENCE public.log_acciones_log_id_seq;

CREATE SEQUENCE public.log_acciones_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.log_acciones_log_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.log_acciones_log_id_seq TO postgres;

-- DROP SEQUENCE public.mapa_mapa_id_seq;

CREATE SEQUENCE public.mapa_mapa_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.mapa_mapa_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.mapa_mapa_id_seq TO postgres;

-- DROP SEQUENCE public.movimientos_movimiento_id_seq;

CREATE SEQUENCE public.movimientos_movimiento_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.movimientos_movimiento_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.movimientos_movimiento_id_seq TO postgres;

-- DROP SEQUENCE public.participante_sala_participacion_id_seq;

CREATE SEQUENCE public.participante_sala_participacion_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.participante_sala_participacion_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.participante_sala_participacion_id_seq TO postgres;

-- DROP SEQUENCE public.sala_sala_id_seq;

CREATE SEQUENCE public.sala_sala_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.sala_sala_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.sala_sala_id_seq TO postgres;

-- DROP SEQUENCE public.solicitud_recarga_recarga_id_seq;

CREATE SEQUENCE public.solicitud_recarga_recarga_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.solicitud_recarga_recarga_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.solicitud_recarga_recarga_id_seq TO postgres;

-- DROP SEQUENCE public.solicitud_retiro_retiro_id_seq;

CREATE SEQUENCE public.solicitud_retiro_retiro_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.solicitud_retiro_retiro_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.solicitud_retiro_retiro_id_seq TO postgres;

-- DROP SEQUENCE public.torneo_torneo_id_seq;

CREATE SEQUENCE public.torneo_torneo_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.torneo_torneo_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.torneo_torneo_id_seq TO postgres;

-- DROP SEQUENCE public.usuario_stats_user_stat_id_seq;

CREATE SEQUENCE public.usuario_stats_user_stat_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.usuario_stats_user_stat_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.usuario_stats_user_stat_id_seq TO postgres;

-- DROP SEQUENCE public.usuario_usuario_id_seq;

CREATE SEQUENCE public.usuario_usuario_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.usuario_usuario_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.usuario_usuario_id_seq TO postgres;
-- public."__EFMigrationsHistory" definition

-- Drop table

-- DROP TABLE public."__EFMigrationsHistory";

CREATE TABLE public."__EFMigrationsHistory" ( "MigrationId" varchar(150) NOT NULL, "ProductVersion" varchar(32) NOT NULL, CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId"));

-- Permissions

ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;
GRANT ALL ON TABLE public."__EFMigrationsHistory" TO postgres;


-- public.clan definition

-- Drop table

-- DROP TABLE public.clan;

CREATE TABLE public.clan ( clan_id serial4 NOT NULL, nombre varchar(100) NOT NULL, descripcion text NULL, image_url varchar(255) NULL, CONSTRAINT clan_pkey PRIMARY KEY (clan_id));

-- Permissions

ALTER TABLE public.clan OWNER TO postgres;
GRANT ALL ON TABLE public.clan TO postgres;


-- public.mapa definition

-- Drop table

-- DROP TABLE public.mapa;

CREATE TABLE public.mapa ( mapa_id serial4 NOT NULL, nombre varchar(50) NOT NULL, imagen_url text NULL, activo bool DEFAULT true NULL, CONSTRAINT mapa_pkey PRIMARY KEY (mapa_id));

-- Permissions

ALTER TABLE public.mapa OWNER TO postgres;
GRANT ALL ON TABLE public.mapa TO postgres;


-- public.torneo definition

-- Drop table

-- DROP TABLE public.torneo;

CREATE TABLE public.torneo ( torneo_id serial4 NOT NULL, nombre varchar(100) NOT NULL, premio_pozo numeric(10, 2) NOT NULL, costo_inscripcion numeric(10, 2) NOT NULL, estado varchar(20) DEFAULT 'REGISTRO'::character varying NULL, fecha_inicio timestamp NULL, fecha_fin timestamp NULL, CONSTRAINT torneo_pkey PRIMARY KEY (torneo_id));

-- Permissions

ALTER TABLE public.torneo OWNER TO postgres;
GRANT ALL ON TABLE public.torneo TO postgres;


-- public.usuario definition

-- Drop table

-- DROP TABLE public.usuario;

CREATE TABLE public.usuario ( usuario_id serial4 NOT NULL, clan_id int4 NULL, username varchar(50) NOT NULL, nombre varchar(50) NOT NULL, ap_paterno varchar(100) NOT NULL, ap_materno varchar(100) NOT NULL, telefono varchar(10) NOT NULL, email varchar(100) NOT NULL, pass_hash text NOT NULL, saldo_real numeric(10, 2) DEFAULT 0.00 NULL, saldo_bono numeric(10, 2) DEFAULT 0.00 NULL, rol varchar(20) DEFAULT 'USER'::character varying NULL, partidas_jugadas int4 DEFAULT 0 NULL, fecha_registro timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT usuario_email_key UNIQUE (email), CONSTRAINT usuario_pkey PRIMARY KEY (usuario_id), CONSTRAINT usuario_saldo_bono_check CHECK ((saldo_bono >= (0)::numeric)), CONSTRAINT usuario_saldo_real_check CHECK ((saldo_real >= (0)::numeric)), CONSTRAINT usuario_username_key UNIQUE (username), CONSTRAINT usuario_clan_id_fkey FOREIGN KEY (clan_id) REFERENCES public.clan(clan_id));

-- Permissions

ALTER TABLE public.usuario OWNER TO postgres;
GRANT ALL ON TABLE public.usuario TO postgres;


-- public.usuario_stats definition

-- Drop table

-- DROP TABLE public.usuario_stats;

CREATE TABLE public.usuario_stats ( user_stat_id serial4 NOT NULL, usuario_id int4 NULL, juego varchar(50) NULL, elo_mmr int4 DEFAULT 0 NULL, wins int4 DEFAULT 0 NULL, loses int4 DEFAULT 0 NULL, rango_medalla varchar(50) NULL, CONSTRAINT usuario_stats_pkey PRIMARY KEY (user_stat_id), CONSTRAINT usuario_stats_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.usuario_stats OWNER TO postgres;
GRANT ALL ON TABLE public.usuario_stats TO postgres;


-- public.baneo definition

-- Drop table

-- DROP TABLE public.baneo;

CREATE TABLE public.baneo ( baneo_id serial4 NOT NULL, usuario_id int4 NULL, admin_id int4 NULL, motivo text NOT NULL, tiempo int4 NOT NULL, fecha_baneo timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT baneo_pkey PRIMARY KEY (baneo_id), CONSTRAINT baneo_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.usuario(usuario_id), CONSTRAINT baneo_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.baneo OWNER TO postgres;
GRANT ALL ON TABLE public.baneo TO postgres;


-- public.game_account definition

-- Drop table

-- DROP TABLE public.game_account;

CREATE TABLE public.game_account ( game_account_id serial4 NOT NULL, usuario_id int4 NULL, juego varchar(50) NOT NULL, id_externo varchar(100) NOT NULL, id_visible varchar(100) NULL, rango_actual varchar(50) NULL, es_rango_manual bool DEFAULT false NULL, fecha_vinculacion timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT game_account_pkey PRIMARY KEY (game_account_id), CONSTRAINT uq_usuario_juego UNIQUE (usuario_id, juego), CONSTRAINT game_account_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.game_account OWNER TO postgres;
GRANT ALL ON TABLE public.game_account TO postgres;


-- public.historial_mmr_admin definition

-- Drop table

-- DROP TABLE public.historial_mmr_admin;

CREATE TABLE public.historial_mmr_admin ( historial_id serial4 NOT NULL, admin_id int4 NULL, user_stat_id int4 NULL, mmr_anterior int4 NOT NULL, mmr_nuevo int4 NOT NULL, motivo text NOT NULL, fecha_cambio timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT historial_mmr_admin_pkey PRIMARY KEY (historial_id), CONSTRAINT historial_mmr_admin_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.usuario(usuario_id), CONSTRAINT historial_mmr_admin_user_stat_id_fkey FOREIGN KEY (user_stat_id) REFERENCES public.usuario_stats(user_stat_id));

-- Permissions

ALTER TABLE public.historial_mmr_admin OWNER TO postgres;
GRANT ALL ON TABLE public.historial_mmr_admin TO postgres;


-- public.log_acciones definition

-- Drop table

-- DROP TABLE public.log_acciones;

CREATE TABLE public.log_acciones ( log_id serial4 NOT NULL, usuario_id int4 NULL, accion varchar(50) NULL, detalle jsonb NULL, fecha timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT log_acciones_pkey PRIMARY KEY (log_id), CONSTRAINT log_acciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.log_acciones OWNER TO postgres;
GRANT ALL ON TABLE public.log_acciones TO postgres;


-- public.sala definition

-- Drop table

-- DROP TABLE public.sala;

CREATE TABLE public.sala ( sala_id serial4 NOT NULL, creador_id int4 NULL, torneo_id int4 NULL, nombre varchar(100) NULL, tipo_sala varchar(50) DEFAULT 'BASICA'::character varying NULL, juego varchar(50) NOT NULL, costo_entrada numeric(10, 2) NOT NULL, premio_a_repartir numeric(10, 2) NOT NULL, ganancia_plataforma numeric(10, 2) NOT NULL, estado varchar(20) DEFAULT 'ESPERANDO'::character varying NULL, mapa_elegido_id int4 NULL, veto_log jsonb NULL, resultado_ganador varchar(20) NULL, fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NULL, nombrelobby text NULL, passwordlobby text NULL, "Formato" varchar(50) DEFAULT '1v1'::character varying NULL, "Capitan1Id" int4 NULL, "Capitan2Id" int4 NULL, "GanadorSorteoId" int4 NULL, "TurnoActualId" int4 NULL, mmr_minimo int4 DEFAULT 0 NOT NULL, mmr_maximo int4 DEFAULT 0 NOT NULL, CONSTRAINT sala_pkey PRIMARY KEY (sala_id), CONSTRAINT sala_creador_id_fkey FOREIGN KEY (creador_id) REFERENCES public.usuario(usuario_id), CONSTRAINT sala_mapa_elegido_id_fkey FOREIGN KEY (mapa_elegido_id) REFERENCES public.mapa(mapa_id), CONSTRAINT sala_torneo_id_fkey FOREIGN KEY (torneo_id) REFERENCES public.torneo(torneo_id));

-- Permissions

ALTER TABLE public.sala OWNER TO postgres;
GRANT ALL ON TABLE public.sala TO postgres;


-- public.solicitud_recarga definition

-- Drop table

-- DROP TABLE public.solicitud_recarga;

CREATE TABLE public.solicitud_recarga ( recarga_id serial4 NOT NULL, usuario_id int4 NULL, monto numeric(10, 2) NOT NULL, moneda varchar(10) DEFAULT 'PEN'::character varying NULL, metodo varchar(50) NULL, cuenta_destino varchar(100) NULL, nro_operacion varchar(100) NULL, estado varchar(20) DEFAULT 'PENDIENTE'::character varying NULL, admin_atendiendo_id int4 NULL, fecha_emision timestamp DEFAULT CURRENT_TIMESTAMP NULL, fecha_cierre timestamp NULL, CONSTRAINT solicitud_recarga_monto_check CHECK ((monto > (0)::numeric)), CONSTRAINT solicitud_recarga_pkey PRIMARY KEY (recarga_id), CONSTRAINT solicitud_recarga_admin_atendiendo_id_fkey FOREIGN KEY (admin_atendiendo_id) REFERENCES public.usuario(usuario_id), CONSTRAINT solicitud_recarga_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.solicitud_recarga OWNER TO postgres;
GRANT ALL ON TABLE public.solicitud_recarga TO postgres;


-- public.solicitud_retiro definition

-- Drop table

-- DROP TABLE public.solicitud_retiro;

CREATE TABLE public.solicitud_retiro ( retiro_id serial4 NOT NULL, usuario_id int4 NULL, monto numeric(10, 2) NOT NULL, moneda varchar(10) DEFAULT 'PEN'::character varying NULL, metodo varchar(50) NOT NULL, cuenta_destino text NOT NULL, nro_operacion varchar(100) NULL, estado varchar(20) DEFAULT 'PENDIENTE'::character varying NULL, admin_atendiendo_id int4 NULL, fecha_emision timestamp DEFAULT CURRENT_TIMESTAMP NULL, fecha_pago timestamp NULL, CONSTRAINT solicitud_retiro_monto_check CHECK ((monto >= 20.00)), CONSTRAINT solicitud_retiro_pkey PRIMARY KEY (retiro_id), CONSTRAINT solicitud_retiro_admin_atendiendo_id_fkey FOREIGN KEY (admin_atendiendo_id) REFERENCES public.usuario(usuario_id), CONSTRAINT solicitud_retiro_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.solicitud_retiro OWNER TO postgres;
GRANT ALL ON TABLE public.solicitud_retiro TO postgres;


-- public.movimientos definition

-- Drop table

-- DROP TABLE public.movimientos;

CREATE TABLE public.movimientos ( movimiento_id serial4 NOT NULL, usuario_id int4 NULL, recarga_id int4 NULL, retiro_id int4 NULL, sala_id int4 NULL, tipo varchar(50) NOT NULL, monto_real numeric(10, 2) DEFAULT 0.00 NOT NULL, monto_bono numeric(10, 2) DEFAULT 0.00 NOT NULL, concepto text NOT NULL, fecha timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT chk_movimiento_origen CHECK ((((recarga_id IS NOT NULL) AND (sala_id IS NULL) AND (retiro_id IS NULL)) OR ((recarga_id IS NULL) AND (sala_id IS NOT NULL) AND (retiro_id IS NULL)) OR ((recarga_id IS NULL) AND (sala_id IS NULL) AND (retiro_id IS NOT NULL)) OR ((recarga_id IS NULL) AND (sala_id IS NULL) AND (retiro_id IS NULL)))), CONSTRAINT movimientos_pkey PRIMARY KEY (movimiento_id), CONSTRAINT movimientos_recarga_id_fkey FOREIGN KEY (recarga_id) REFERENCES public.solicitud_recarga(recarga_id), CONSTRAINT movimientos_retiro_id_fkey FOREIGN KEY (retiro_id) REFERENCES public.solicitud_retiro(retiro_id), CONSTRAINT movimientos_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.sala(sala_id), CONSTRAINT movimientos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.movimientos OWNER TO postgres;
GRANT ALL ON TABLE public.movimientos TO postgres;


-- public.participante_sala definition

-- Drop table

-- DROP TABLE public.participante_sala;

CREATE TABLE public.participante_sala ( participacion_id serial4 NOT NULL, sala_id int4 NULL, usuario_id int4 NULL, game_account_id int4 NULL, equipo varchar(50) NOT NULL, es_capitan bool DEFAULT false NULL, slot_index int4 NULL, pago_con_bono numeric(10, 2) DEFAULT 0 NULL, pago_con_real numeric(10, 2) DEFAULT 0 NULL, CONSTRAINT participante_sala_pkey PRIMARY KEY (participacion_id), CONSTRAINT uq_sala_slot UNIQUE (sala_id, slot_index), CONSTRAINT participante_sala_game_account_id_fkey FOREIGN KEY (game_account_id) REFERENCES public.game_account(game_account_id), CONSTRAINT participante_sala_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.sala(sala_id), CONSTRAINT participante_sala_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id));

-- Permissions

ALTER TABLE public.participante_sala OWNER TO postgres;
GRANT ALL ON TABLE public.participante_sala TO postgres;




-- Permissions

GRANT ALL ON SCHEMA public TO postgres;