--
-- PostgreSQL database dump
--

\restrict dNAVAYWkaEhipinfjcrYWA4uFK2YqBT7kCdGSbusnjENFUvGTehvAkcfyJsNbZd

-- Dumped from database version 17.8
-- Dumped by pg_dump version 17.8

-- Started on 2026-03-12 20:41:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 18033)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 245 (class 1259 OID 18575)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 18540)
-- Name: baneo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.baneo (
    baneo_id integer NOT NULL,
    usuario_id integer,
    admin_id integer,
    motivo text NOT NULL,
    tiempo integer NOT NULL,
    fecha_baneo timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.baneo OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18539)
-- Name: baneo_baneo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.baneo_baneo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.baneo_baneo_id_seq OWNER TO postgres;

--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 241
-- Name: baneo_baneo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.baneo_baneo_id_seq OWNED BY public.baneo.baneo_id;


--
-- TOC entry 218 (class 1259 OID 18306)
-- Name: clan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clan (
    clan_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    image_url character varying(255)
);


ALTER TABLE public.clan OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 18305)
-- Name: clan_clan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clan_clan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clan_clan_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 217
-- Name: clan_clan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clan_clan_id_seq OWNED BY public.clan.clan_id;


--
-- TOC entry 222 (class 1259 OID 18340)
-- Name: game_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_account (
    game_account_id integer NOT NULL,
    usuario_id integer,
    juego character varying(50) NOT NULL,
    id_externo character varying(100) NOT NULL,
    id_visible character varying(100),
    rango_actual character varying(50),
    es_rango_manual boolean DEFAULT false,
    fecha_vinculacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.game_account OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18339)
-- Name: game_account_game_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.game_account_game_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.game_account_game_account_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 221
-- Name: game_account_game_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.game_account_game_account_id_seq OWNED BY public.game_account.game_account_id;


--
-- TOC entry 226 (class 1259 OID 18371)
-- Name: historial_mmr_admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_mmr_admin (
    historial_id integer NOT NULL,
    admin_id integer,
    user_stat_id integer,
    mmr_anterior integer NOT NULL,
    mmr_nuevo integer NOT NULL,
    motivo text NOT NULL,
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historial_mmr_admin OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18370)
-- Name: historial_mmr_admin_historial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_mmr_admin_historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_mmr_admin_historial_id_seq OWNER TO postgres;

--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 225
-- Name: historial_mmr_admin_historial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_mmr_admin_historial_id_seq OWNED BY public.historial_mmr_admin.historial_id;


--
-- TOC entry 244 (class 1259 OID 18560)
-- Name: log_acciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_acciones (
    log_id integer NOT NULL,
    usuario_id integer,
    accion character varying(50),
    detalle jsonb,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.log_acciones OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 18559)
-- Name: log_acciones_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_acciones_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_acciones_log_id_seq OWNER TO postgres;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 243
-- Name: log_acciones_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_acciones_log_id_seq OWNED BY public.log_acciones.log_id;


--
-- TOC entry 228 (class 1259 OID 18391)
-- Name: mapa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mapa (
    mapa_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    imagen_url text,
    activo boolean DEFAULT true
);


ALTER TABLE public.mapa OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18390)
-- Name: mapa_mapa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mapa_mapa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mapa_mapa_id_seq OWNER TO postgres;

--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 227
-- Name: mapa_mapa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mapa_mapa_id_seq OWNED BY public.mapa.mapa_id;


--
-- TOC entry 240 (class 1259 OID 18507)
-- Name: movimientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimientos (
    movimiento_id integer NOT NULL,
    usuario_id integer,
    recarga_id integer,
    retiro_id integer,
    sala_id integer,
    tipo character varying(50) NOT NULL,
    monto_real numeric(10,2) DEFAULT 0.00 NOT NULL,
    monto_bono numeric(10,2) DEFAULT 0.00 NOT NULL,
    concepto text NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_movimiento_origen CHECK ((((recarga_id IS NOT NULL) AND (sala_id IS NULL) AND (retiro_id IS NULL)) OR ((recarga_id IS NULL) AND (sala_id IS NOT NULL) AND (retiro_id IS NULL)) OR ((recarga_id IS NULL) AND (sala_id IS NULL) AND (retiro_id IS NOT NULL)) OR ((recarga_id IS NULL) AND (sala_id IS NULL) AND (retiro_id IS NULL))))
);


ALTER TABLE public.movimientos OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18506)
-- Name: movimientos_movimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimientos_movimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimientos_movimiento_id_seq OWNER TO postgres;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 239
-- Name: movimientos_movimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimientos_movimiento_id_seq OWNED BY public.movimientos.movimiento_id;


--
-- TOC entry 234 (class 1259 OID 18436)
-- Name: participante_sala; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participante_sala (
    participacion_id integer NOT NULL,
    sala_id integer,
    usuario_id integer,
    game_account_id integer,
    equipo character varying(50) NOT NULL,
    es_capitan boolean DEFAULT false,
    slot_index integer,
    pago_con_bono numeric(10,2) DEFAULT 0,
    pago_con_real numeric(10,2) DEFAULT 0
);


ALTER TABLE public.participante_sala OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18435)
-- Name: participante_sala_participacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participante_sala_participacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participante_sala_participacion_id_seq OWNER TO postgres;

--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 233
-- Name: participante_sala_participacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participante_sala_participacion_id_seq OWNED BY public.participante_sala.participacion_id;


--
-- TOC entry 232 (class 1259 OID 18409)
-- Name: sala; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sala (
    sala_id integer NOT NULL,
    creador_id integer,
    torneo_id integer,
    nombre character varying(100),
    tipo_sala character varying(50) DEFAULT 'BASICA'::character varying,
    juego character varying(50) NOT NULL,
    costo_entrada numeric(10,2) NOT NULL,
    premio_a_repartir numeric(10,2) NOT NULL,
    ganancia_plataforma numeric(10,2) NOT NULL,
    estado character varying(20) DEFAULT 'ESPERANDO'::character varying,
    mapa_elegido_id integer,
    veto_log jsonb,
    resultado_ganador character varying(20),
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nombrelobby text,
    passwordlobby text,
    "Formato" character varying(50) DEFAULT '1v1'::character varying,
    "Capitan1Id" integer,
    "Capitan2Id" integer,
    "GanadorSorteoId" integer,
    "TurnoActualId" integer
);


ALTER TABLE public.sala OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18408)
-- Name: sala_sala_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sala_sala_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sala_sala_id_seq OWNER TO postgres;

--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 231
-- Name: sala_sala_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sala_sala_id_seq OWNED BY public.sala.sala_id;


--
-- TOC entry 236 (class 1259 OID 18463)
-- Name: solicitud_recarga; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud_recarga (
    recarga_id integer NOT NULL,
    usuario_id integer,
    monto numeric(10,2) NOT NULL,
    moneda character varying(10) DEFAULT 'PEN'::character varying,
    metodo character varying(50),
    cuenta_destino character varying(100),
    nro_operacion character varying(100),
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    admin_atendiendo_id integer,
    fecha_emision timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre timestamp without time zone,
    CONSTRAINT solicitud_recarga_monto_check CHECK ((monto > (0)::numeric))
);


ALTER TABLE public.solicitud_recarga OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18462)
-- Name: solicitud_recarga_recarga_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitud_recarga_recarga_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitud_recarga_recarga_id_seq OWNER TO postgres;

--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 235
-- Name: solicitud_recarga_recarga_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitud_recarga_recarga_id_seq OWNED BY public.solicitud_recarga.recarga_id;


--
-- TOC entry 238 (class 1259 OID 18484)
-- Name: solicitud_retiro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud_retiro (
    retiro_id integer NOT NULL,
    usuario_id integer,
    monto numeric(10,2) NOT NULL,
    moneda character varying(10) DEFAULT 'PEN'::character varying,
    metodo character varying(50) NOT NULL,
    cuenta_destino text NOT NULL,
    nro_operacion character varying(100),
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    admin_atendiendo_id integer,
    fecha_emision timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_pago timestamp without time zone,
    CONSTRAINT solicitud_retiro_monto_check CHECK ((monto >= 20.00))
);


