--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: modas; Type: TABLE; Schema: public; Owner: suhail
--

CREATE TABLE modas (
    id integer NOT NULL,
    user_id integer NOT NULL,
    data jsonb NOT NULL,
    deleted boolean DEFAULT false,
    date_added timestamp with time zone NOT NULL
);


ALTER TABLE modas OWNER TO suhail;

--
-- Name: modas_id_seq; Type: SEQUENCE; Schema: public; Owner: suhail
--

CREATE SEQUENCE modas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE modas_id_seq OWNER TO suhail;

--
-- Name: modas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suhail
--

ALTER SEQUENCE modas_id_seq OWNED BY modas.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: suhail
--

CREATE TABLE users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    org_name text,
    country text,
    role text DEFAULT 'contrib'::text NOT NULL,
    date_added timestamp with time zone NOT NULL,
    deleted boolean DEFAULT false
);


ALTER TABLE users OWNER TO suhail;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: suhail
--

CREATE SEQUENCE users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO suhail;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suhail
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: modas id; Type: DEFAULT; Schema: public; Owner: suhail
--

ALTER TABLE ONLY modas ALTER COLUMN id SET DEFAULT nextval('modas_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: suhail
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: modas; Type: TABLE DATA; Schema: public; Owner: suhail
--

COPY modas (id, user_id, data, deleted, date_added) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: suhail
--

COPY users (id, name, email, password, org_name, country, role, date_added, deleted) FROM stdin;
2	test user	test@user.com	$2a$10$e63IVApQugr.OMWndrDhQO9F/60nvWYlLyHIPV8ZiA5.zO/d.Z0S6	fraunhofer iwm	germany	contrib	2017-12-05 03:08:00.862+01	f
\.


--
-- Name: modas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suhail
--

SELECT pg_catalog.setval('modas_id_seq', 14, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suhail
--

SELECT pg_catalog.setval('users_id_seq', 2, true);


--
-- Name: modas modas_pkey; Type: CONSTRAINT; Schema: public; Owner: suhail
--

ALTER TABLE ONLY modas
    ADD CONSTRAINT modas_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: suhail
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_name_key; Type: CONSTRAINT; Schema: public; Owner: suhail
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_name_key UNIQUE (name);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: suhail
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