ALTER TABLE public.solicitud_retiro OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18483)
-- Name: solicitud_retiro_retiro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitud_retiro_retiro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitud_retiro_retiro_id_seq OWNER TO postgres;

--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 237
-- Name: solicitud_retiro_retiro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitud_retiro_retiro_id_seq OWNED BY public.solicitud_retiro.retiro_id;


--
-- TOC entry 230 (class 1259 OID 18401)
-- Name: torneo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.torneo (
    torneo_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    premio_pozo numeric(10,2) NOT NULL,
    costo_inscripcion numeric(10,2) NOT NULL,
    estado character varying(20) DEFAULT 'REGISTRO'::character varying,
    fecha_inicio timestamp without time zone,
    fecha_fin timestamp without time zone
);


ALTER TABLE public.torneo OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18400)
-- Name: torneo_torneo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.torneo_torneo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.torneo_torneo_id_seq OWNER TO postgres;

--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 229
-- Name: torneo_torneo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.torneo_torneo_id_seq OWNED BY public.torneo.torneo_id;


--
-- TOC entry 220 (class 1259 OID 18315)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    usuario_id integer NOT NULL,
    clan_id integer,
    username character varying(50) NOT NULL,
    nombre character varying(50) NOT NULL,
    ap_paterno character varying(100) NOT NULL,
    ap_materno character varying(100) NOT NULL,
    telefono character varying(10) NOT NULL,
    email character varying(100) NOT NULL,
    pass_hash text NOT NULL,
    saldo_real numeric(10,2) DEFAULT 0.00,
    saldo_bono numeric(10,2) DEFAULT 0.00,
    rol character varying(20) DEFAULT 'USER'::character varying,
    partidas_jugadas integer DEFAULT 0,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuario_saldo_bono_check CHECK ((saldo_bono >= (0)::numeric)),
    CONSTRAINT usuario_saldo_real_check CHECK ((saldo_real >= (0)::numeric))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 18356)
-- Name: usuario_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_stats (
    user_stat_id integer NOT NULL,
    usuario_id integer,
    juego character varying(50),
    elo_mmr integer DEFAULT 0,
    wins integer DEFAULT 0,
    loses integer DEFAULT 0,
    rango_medalla character varying(50)
);


ALTER TABLE public.usuario_stats OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18355)
-- Name: usuario_stats_user_stat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_stats_user_stat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_stats_user_stat_id_seq OWNER TO postgres;

--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 223
-- Name: usuario_stats_user_stat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_stats_user_stat_id_seq OWNED BY public.usuario_stats.user_stat_id;


--
-- TOC entry 219 (class 1259 OID 18314)
-- Name: usuario_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_usuario_id_seq OWNED BY public.usuario.usuario_id;


--
-- TOC entry 4852 (class 2604 OID 18543)
-- Name: baneo baneo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baneo ALTER COLUMN baneo_id SET DEFAULT nextval('public.baneo_baneo_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 18309)
-- Name: clan clan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clan ALTER COLUMN clan_id SET DEFAULT nextval('public.clan_clan_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 18343)
-- Name: game_account game_account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_account ALTER COLUMN game_account_id SET DEFAULT nextval('public.game_account_game_account_id_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 18374)
-- Name: historial_mmr_admin historial_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_mmr_admin ALTER COLUMN historial_id SET DEFAULT nextval('public.historial_mmr_admin_historial_id_seq'::regclass);


--
-- TOC entry 4854 (class 2604 OID 18563)
-- Name: log_acciones log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_acciones ALTER COLUMN log_id SET DEFAULT nextval('public.log_acciones_log_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 18394)
-- Name: mapa mapa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapa ALTER COLUMN mapa_id SET DEFAULT nextval('public.mapa_mapa_id_seq'::regclass);


--
-- TOC entry 4848 (class 2604 OID 18510)
-- Name: movimientos movimiento_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos ALTER COLUMN movimiento_id SET DEFAULT nextval('public.movimientos_movimiento_id_seq'::regclass);


--
-- TOC entry 4836 (class 2604 OID 18439)
-- Name: participante_sala participacion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante_sala ALTER COLUMN participacion_id SET DEFAULT nextval('public.participante_sala_participacion_id_seq'::regclass);


--
-- TOC entry 4831 (class 2604 OID 18412)
-- Name: sala sala_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala ALTER COLUMN sala_id SET DEFAULT nextval('public.sala_sala_id_seq'::regclass);


--
-- TOC entry 4840 (class 2604 OID 18466)
-- Name: solicitud_recarga recarga_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_recarga ALTER COLUMN recarga_id SET DEFAULT nextval('public.solicitud_recarga_recarga_id_seq'::regclass);


--
-- TOC entry 4844 (class 2604 OID 18487)
-- Name: solicitud_retiro retiro_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_retiro ALTER COLUMN retiro_id SET DEFAULT nextval('public.solicitud_retiro_retiro_id_seq'::regclass);


--
-- TOC entry 4829 (class 2604 OID 18404)
-- Name: torneo torneo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.torneo ALTER COLUMN torneo_id SET DEFAULT nextval('public.torneo_torneo_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 18318)
-- Name: usuario usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuario_usuario_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 18359)
-- Name: usuario_stats user_stat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_stats ALTER COLUMN user_stat_id SET DEFAULT nextval('public.usuario_stats_user_stat_id_seq'::regclass);


--
-- TOC entry 5094 (class 0 OID 18575)
-- Dependencies: 245
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
\.


--
-- TOC entry 5091 (class 0 OID 18540)
-- Dependencies: 242
-- Data for Name: baneo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baneo (baneo_id, usuario_id, admin_id, motivo, tiempo, fecha_baneo) FROM stdin;
1	21	1	Baneado desde el Panel de Administración	9999	2026-03-11 15:53:49.714911
2	25	1	Baneado desde el Panel de Administración	9999	2026-03-12 10:50:02.461832
\.


--
-- TOC entry 5067 (class 0 OID 18306)
-- Dependencies: 218
-- Data for Name: clan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clan (clan_id, nombre, descripcion, image_url) FROM stdin;
\.


--
-- TOC entry 5071 (class 0 OID 18340)
-- Dependencies: 222
-- Data for Name: game_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_account (game_account_id, usuario_id, juego, id_externo, id_visible, rango_actual, es_rango_manual, fecha_vinculacion) FROM stdin;
1	3	DOTA	1093051383	alejandroporala	UNRANKED	f	2026-03-05 13:14:08.402441
2	7	DOTA	1093051383	alejandroporala	UNRANKED	f	2026-03-06 18:38:18.782341
3	11	DOTA	840354217	puss4	80	f	2026-03-06 19:06:51.206484
4	12	DOTA	145094446	FantOSHINI	63	f	2026-03-09 11:35:12.866432
5	13	DOTA	1088797393	Swap comend	55	f	2026-03-09 11:36:37.555185
6	14	DOTA	221715553	ハートアライアンスラ	32	f	2026-03-09 11:37:27.325411
7	15	DOTA	886818459	DOMADORDETHERIANS	53	f	2026-03-09 11:38:11.814239
8	16	DOTA	379029773	dukisoooor	62	f	2026-03-09 11:39:21.632626
9	17	DOTA	253048903	GatoCocaCola	51	f	2026-03-09 11:40:04.593927
10	18	DOTA	329646455	IGUAL VOY A SUBIR PAPETO	52	f	2026-03-09 11:40:45.279201
11	19	DOTA	346252339	Jordy	63	f	2026-03-09 11:42:08.062084
12	21	DOTA	393905450	commend x commend	80	f	2026-03-09 11:42:42.819975
13	20	DOTA	393905450	commend x commend	80	f	2026-03-09 11:44:23.996669
16	26	DOTA	880186792	Kenyu Yukimiya	924	f	2026-03-12 20:01:02.623272
17	32	DOTA	981148202	GATO TECHERO	2618	f	2026-03-12 20:09:21.177493
\.


--
-- TOC entry 5075 (class 0 OID 18371)
-- Dependencies: 226
-- Data for Name: historial_mmr_admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_mmr_admin (historial_id, admin_id, user_stat_id, mmr_anterior, mmr_nuevo, motivo, fecha_cambio) FROM stdin;
\.


--
-- TOC entry 5093 (class 0 OID 18560)
-- Dependencies: 244
-- Data for Name: log_acciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_acciones (log_id, usuario_id, accion, detalle, fecha) FROM stdin;
\.


--
-- TOC entry 5077 (class 0 OID 18391)
-- Dependencies: 228
-- Data for Name: mapa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mapa (mapa_id, nombre, imagen_url, activo) FROM stdin;
\.


--
-- TOC entry 5089 (class 0 OID 18507)
-- Dependencies: 240
-- Data for Name: movimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimientos (movimiento_id, usuario_id, recarga_id, retiro_id, sala_id, tipo, monto_real, monto_bono, concepto, fecha) FROM stdin;
1	2	2	\N	\N	INGRESO	20.00	0.00	Recarga Plin - Recibido en: 926621830	2026-03-03 20:11:04.918871
2	3	3	\N	\N	INGRESO	300.00	0.00	Recarga Plin - Recibido en: COBRA9278	2026-03-04 10:34:45.477598
3	3	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 1	2026-03-05 13:17:21.617201
4	3	\N	\N	\N	EGRESO	21.00	0.00	Inscripción a Sala 4	2026-03-05 13:35:53.863916
5	3	\N	\N	\N	EGRESO	20.00	0.00	Inscripción a Sala 2	2026-03-05 15:19:37.538497
6	3	\N	\N	\N	EGRESO	200.00	0.00	Inscripción a Sala 5	2026-03-05 15:57:15.893558
7	3	\N	\N	\N	EGRESO	18.00	0.00	Inscripción a Sala 6	2026-03-06 16:05:39.294527
8	3	\N	\N	\N	EGRESO	27.00	0.00	Inscripción a Sala 7	2026-03-06 16:12:50.222484
9	3	4	\N	\N	INGRESO	200.00	0.00	Recarga Yape - Recibido en: SIUUUUUU	2026-03-06 16:31:17.673812
10	3	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 8	2026-03-06 16:31:50.600992
11	3	\N	\N	\N	EGRESO	101.00	0.00	Inscripción a Sala 9	2026-03-06 16:56:55.17835
12	3	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 10	2026-03-06 17:06:18.769225
13	7	5	\N	\N	INGRESO	22.00	0.00	Recarga Yape - Recibido en: PLIN	2026-03-06 18:36:09.76963
14	7	\N	\N	\N	EGRESO	18.00	0.00	Inscripción a Sala 11	2026-03-06 18:45:55.330175
15	11	6	\N	\N	INGRESO	300.00	0.00	Recarga Yape - Recibido en: ,ñ,	2026-03-06 19:19:51.147222
16	3	7	\N	\N	INGRESO	300.00	0.00	Recarga Yape - Recibido en: dawa	2026-03-08 18:51:38.397925
17	3	\N	\N	\N	EGRESO	15.00	0.00	Inscripción a Sala 12	2026-03-08 18:52:21.411661
18	3	8	\N	\N	INGRESO	222.00	0.00	Recarga Yape - Recibido en: werewrew	2026-03-08 23:09:58.498128
19	3	9	\N	\N	INGRESO	222.00	0.00	Recarga Yape - Recibido en: 5454	2026-03-08 23:12:14.621322
20	3	11	\N	\N	INGRESO	100.00	0.00	Recarga Yape - Recibido en: ewee	2026-03-08 23:13:01.109087
21	3	12	\N	\N	INGRESO	100.00	0.00	Recarga Yape - Recibido en: asasa	2026-03-08 23:15:27.156351
22	3	13	\N	\N	INGRESO	300.00	0.00	Recarga Plin - Recibido en: asas	2026-03-08 23:44:03.000536
23	3	14	\N	\N	INGRESO	300.00	0.00	Recarga Yape - Recibido en: asas	2026-03-08 23:44:21.776226
24	3	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:05:51.834166
25	12	15	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:54:39.556663
26	13	16	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:54:43.652767
27	14	17	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:54:49.062848
28	15	18	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:54:51.91797
29	16	19	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:54:54.019915
30	17	20	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:54:56.253707
31	18	21	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:54:58.215287
32	19	22	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:55:00.567354
33	20	23	\N	\N	INGRESO	1000.00	0.00	Recarga Yape - Recibido en: 	2026-03-09 11:55:02.424563
34	20	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:55:28.139932
35	19	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:55:44.248763
36	18	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:55:51.759948
37	17	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:56:00.030826
38	16	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:56:06.398539
39	15	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:56:13.973663
40	14	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:56:24.336122
41	12	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:56:53.418154
42	13	\N	\N	\N	EGRESO	10.00	0.00	Inscripción a Sala 13	2026-03-09 11:57:27.769161
43	20	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:11.793474
44	19	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:16.833265
45	18	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:19.806238
46	17	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:22.772728
47	16	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:25.325444
48	15	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:28.344269
49	14	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:30.88058
50	13	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:34.109724
51	12	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:05:37.108665
52	3	\N	\N	\N	EGRESO	26.00	0.00	Inscripción a Sala 14	2026-03-09 12:07:52.882837
53	3	\N	\N	\N	EGRESO	14.00	0.00	Inscripción a Sala 15	2026-03-09 12:36:16.293851
54	20	\N	\N	\N	EGRESO	14.00	0.00	Inscripción a Sala 15	2026-03-09 12:36:41.189153
55	19	\N	\N	\N	EGRESO	14.00	0.00	Inscripción a Sala 15	2026-03-09 12:37:07.250752
56	17	\N	\N	\N	EGRESO	14.00	0.00	Inscripción a Sala 15	2026-03-09 12:52:36.543419
57	17	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:02:26.214712
58	12	\N	\N	\N	EGRESO	200.00	0.00	Inscripción a Sala 5	2026-03-09 14:02:35.457497
59	12	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:02:45.15553
60	13	\N	\N	\N	EGRESO	200.00	0.00	Inscripción a Sala 5	2026-03-09 14:02:53.774597
61	13	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:03:06.269706
62	14	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:03:24.732375
63	15	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:03:30.15533
64	16	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:03:35.768042
65	18	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:08:03.829567
66	19	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:08:38.284787
67	20	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:08:42.546453
68	3	\N	\N	\N	EGRESO	28.00	0.00	Inscripción a Sala 16	2026-03-09 14:08:46.308175
69	12	\N	\N	\N	EGRESO	20.00	0.00	Inscripción a Sala 2	2026-03-09 14:39:26.248273
78	13	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:46:01.649096
79	14	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:46:28.451966
80	12	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:46:43.456522
81	3	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:47:26.849165
82	20	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:47:30.232712
83	19	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:47:32.651142
84	18	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:47:35.080807
85	17	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:47:37.669439
86	16	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:47:41.013615
87	15	\N	\N	\N	EGRESO	33.00	0.00	Inscripción a Sala 17	2026-03-09 14:47:43.643041
88	14	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:44:10.790186
89	12	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:44:44.382223
90	13	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:44:53.192287
91	15	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:44:56.218324
92	16	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:44:58.808647
93	17	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:45:01.541198
94	18	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:45:04.526295
95	19	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:45:06.952604
96	20	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:45:09.420695
97	3	\N	\N	\N	EGRESO	44.00	0.00	Inscripción a Sala 18	2026-03-09 15:45:11.84047
98	18	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-10 13:01:27.56701
99	20	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 15:00:24.24442
100	19	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 15:01:07.853416
101	12	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 15:25:05.219544
102	13	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 15:31:24.817832
103	14	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 16:43:27.258376
104	15	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 16:43:56.343186
105	16	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 16:44:19.912331
106	17	\N	\N	\N	EGRESO	5.00	0.00	Inscripción a Sala 21	2026-03-10 16:44:49.087175
107	12	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:40:17.251289
108	13	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:40:36.262979
109	14	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:41:02.624597
110	15	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:41:25.557118
111	16	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:41:40.405279
112	17	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:41:57.629456
113	18	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:42:10.707236
114	19	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:42:25.251742
115	20	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:42:33.333124
116	3	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 22	2026-03-10 22:43:21.474358
117	12	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:50:25.177113
118	13	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:50:45.216202
119	14	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:50:51.719776
120	15	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:50:57.947928
121	16	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:51:06.664704
122	17	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:51:14.299197
123	18	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:51:20.325388
124	19	\N	\N	\N	EGRESO	3.00	0.00	Inscripción a Sala 23	2026-03-11 10:51:29.934248
125	12	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:04:45.133602
126	13	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:05:02.437226
127	14	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:05:09.012581
128	15	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:05:15.907913
129	16	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:05:24.777341
130	17	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:05:44.430234
131	19	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:05:55.645216
132	20	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:06:16.617668
133	21	25	\N	\N	INGRESO	10000.00	0.00	Recarga Yape - Recibido en: siuuuu	2026-03-11 11:10:12.692364
134	21	\N	\N	\N	EGRESO	43.00	0.00	Inscripción a Sala 20	2026-03-11 11:20:52.100511
135	12	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 11:35:38.390108
136	12	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 25	2026-03-11 12:25:40.647089
137	13	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:25:45.326053
138	14	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:25:50.780014
139	15	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:25:56.164965
140	16	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:26:01.894861
141	17	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:26:06.23336
142	19	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:26:10.923576
143	18	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:26:16.3238
144	20	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:26:20.867327
145	13	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 25	2026-03-11 12:27:11.365217
146	14	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 25	2026-03-11 12:27:22.620954
147	15	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 25	2026-03-11 12:27:33.890459
148	21	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 24	2026-03-11 12:27:54.892985
149	12	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:28:52.814676
150	13	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:00.949651
151	14	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:06.107957
152	15	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:10.745381
153	16	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:15.780115
154	17	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:20.826623
155	19	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:27.249289
156	18	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:31.089909
157	20	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:35.532032
158	3	\N	\N	\N	EGRESO	6.00	0.00	Inscripción a Sala 26	2026-03-11 12:29:54.646091
159	19	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 25	2026-03-11 13:35:49.587254
160	21	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 25	2026-03-12 08:32:02.279199
161	14	\N	\N	\N	INGRESO	0.00	20.00	Bono otorgado por admin 1. Motivo: Bono otorgado desde el Gestor de Usuarios	2026-03-12 08:53:29.467665
162	14	\N	\N	\N	EGRESO	0.00	11.00	Inscripción a Sala 27	2026-03-12 08:55:22.087152
163	25	27	\N	\N	INGRESO	10000.00	0.00	Recarga Yape - Recibido en: ewewe	2026-03-12 10:41:22.499499
164	25	\N	\N	\N	INGRESO	0.00	5.00	Bono otorgado por admin 1. Motivo: Bono otorgado desde el Gestor de Usuarios	2026-03-12 10:42:52.184542
165	25	\N	\N	\N	EGRESO	6.00	5.00	Inscripción a Sala 28	2026-03-12 10:45:50.082774
166	25	\N	\N	\N	EGRESO	11.00	0.00	Inscripción a Sala 25	2026-03-12 10:46:10.050111
\.


--
-- TOC entry 5083 (class 0 OID 18436)
-- Dependencies: 234
-- Data for Name: participante_sala; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participante_sala (participacion_id, sala_id, usuario_id, game_account_id, equipo, es_capitan, slot_index, pago_con_bono, pago_con_real) FROM stdin;
2	4	3	1	PORASIGNAR	f	\N	0.00	0.00
3	2	3	1	PORASIGNAR	f	\N	0.00	0.00
4	5	3	1	PORASIGNAR	f	\N	0.00	0.00
75	21	15	7	EQUIPO1	f	\N	0.00	0.00
76	21	16	8	EQUIPO1	f	\N	0.00	0.00
77	21	17	9	EQUIPO1	f	\N	0.00	0.00
1	1	3	1	EQUIPO2	f	\N	0.00	0.00
5	6	3	1	EQUIPO1	f	\N	0.00	0.00
6	7	3	1	EQUIPO1	f	\N	0.00	0.00
7	8	3	1	EQUIPO1	f	\N	0.00	0.00
8	9	3	1	EQUIPO2	f	\N	0.00	0.00
9	10	3	1	EQUIPO1	f	\N	0.00	0.00
10	11	7	2	EQUIPO1	f	\N	0.00	0.00
11	12	3	1	EQUIPO1	f	\N	0.00	0.00
12	13	3	1	EQUIPO1	f	\N	0.00	0.00
13	13	20	13	EQUIPO1	f	\N	0.00	0.00
14	13	19	11	EQUIPO1	f	\N	0.00	0.00
15	13	18	10	EQUIPO1	f	\N	0.00	0.00
20	13	12	4	EQUIPO2	f	\N	0.00	0.00
21	13	13	5	EQUIPO2	f	\N	0.00	0.00
19	13	14	6	EQUIPO2	f	\N	0.00	0.00
18	13	15	7	EQUIPO2	f	\N	0.00	0.00
17	13	16	8	EQUIPO2	f	\N	0.00	0.00
16	13	17	9	EQUIPO1	f	\N	0.00	0.00
27	14	15	7	EQUIPO1	f	\N	0.00	0.00
28	14	14	6	EQUIPO1	f	\N	0.00	0.00
29	14	13	5	EQUIPO1	f	\N	0.00	0.00
30	14	12	4	EQUIPO1	f	\N	0.00	0.00
25	14	17	9	EQUIPO2	f	\N	0.00	0.00
24	14	18	10	EQUIPO2	f	\N	0.00	0.00
23	14	19	11	EQUIPO2	f	\N	0.00	0.00
22	14	20	13	EQUIPO2	f	\N	0.00	0.00
26	14	16	8	EQUIPO2	f	\N	0.00	0.00
31	14	3	1	EQUIPO1	f	\N	0.00	0.00
32	15	3	1	EQUIPO1	f	\N	0.00	0.00
33	15	20	13	EQUIPO1	f	\N	0.00	0.00
34	15	19	11	EQUIPO1	f	\N	0.00	0.00
35	15	17	9	EQUIPO1	f	\N	0.00	0.00
36	16	17	9	EQUIPO1	f	\N	0.00	0.00
37	5	12	4	EQUIPO1	f	\N	0.00	0.00
38	16	12	4	EQUIPO2	f	\N	0.00	0.00
39	5	13	5	EQUIPO1	f	\N	0.00	0.00
40	16	13	5	EQUIPO1	f	\N	0.00	0.00
41	16	14	6	EQUIPO1	f	\N	0.00	0.00
42	16	15	7	EQUIPO1	f	\N	0.00	0.00
43	16	16	8	EQUIPO2	f	\N	0.00	0.00
44	16	18	10	EQUIPO1	f	\N	0.00	0.00
45	16	19	11	EQUIPO1	f	\N	0.00	0.00
46	16	20	13	EQUIPO1	f	\N	0.00	0.00
47	16	3	1	EQUIPO1	f	\N	0.00	0.00
48	2	12	4	EQUIPO1	f	\N	0.00	0.00
49	17	13	5	ESPERANDO_DRAFT	f	\N	0.00	0.00
50	17	14	6	ESPERANDO_DRAFT	f	\N	0.00	0.00
51	17	12	4	ESPERANDO_DRAFT	f	\N	0.00	0.00
52	17	3	1	ESPERANDO_DRAFT	f	\N	0.00	0.00
53	17	20	13	ESPERANDO_DRAFT	f	\N	0.00	0.00
54	17	19	11	ESPERANDO_DRAFT	f	\N	0.00	0.00
55	17	18	10	ESPERANDO_DRAFT	f	\N	0.00	0.00
56	17	17	9	ESPERANDO_DRAFT	f	\N	0.00	0.00
57	17	16	8	ESPERANDO_DRAFT	f	\N	0.00	0.00
58	17	15	7	ESPERANDO_DRAFT	f	\N	0.00	0.00
65	18	18	10	EQUIPO1	f	\N	0.00	0.00
67	18	20	13	EQUIPO1	f	\N	0.00	0.00
60	18	12	4	EQUIPO2	f	\N	0.00	0.00
62	18	15	7	EQUIPO2	f	\N	0.00	0.00
59	18	14	6	EQUIPO1	f	\N	0.00	0.00
64	18	17	9	EQUIPO2	f	\N	0.00	0.00
61	18	13	5	EQUIPO1	f	\N	0.00	0.00
63	18	16	8	EQUIPO2	f	\N	0.00	0.00
66	18	19	11	EQUIPO1	f	\N	0.00	0.00
68	18	3	1	EQUIPO2	f	\N	0.00	0.00
69	20	18	10	ESPERANDO_DRAFT	f	\N	0.00	0.00
71	21	19	11	EQUIPO2	f	\N	0.00	0.00
70	21	20	13	EQUIPO2	f	\N	0.00	0.00
72	21	12	4	EQUIPO1	f	\N	0.00	0.00
73	21	13	5	EQUIPO1	f	\N	0.00	0.00
74	21	14	6	EQUIPO1	f	\N	0.00	0.00
78	22	12	4	EQUIPO2	f	\N	0.00	0.00
80	22	14	6	EQUIPO2	f	\N	0.00	0.00
82	22	16	8	EQUIPO1	f	\N	0.00	0.00
86	22	20	13	EQUIPO1	f	\N	0.00	0.00
84	22	18	10	EQUIPO2	f	\N	0.00	0.00
79	22	13	5	EQUIPO1	f	\N	0.00	0.00
81	22	15	7	EQUIPO2	f	\N	0.00	0.00
83	22	17	9	EQUIPO1	f	\N	0.00	0.00
85	22	19	11	EQUIPO2	f	\N	0.00	0.00
87	22	3	1	EQUIPO1	f	\N	0.00	0.00
88	23	12	4	EQUIPO1	f	\N	0.00	0.00
89	23	13	5	EQUIPO1	f	\N	0.00	0.00
90	23	14	6	EQUIPO1	f	\N	0.00	0.00
91	23	15	7	EQUIPO1	f	\N	0.00	0.00
92	23	16	8	EQUIPO1	f	\N	0.00	0.00
93	23	17	9	EQUIPO1	f	\N	0.00	0.00
94	23	18	10	EQUIPO1	f	\N	0.00	0.00
95	23	19	11	EQUIPO1	f	\N	0.00	0.00
96	20	12	4	ESPERANDO_DRAFT	f	\N	0.00	0.00
97	20	13	5	ESPERANDO_DRAFT	f	\N	0.00	0.00
98	20	14	6	ESPERANDO_DRAFT	f	\N	0.00	0.00
99	20	15	7	ESPERANDO_DRAFT	f	\N	0.00	0.00
100	20	16	8	ESPERANDO_DRAFT	f	\N	0.00	0.00
101	20	17	9	ESPERANDO_DRAFT	f	\N	0.00	0.00
102	20	19	11	ESPERANDO_DRAFT	f	\N	0.00	0.00
103	20	20	13	ESPERANDO_DRAFT	f	\N	0.00	0.00
104	20	21	12	ESPERANDO_DRAFT	f	\N	0.00	0.00
105	24	12	4	ESPERANDO_DRAFT	f	\N	0.00	0.00
107	24	13	5	ESPERANDO_DRAFT	f	\N	0.00	0.00
108	24	14	6	ESPERANDO_DRAFT	f	\N	0.00	0.00
109	24	15	7	ESPERANDO_DRAFT	f	\N	0.00	0.00
110	24	16	8	ESPERANDO_DRAFT	f	\N	0.00	0.00
111	24	17	9	ESPERANDO_DRAFT	f	\N	0.00	0.00
112	24	19	11	ESPERANDO_DRAFT	f	\N	0.00	0.00
113	24	18	10	ESPERANDO_DRAFT	f	\N	0.00	0.00
114	24	20	13	ESPERANDO_DRAFT	f	\N	0.00	0.00
115	25	13	5	ESPERANDO_DRAFT	f	\N	0.00	0.00
106	25	12	4	EQUIPO1	f	\N	0.00	0.00
117	25	15	7	ESPERANDO_DRAFT	f	\N	0.00	0.00
116	25	14	6	ESPERANDO_DRAFT	f	\N	0.00	0.00
118	24	21	12	ESPERANDO_DRAFT	f	\N	0.00	0.00
119	26	12	4	ESPERANDO_DRAFT	f	\N	0.00	0.00
120	26	13	5	ESPERANDO_DRAFT	f	\N	0.00	0.00
121	26	14	6	ESPERANDO_DRAFT	f	\N	0.00	0.00
122	26	15	7	ESPERANDO_DRAFT	f	\N	0.00	0.00
123	26	16	8	ESPERANDO_DRAFT	f	\N	0.00	0.00
124	26	17	9	ESPERANDO_DRAFT	f	\N	0.00	0.00
125	26	19	11	ESPERANDO_DRAFT	f	\N	0.00	0.00
126	26	18	10	ESPERANDO_DRAFT	f	\N	0.00	0.00
127	26	20	13	ESPERANDO_DRAFT	f	\N	0.00	0.00
128	26	3	1	ESPERANDO_DRAFT	f	\N	0.00	0.00
129	25	19	11	ESPERANDO_DRAFT	f	\N	0.00	0.00
130	25	21	12	ESPERANDO_DRAFT	f	\N	0.00	0.00
131	27	14	6	ESPERANDO_DRAFT	f	\N	0.00	0.00
\.


--
-- TOC entry 5081 (class 0 OID 18409)
-- Dependencies: 232
-- Data for Name: sala; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sala (sala_id, creador_id, torneo_id, nombre, tipo_sala, juego, costo_entrada, premio_a_repartir, ganancia_plataforma, estado, mapa_elegido_id, veto_log, resultado_ganador, fecha_creacion, nombrelobby, passwordlobby, "Formato", "Capitan1Id", "Capitan2Id", "GanadorSorteoId", "TurnoActualId") FROM stdin;
1	3	\N	\N	BASICA	VALORANT	10.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-04 10:09:01.64809	\N	\N	1v1	\N	\N	\N	\N
2	3	\N	\N	BASICA	DOTA2	20.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-04 11:28:09.667278	\N	\N	1v1	\N	\N	\N	\N
28	25	\N	\N	PREMIUM	DOTA2	11.00	100.00	0.00	ESPERANDO	\N	\N	\N	2026-03-12 10:43:13.738863	WACH	1234	5v5 Captains Mode	\N	\N	\N	\N
21	20	\N	\N	AUTOCHESS_5	DOTA2	5.00	36.00	0.00	FINALIZADA	\N	\N	\N	2026-03-10 14:59:02.293617	chester	LKP	Auto Chess	\N	\N	\N	\N
3	3	\N	\N	BASICA	VALORANT	17.00	0.00	0.00	RECHAZADA	\N	\N	\N	2026-03-04 15:28:12.314041	\N	\N	1v1	\N	\N	\N	\N
4	3	\N	\N	BASICA	VALORANT	21.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-04 15:29:09.432178	\N	\N	1v1	\N	\N	\N	\N
18	14	\N	\N	BASICA	DOTA2	44.00	0.00	0.00	FINALIZADA	\N	\N	\N	2026-03-09 15:43:27.43061	WACHI	AM	5v5 Captains Mode	20	12	20	20
5	3	\N	\N	BASICA	VALORANT	200.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-05 00:28:53.140146	\N	\N	1v1	\N	\N	\N	\N
6	3	\N	\N	BASICA	DOTA2	18.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-06 15:56:39.47066	\N	\N	1v1	\N	\N	\N	\N
7	3	\N	\N	BASICA	DOTA2	27.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-06 16:11:29.848263	\N	\N	1v1	\N	\N	\N	\N
8	3	\N	\N	BASICA	DOTA2	5.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-06 16:29:57.405425	MIKE	123456	1v1	\N	\N	\N	\N
9	3	\N	\N	BASICA	DOTA2	101.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-06 16:56:13.494306	CHIMPUM	CALLAO	1v1	\N	\N	\N	\N
10	3	\N	\N	BASICA	DOTA2	11.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-06 17:05:41.330889	VALVERDE	0808	1v1	\N	\N	\N	\N
11	7	\N	\N	BASICA	DOTA2	18.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-06 18:41:54.669488	sala1	12345	1v1	\N	\N	\N	\N
12	11	\N	\N	BASICA	DOTA2	15.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-06 19:14:48.539565	po	123	1v1	\N	\N	\N	\N
13	3	\N	\N	BASICA	DOTA2	10.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-08 23:49:00.903471			1v1	\N	\N	\N	\N
14	17	\N	\N	BASICA	DOTA2	26.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-09 12:02:18.452602	WORLDCUP	1234	1v1	\N	\N	\N	\N
15	3	\N	\N	BASICA	DOTA2	14.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-09 12:35:39.623009	oño	1234	1v1	\N	\N	\N	\N
16	17	\N	\N	BASICA	DOTA2	28.00	0.00	0.00	ESPERANDO	\N	\N	\N	2026-03-09 14:00:59.011034	GABRIEL GARCIA MARQUEZ	RM	5v5 Captains Mode	\N	\N	\N	\N
17	12	\N	\N	BASICA	DOTA2	33.00	0.00	0.00	SORTEO	\N	\N	\N	2026-03-09 14:39:47.371721	Bayern	Munich	5v5 Captains Mode	13	14	\N	13
22	20	\N	\N	PREMIUM	DOTA2	11.00	100.00	0.00	FINALIZADA	\N	\N	\N	2026-03-10 22:38:58.373794	duolingo	simon	5v5 Captains Mode	20	12	12	12
23	12	\N	\N	AUTOCHESS_3	DOTA2	3.00	20.00	0.00	FINALIZADA	\N	\N	\N	2026-03-11 10:49:44.482175	sala1	123	Auto Chess	\N	\N	\N	\N
20	18	\N	\N	BASICA	DOTA2	43.00	0.00	0.00	SORTEO	\N	\N	\N	2026-03-10 12:59:57.908242	pou	pou	5v5 Captains Mode	20	12	\N	\N
19	14	\N	\N	BASICA	DOTA2	55.00	0.00	0.00	PENDIENTE_APROBACION	\N	\N	\N	2026-03-10 01:40:14.304805	\N	\N	5v5 Captains Mode	\N	\N	\N	\N
25	21	\N	\N	PREMIUM	DOTA2	11.00	100.00	0.00	ESPERANDO	\N	\N	\N	2026-03-11 12:23:42.040193	radiorevel	1234	5v5 Captains Mode	\N	\N	\N	\N
24	21	\N	\N	PREMIUM	DOTA2	11.00	100.00	0.00	SORTEO	\N	\N	\N	2026-03-11 11:21:22.940972	radiactive	1234	5v5 Captains Mode	20	12	\N	\N
26	20	\N	\N	BASICA	DOTA2	6.00	50.00	0.00	SORTEO	\N	\N	\N	2026-03-11 12:28:17.795607	terry	1234	5v5 Captains Mode	20	12	\N	\N
27	14	\N	\N	PREMIUM	DOTA2	11.00	100.00	0.00	ESPERANDO	\N	\N	\N	2026-03-12 08:54:12.356838	pruebabn	1243	5v5 Captains Mode	\N	\N	\N	\N
\.


--
-- TOC entry 5085 (class 0 OID 18463)
-- Dependencies: 236
-- Data for Name: solicitud_recarga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitud_recarga (recarga_id, usuario_id, monto, moneda, metodo, cuenta_destino, nro_operacion, estado, admin_atendiendo_id, fecha_emision, fecha_cierre) FROM stdin;
1	1	5.00	PEN		\N	\N	EN_PROCESO	1	2026-03-03 15:39:59.658804	\N
16	13	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:20.70235	2026-03-09 11:54:43.652666
2	2	20.00	PEN	Plin	926621830	xxxxxxGAAAAAxxxxxxxx	APROBADA	1	2026-03-03 12:02:32.696385	2026-03-03 20:11:04.915167
17	14	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:23.998408	2026-03-09 11:54:49.062834
3	3	300.00	PEN	Plin	COBRA9278	Q_MANDAAAAAAN	APROBADA	1	2026-03-03 15:22:22.733995	2026-03-04 10:34:45.47318
18	15	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:27.487135	2026-03-09 11:54:51.917955
4	3	200.00	PEN	Yape	SIUUUUUU	SDADSAD	APROBADA	1	2026-03-06 11:30:57.527503	2026-03-06 16:31:17.667674
19	16	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:30.686703	2026-03-09 11:54:54.019903
5	7	22.00	PEN	Yape	PLIN	21313213	APROBADA	1	2026-03-06 13:33:23.161872	2026-03-06 18:36:09.765551
20	17	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:33.4544	2026-03-09 11:54:56.253694
6	11	300.00	PEN	Yape	,ñ,	ñlmñ	APROBADA	1	2026-03-06 14:02:36.597853	2026-03-06 19:19:51.147095
21	18	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:36.326753	2026-03-09 11:54:58.215275
7	3	300.00	PEN	Yape	dawa	awda	APROBADA	1	2026-03-08 13:51:12.003761	2026-03-08 18:51:38.393918
22	19	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:39.966796	2026-03-09 11:55:00.567341
8	3	222.00	PEN	Yape	werewrew	r3we	APROBADA	1	2026-03-08 18:09:43.133333	2026-03-08 23:09:58.494087
10	3	1222.00	PEN	Yape	\N	\N	PENDIENTE	\N	2026-03-08 23:11:41.786538	\N
23	20	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:43.736966	2026-03-09 11:55:02.424551
9	3	222.00	PEN	Yape	5454	544545	APROBADA	1	2026-03-08 18:11:27.64979	2026-03-08 23:12:14.621206
24	17	122.00	PEN	Yape	\N	\N	PENDIENTE	\N	2026-03-09 13:33:29.036887	\N
26	21	10000.00	PEN	Yape	\N	\N	PENDIENTE	\N	2026-03-11 11:09:56.707009	\N
11	3	100.00	PEN	Yape	ewee	wew	APROBADA	1	2026-03-08 18:12:50.757936	2026-03-08 23:13:01.109073
12	3	100.00	PEN	Yape	asasa	ss	APROBADA	1	2026-03-08 18:15:16.589896	2026-03-08 23:15:27.156336
25	21	10000.00	PEN	Yape	siuuuu	siuuu	APROBADA	1	2026-03-11 06:06:39.175896	2026-03-11 11:10:12.686638
13	3	300.00	PEN	Plin	asas	sas	APROBADA	1	2026-03-08 18:37:29.144426	2026-03-08 23:44:03.000515
27	25	10000.00	PEN	Yape	ewewe	ewew	APROBADA	1	2026-03-12 05:41:04.946311	2026-03-12 10:41:22.494955
14	3	300.00	PEN	Yape	asas	sasa	APROBADA	1	2026-03-08 18:43:39.3323	2026-03-08 23:44:21.77621
15	12	1000.00	PEN	Yape			APROBADA	1	2026-03-09 06:53:16.936815	2026-03-09 11:54:39.549891
\.


--
-- TOC entry 5087 (class 0 OID 18484)
-- Dependencies: 238
-- Data for Name: solicitud_retiro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitud_retiro (retiro_id, usuario_id, monto, moneda, metodo, cuenta_destino, nro_operacion, estado, admin_atendiendo_id, fecha_emision, fecha_pago) FROM stdin;
\.


--
-- TOC entry 5079 (class 0 OID 18401)
-- Dependencies: 230
-- Data for Name: torneo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.torneo (torneo_id, nombre, premio_pozo, costo_inscripcion, estado, fecha_inicio, fecha_fin) FROM stdin;
\.


--
-- TOC entry 5069 (class 0 OID 18315)
-- Dependencies: 220
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (usuario_id, clan_id, username, nombre, ap_paterno, ap_materno, telefono, email, pass_hash, saldo_real, saldo_bono, rol, partidas_jugadas, fecha_registro) FROM stdin;
1	\N	Yogui	Mario	Bros	Nintendo	999888777	jakeElPerro@torneo.com	$2a$11$Ha.2zYXGVhSX0seTAG21/ue1P4gDRBTybCGkZlGdW1GkIEyWS/V9u	0.00	0.00	SUPERADMIN	0	2026-03-03 15:12:14.982282
2	\N	ashKetchup	Ash	ketchup	Paleta	232223232	pikachu@gmail.com	$2a$11$xGNUQCKVpfUNK65PCHEy5OI1PgReW4ekkUXUdo0W3xe6xl.UetcE2	20.00	0.00	USER	0	2026-03-03 10:27:50.91361
4	\N	BobEsponja	Bob	Esponja	PantalonesCuadrados	926621830	esponjapantcuadrados@gmail.com	$2a$11$XEO/xXy5CB3jKM.OS51Q0eBKpA4n2gjaP5x5tdBtosA9yna0gzbsm	0.00	0.00	USER	0	2026-03-05 13:41:22.103117
6	\N	patriciopro	Patricio	Estrella	Estrella	72777876	patricioestrella@gmail.com	$2a$11$WpdusvOSLrFFW6QlKdsM2OYhNG6dLxejxkcPrNu5IACGo.uRVUhMa	0.00	0.00	USER	0	2026-03-05 13:45:09.127423
12	\N	sujeto1	sujeto1	sujeto1	sujeto1	1234	sujeto1@gmail.com	$2a$11$FCbYBzlU.nUdjNB2uT8f..HmpJAgXLa2N/zfXFFR4cNSbb/4v4Lti	587.00	0.00	USER	0	2026-03-09 06:11:41.059974
13	\N	sujeto2	sujeto2	sujeto2	sujeto2	sujeto2	sujeto2@gmail.com	$2a$11$.ys8HKFeItBuMHvRiWyU2emJ20vKoj1ZDtlE6ic8SlexGPw/qfrmy	660.00	0.00	USER	0	2026-03-09 06:12:25.799289
26	\N	sujeto77	sujeto77	sujeto77	sujeto77	1234	sujeto77@gmail.com	$2a$11$oMwnQTooDnsKTz5joCQDPepYUTQljQMrpejpTOVC3Go0erYSpHdkG	0.00	0.00	USER	0	2026-03-12 19:38:16.35391
15	\N	sujeto4	sujeto4	sujeto4	sujeto4	1234	sujeto4@gmail.com	$2a$11$y45eUa4df7o8c1q/QLKneeq6nwqokJRc/ZFMnIEAbK9Z/ODTCcwFi	789.00	0.00	USER	0	2026-03-09 06:13:22.684599
7	\N	juanpro	Juan	Gabrieñl	Perez	926621830	juan@gmail.com	$2a$11$SY22SqPOpzs6gxnaIzONiuX/Vj9cIqyq/uWNnu9KR2pL.V2yT5udK	4.00	0.00	USER	0	2026-03-06 13:32:12.717626
11	\N	Bryanpro	Bryan	Bryan	Bryan	938913676	Bryan@gmail.com	$2a$11$2G5GKn1JZ7ozW0VvnjvwouyHEILMr7UfFGIge7J3m6trxY6GcqFaK	300.00	0.00	USER	0	2026-03-06 14:01:57.163186
16	\N	sujeto5	sujeto5	sujeto5	sujeto5	1234	sujeto5@gmail.com	$2a$11$RZDgbEJbTW3D.ahVkE/j9eg1F/u0Bjuey4fRYiO08bTbVait1GBHi	780.00	0.00	USER	0	2026-03-09 06:13:53.461383
17	\N	sujeto6	sujeto6	sujeto6	sujeto6	sujeto6	sujeto6@gmail.com	$2a$11$kCVDqSI0DITU4/DWYa/iSeXbpbnDvkvyzjryZFvSRfUmUFpB9UtlW	766.00	0.00	USER	0	2026-03-09 06:14:20.4903
18	\N	sujeto7	sujeto7	sujeto7	sujeto7	1234	sujeto7@gmail.com	$2a$11$bttZOKUANflpUcSqLFCOhuaZtF6zMj2YjTJH5URRcB9t9jlM8MsNi	891.00	0.00	USER	0	2026-03-09 06:15:58.765011
20	\N	sujeto9	sujeto9	sujeto9	sujeto9	sujeto9	sujeto9@gmail.com	$2a$11$phv2hs9/J2KdflsDG0xT.e6sD2Eub7hlmsQOxJeCft522XtWXm.B2	875.00	0.00	USER	0	2026-03-09 06:16:47.939621
3	\N	calamardo69	Calamardo	Tentaculo	Qlon	232222222	calamardo@gmail.com	$2a$11$V5PEXbAUsSUGi3VLwYdjUOD7zNQD93hRtdCphViqIBjV0Dr13yj36	1444.00	0.00	USER	0	2026-03-01 18:50:24.919612
24	\N	sujeto99	sujeto99	sujeto99	sujeto99	sujeto99	sujeto99@gmail.com	$2a$11$3PHIOKKy467r0FryfVrjv.rTApA4656OmclDCTCVT3ddVS04vtWQ2	0.00	0.00	USER	0	2026-03-11 12:59:40.817296
19	\N	sujeto8	sujeto8	sujeto8	sujeto8	sujeto8	sujeto8@gmail.com	$2a$11$C8GyyMsyV5wMWpXTMPyDpeWFZogquJDZqXwuHXGg1cpFmEL7uiunm	871.00	0.00	USER	0	2026-03-09 06:16:21.931055
21	\N	sujeto10	sujeto10	sujeto10	sujeto10	1234	sujeto10@gmail.com	$2a$11$x.F.lGxxEb8pxjjAQCOm.u/fz0EUppDm.NeHyRwahpoNVAv5K9mD2	9935.00	0.00	USER	0	2026-03-09 06:17:16.316245
14	\N	sujeto3	sujeto3	sujeto3	sujeto3	1234	sujeto3@gmail.com	$2a$11$8b7mNR6.qYm759LrhFJqTui8/Q.M23bBLfN1.Ol46KJLyajU2FQbK	878.00	9.00	USER	0	2026-03-09 01:12:55.789239
32	\N	sujeto88	sujeto88	sujeto88	sujeto88	sujeto88	sujeto88@gmail.com	$2a$11$bWb69nT.p6.1Wa/V2QqOMOPLi/1934F21khVxAyZWIOUMpZf1hsI6	0.00	0.00	USER	0	2026-03-12 20:07:35.816045
25	\N	sujetoBaneo	sujetoBaneo	sujetoBaneo	sujetoBaneo	1234	sujetoBaneo@gmail.com	$2a$11$R3rF/qNTcl0G4hG9SQ.9TO29lqvUBohjm201Xb6fGZdbudsGZtvmy	9983.00	0.00	USER	0	2026-03-12 00:40:22.571651
\.


--
-- TOC entry 5073 (class 0 OID 18356)
-- Dependencies: 224
-- Data for Name: usuario_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_stats (user_stat_id, usuario_id, juego, elo_mmr, wins, loses, rango_medalla) FROM stdin;
\.


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 241
-- Name: baneo_baneo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.baneo_baneo_id_seq', 2, true);


--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 217
-- Name: clan_clan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clan_clan_id_seq', 1, false);


--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 221
-- Name: game_account_game_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_account_game_account_id_seq', 17, true);


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 225
-- Name: historial_mmr_admin_historial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_mmr_admin_historial_id_seq', 1, false);


--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 243
-- Name: log_acciones_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_acciones_log_id_seq', 1, false);


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 227
-- Name: mapa_mapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mapa_mapa_id_seq', 1, false);


--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 239
-- Name: movimientos_movimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_movimiento_id_seq', 166, true);


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 233
-- Name: participante_sala_participacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participante_sala_participacion_id_seq', 133, true);


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 231
-- Name: sala_sala_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sala_sala_id_seq', 28, true);


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 235
-- Name: solicitud_recarga_recarga_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_recarga_recarga_id_seq', 27, true);


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 237
-- Name: solicitud_retiro_retiro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_retiro_retiro_id_seq', 1, false);


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 229
-- Name: torneo_torneo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.torneo_torneo_id_seq', 1, false);


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 223
-- Name: usuario_stats_user_stat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_stats_user_stat_id_seq', 1, false);


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_usuario_id_seq', 32, true);


--
-- TOC entry 4898 (class 2606 OID 18579)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 4894 (class 2606 OID 18548)
-- Name: baneo baneo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baneo
    ADD CONSTRAINT baneo_pkey PRIMARY KEY (baneo_id);


--
-- TOC entry 4862 (class 2606 OID 18313)
-- Name: clan clan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clan
    ADD CONSTRAINT clan_pkey PRIMARY KEY (clan_id);


--
-- TOC entry 4870 (class 2606 OID 18347)
-- Name: game_account game_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_account
    ADD CONSTRAINT game_account_pkey PRIMARY KEY (game_account_id);


--
-- TOC entry 4876 (class 2606 OID 18379)
-- Name: historial_mmr_admin historial_mmr_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_mmr_admin
    ADD CONSTRAINT historial_mmr_admin_pkey PRIMARY KEY (historial_id);


--
-- TOC entry 4896 (class 2606 OID 18568)
-- Name: log_acciones log_acciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_acciones
    ADD CONSTRAINT log_acciones_pkey PRIMARY KEY (log_id);


--
-- TOC entry 4878 (class 2606 OID 18399)
-- Name: mapa mapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mapa
    ADD CONSTRAINT mapa_pkey PRIMARY KEY (mapa_id);


--
-- TOC entry 4892 (class 2606 OID 18518)
-- Name: movimientos movimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_pkey PRIMARY KEY (movimiento_id);


--
-- TOC entry 4884 (class 2606 OID 18444)
-- Name: participante_sala participante_sala_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante_sala
    ADD CONSTRAINT participante_sala_pkey PRIMARY KEY (participacion_id);


--
-- TOC entry 4882 (class 2606 OID 18419)
-- Name: sala sala_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_pkey PRIMARY KEY (sala_id);


--
-- TOC entry 4888 (class 2606 OID 18472)
-- Name: solicitud_recarga solicitud_recarga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_recarga
    ADD CONSTRAINT solicitud_recarga_pkey PRIMARY KEY (recarga_id);


--
-- TOC entry 4890 (class 2606 OID 18495)
-- Name: solicitud_retiro solicitud_retiro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_retiro
    ADD CONSTRAINT solicitud_retiro_pkey PRIMARY KEY (retiro_id);


--
-- TOC entry 4880 (class 2606 OID 18407)
-- Name: torneo torneo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT torneo_pkey PRIMARY KEY (torneo_id);


--
-- TOC entry 4886 (class 2606 OID 18446)
-- Name: participante_sala uq_sala_slot; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante_sala
    ADD CONSTRAINT uq_sala_slot UNIQUE (sala_id, slot_index);


--
-- TOC entry 4872 (class 2606 OID 18349)
-- Name: game_account uq_usuario_juego; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_account
    ADD CONSTRAINT uq_usuario_juego UNIQUE (usuario_id, juego);


--
-- TOC entry 4864 (class 2606 OID 18333)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 4866 (class 2606 OID 18329)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 4874 (class 2606 OID 18364)
-- Name: usuario_stats usuario_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_stats
    ADD CONSTRAINT usuario_stats_pkey PRIMARY KEY (user_stat_id);


--
-- TOC entry 4868 (class 2606 OID 18331)
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- TOC entry 4918 (class 2606 OID 18554)
-- Name: baneo baneo_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baneo
    ADD CONSTRAINT baneo_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4919 (class 2606 OID 18549)
-- Name: baneo baneo_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baneo
    ADD CONSTRAINT baneo_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4900 (class 2606 OID 18350)
-- Name: game_account game_account_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_account
    ADD CONSTRAINT game_account_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4902 (class 2606 OID 18380)
-- Name: historial_mmr_admin historial_mmr_admin_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_mmr_admin
    ADD CONSTRAINT historial_mmr_admin_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4903 (class 2606 OID 18385)
-- Name: historial_mmr_admin historial_mmr_admin_user_stat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_mmr_admin
    ADD CONSTRAINT historial_mmr_admin_user_stat_id_fkey FOREIGN KEY (user_stat_id) REFERENCES public.usuario_stats(user_stat_id);


--
-- TOC entry 4920 (class 2606 OID 18569)
-- Name: log_acciones log_acciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_acciones
    ADD CONSTRAINT log_acciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4914 (class 2606 OID 18524)
-- Name: movimientos movimientos_recarga_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_recarga_id_fkey FOREIGN KEY (recarga_id) REFERENCES public.solicitud_recarga(recarga_id);


--
-- TOC entry 4915 (class 2606 OID 18529)
-- Name: movimientos movimientos_retiro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_retiro_id_fkey FOREIGN KEY (retiro_id) REFERENCES public.solicitud_retiro(retiro_id);


--
-- TOC entry 4916 (class 2606 OID 18534)
-- Name: movimientos movimientos_sala_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.sala(sala_id);


--
-- TOC entry 4917 (class 2606 OID 18519)
-- Name: movimientos movimientos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4907 (class 2606 OID 18457)
-- Name: participante_sala participante_sala_game_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante_sala
    ADD CONSTRAINT participante_sala_game_account_id_fkey FOREIGN KEY (game_account_id) REFERENCES public.game_account(game_account_id);


--
-- TOC entry 4908 (class 2606 OID 18447)
-- Name: participante_sala participante_sala_sala_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante_sala
    ADD CONSTRAINT participante_sala_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.sala(sala_id);


--
-- TOC entry 4909 (class 2606 OID 18452)
-- Name: participante_sala participante_sala_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante_sala
    ADD CONSTRAINT participante_sala_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4904 (class 2606 OID 18420)
-- Name: sala sala_creador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_creador_id_fkey FOREIGN KEY (creador_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4905 (class 2606 OID 18430)
-- Name: sala sala_mapa_elegido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_mapa_elegido_id_fkey FOREIGN KEY (mapa_elegido_id) REFERENCES public.mapa(mapa_id);


--
-- TOC entry 4906 (class 2606 OID 18425)
-- Name: sala sala_torneo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_torneo_id_fkey FOREIGN KEY (torneo_id) REFERENCES public.torneo(torneo_id);


--
-- TOC entry 4910 (class 2606 OID 18478)
-- Name: solicitud_recarga solicitud_recarga_admin_atendiendo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_recarga
    ADD CONSTRAINT solicitud_recarga_admin_atendiendo_id_fkey FOREIGN KEY (admin_atendiendo_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4911 (class 2606 OID 18473)
-- Name: solicitud_recarga solicitud_recarga_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_recarga
    ADD CONSTRAINT solicitud_recarga_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4912 (class 2606 OID 18501)
-- Name: solicitud_retiro solicitud_retiro_admin_atendiendo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_retiro
    ADD CONSTRAINT solicitud_retiro_admin_atendiendo_id_fkey FOREIGN KEY (admin_atendiendo_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4913 (class 2606 OID 18496)
-- Name: solicitud_retiro solicitud_retiro_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_retiro
    ADD CONSTRAINT solicitud_retiro_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 4899 (class 2606 OID 18334)
-- Name: usuario usuario_clan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_clan_id_fkey FOREIGN KEY (clan_id) REFERENCES public.clan(clan_id);


--
-- TOC entry 4901 (class 2606 OID 18365)
-- Name: usuario_stats usuario_stats_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_stats
    ADD CONSTRAINT usuario_stats_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-03-12 20:41:29

--
-- PostgreSQL database dump complete
--

\unrestrict dNAVAYWkaEhipinfjcrYWA4uFK2YqBT7kCdGSbusnjENFUvGTehvAkcfyJsNbZd

