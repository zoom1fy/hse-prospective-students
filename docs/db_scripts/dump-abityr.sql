--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-astra.se2+b3)
-- Dumped by pg_dump version 17.0

-- Started on 2026-09-14 16:47:23

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 33622)
-- Name: achievement; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.achievement (
    id uuid NOT NULL,
    name text NOT NULL,
    id_user uuid NOT NULL,
    id_category uuid NOT NULL
);


ALTER TABLE public.achievement OWNER TO gmn;

--
-- TOC entry 223 (class 1259 OID 33739)
-- Name: achievement_categories; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.achievement_categories (
    id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.achievement_categories OWNER TO gmn;

--
-- TOC entry 230 (class 1259 OID 33832)
-- Name: comparisons; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.comparisons (
    id uuid NOT NULL,
    id_user uuid NOT NULL,
    id_program_fisrt uuid NOT NULL,
    id_program_second uuid NOT NULL,
    explanation text NOT NULL,
    top_program integer NOT NULL
);


ALTER TABLE public.comparisons OWNER TO gmn;

--
-- TOC entry 220 (class 1259 OID 33693)
-- Name: education_levels; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.education_levels (
    id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.education_levels OWNER TO gmn;

--
-- TOC entry 226 (class 1259 OID 33778)
-- Name: exams; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.exams (
    id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.exams OWNER TO gmn;

--
-- TOC entry 217 (class 1259 OID 33651)
-- Name: faculties; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.faculties (
    id uuid NOT NULL,
    name text NOT NULL,
    id_university uuid NOT NULL,
    short_name text NOT NULL,
    official_url text
);


ALTER TABLE public.faculties OWNER TO gmn;

--
-- TOC entry 227 (class 1259 OID 33785)
-- Name: program_exam; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.program_exam (
    id uuid NOT NULL,
    id_program uuid NOT NULL,
    id_exam uuid,
    passing_score integer NOT NULL
);


ALTER TABLE public.program_exam OWNER TO gmn;

--
-- TOC entry 218 (class 1259 OID 33665)
-- Name: programs; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.programs (
    id uuid NOT NULL,
    id_faculty uuid NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    duration_years integer NOT NULL,
    official_url text,
    budget_places integer NOT NULL,
    paid_places integer,
    tuition_price integer,
    description text,
    id_type_study uuid,
    id_education_levels uuid NOT NULL
);


ALTER TABLE public.programs OWNER TO gmn;

--
-- TOC entry 229 (class 1259 OID 33815)
-- Name: recimmendation_program_user; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.recimmendation_program_user (
    id uuid NOT NULL,
    id_user uuid NOT NULL,
    id_program uuid,
    explanation text NOT NULL,
    chance_score integer NOT NULL
);


ALTER TABLE public.recimmendation_program_user OWNER TO gmn;

--
-- TOC entry 222 (class 1259 OID 33722)
-- Name: regions; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.regions (
    id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.regions OWNER TO gmn;

--
-- TOC entry 225 (class 1259 OID 33756)
-- Name: statement_statuses; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.statement_statuses (
    id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.statement_statuses OWNER TO gmn;

--
-- TOC entry 224 (class 1259 OID 33751)
-- Name: statements; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.statements (
    id uuid NOT NULL,
    id_user uuid NOT NULL,
    id_program uuid NOT NULL,
    id_status uuid NOT NULL
);


ALTER TABLE public.statements OWNER TO gmn;

--
-- TOC entry 219 (class 1259 OID 33679)
-- Name: type_study; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.type_study (
    id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.type_study OWNER TO gmn;

--
-- TOC entry 216 (class 1259 OID 33634)
-- Name: universities; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.universities (
    id uuid NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    short_name text NOT NULL,
    official_url text,
    logo text,
    description text,
    id_region uuid
);


ALTER TABLE public.universities OWNER TO gmn;

--
-- TOC entry 228 (class 1259 OID 33800)
-- Name: user_exam; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.user_exam (
    id uuid NOT NULL,
    id_user uuid NOT NULL,
    id_exam uuid NOT NULL,
    score_achieved integer NOT NULL
);


ALTER TABLE public.user_exam OWNER TO gmn;

--
-- TOC entry 214 (class 1259 OID 33609)
-- Name: users; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    patronymic text NOT NULL,
    email text NOT NULL,
    passport text NOT NULL,
    snils text NOT NULL,
    education text NOT NULL,
    id_region uuid
);


ALTER TABLE public.users OWNER TO gmn;

--
-- TOC entry 221 (class 1259 OID 33707)
-- Name: users_programs; Type: TABLE; Schema: public; Owner: gmn
--

CREATE TABLE public.users_programs (
    id uuid NOT NULL,
    id_user uuid NOT NULL,
    id_program uuid NOT NULL
);


ALTER TABLE public.users_programs OWNER TO gmn;

--
-- TOC entry 3514 (class 0 OID 33622)
-- Dependencies: 215
-- Data for Name: achievement; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.achievement VALUES ('00000001-0000-0000-0000-000000000001', 'Призёр ВсОШ по информатике', '00000001-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000001');
INSERT INTO public.achievement VALUES ('00000001-0000-0000-0000-000000000002', 'Золотой знак ГТО', '00000001-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000002');
INSERT INTO public.achievement VALUES ('00000001-0000-0000-0000-000000000003', 'Победитель олимпиады «Высшая проба»', '00000001-0000-0000-0000-000000000002', 'cccc1111-0000-0000-0000-000000000001');
INSERT INTO public.achievement VALUES ('00000001-0000-0000-0000-000000000004', 'Волонтёрство 150+ часов', '00000001-0000-0000-0000-000000000003', 'cccc1111-0000-0000-0000-000000000003');
INSERT INTO public.achievement VALUES ('00000001-0000-0000-0000-000000000005', 'Золотая медаль', '00000001-0000-0000-0000-000000000004', 'cccc1111-0000-0000-0000-000000000004');
INSERT INTO public.achievement VALUES ('00000001-0000-0000-0000-000000000006', 'Призёр регионального этапа ВсОШ по физике', '00000001-0000-0000-0000-000000000005', 'cccc1111-0000-0000-0000-000000000001');


--
-- TOC entry 3522 (class 0 OID 33739)
-- Dependencies: 223
-- Data for Name: achievement_categories; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.achievement_categories VALUES ('cccc1111-0000-0000-0000-000000000001', 'Олимпиады');
INSERT INTO public.achievement_categories VALUES ('cccc1111-0000-0000-0000-000000000002', 'Спорт');
INSERT INTO public.achievement_categories VALUES ('cccc1111-0000-0000-0000-000000000003', 'Волонтёрство');
INSERT INTO public.achievement_categories VALUES ('cccc1111-0000-0000-0000-000000000004', 'Академические успехи');
INSERT INTO public.achievement_categories VALUES ('cccc1111-0000-0000-0000-000000000005', 'Творческие конкурсы');


--
-- TOC entry 3529 (class 0 OID 33832)
-- Dependencies: 230
-- Data for Name: comparisons; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.comparisons VALUES ('60000001-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000002', 'ПМИ МГУ: выше проходной, но больше бюджетных мест. ПИ ИТМО: ниже стоимость и выше шанс поступить. Для Ивана выгоднее ИТМО по совокупности факторов.', 2);


--
-- TOC entry 3519 (class 0 OID 33693)
-- Dependencies: 220
-- Data for Name: education_levels; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.education_levels VALUES ('aaaa1111-0000-0000-0000-000000000001', 'Бакалавриат');
INSERT INTO public.education_levels VALUES ('aaaa1111-0000-0000-0000-000000000002', 'Специалитет');
INSERT INTO public.education_levels VALUES ('aaaa1111-0000-0000-0000-000000000003', 'Магистратура');
INSERT INTO public.education_levels VALUES ('aaaa1111-0000-0000-0000-000000000004', 'Аспирантура');


--
-- TOC entry 3525 (class 0 OID 33778)
-- Dependencies: 226
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000001', 'Русский язык');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000002', 'Математика (профиль)');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000003', 'Информатика');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000004', 'Физика');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000005', 'Обществознание');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000006', 'История');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000007', 'Биология');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000008', 'Химия');
INSERT INTO public.exams VALUES ('eeeee111-0000-0000-0000-000000000009', 'Английский язык');


--
-- TOC entry 3516 (class 0 OID 33651)
-- Dependencies: 217
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.faculties VALUES ('f0000001-0000-0000-0000-000000000001', 'Факультет вычислительной математики и кибернетики', 'e0000001-0000-0000-0000-000000000001', 'ВМК МГУ', 'https://msu.ru/vmk');
INSERT INTO public.faculties VALUES ('f0000001-0000-0000-0000-000000000002', 'Экономический факультет', 'e0000001-0000-0000-0000-000000000001', 'ЭФ МГУ', 'https://msu.ru/econ');
INSERT INTO public.faculties VALUES ('f0000001-0000-0000-0000-000000000003', 'Факультет информационных технологий и программирования', 'e0000001-0000-0000-0000-000000000002', 'ФИТиП ИТМО', 'https://itmo.ru/fitip');
INSERT INTO public.faculties VALUES ('f0000001-0000-0000-0000-000000000004', 'Институт информационных технологий и интеллектуальных систем', 'e0000001-0000-0000-0000-000000000003', 'ИТИС КФУ', 'https://kpfu.ru/itis');
INSERT INTO public.faculties VALUES ('f0000001-0000-0000-0000-000000000005', 'Факультет информационных технологий', 'e0000001-0000-0000-0000-000000000004', 'ФИТ НГУ', 'https://nsu.ru/fit');
INSERT INTO public.faculties VALUES ('f0000001-0000-0000-0000-000000000006', 'Институт радиоэлектроники и информационных технологий', 'e0000001-0000-0000-0000-000000000005', 'ИРИТ-РТФ УрФУ', 'https://urfu.ru/irit');


--
-- TOC entry 3526 (class 0 OID 33785)
-- Dependencies: 227
-- Data for Name: program_exam; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'eeeee111-0000-0000-0000-000000000002', 90);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000002', '90000001-0000-0000-0000-000000000001', 'eeeee111-0000-0000-0000-000000000003', 85);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000003', '90000001-0000-0000-0000-000000000001', 'eeeee111-0000-0000-0000-000000000001', 80);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000004', '90000001-0000-0000-0000-000000000002', 'eeeee111-0000-0000-0000-000000000002', 88);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000005', '90000001-0000-0000-0000-000000000002', 'eeeee111-0000-0000-0000-000000000003', 85);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000006', '90000001-0000-0000-0000-000000000002', 'eeeee111-0000-0000-0000-000000000001', 78);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000007', '90000001-0000-0000-0000-000000000003', 'eeeee111-0000-0000-0000-000000000002', 75);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000008', '90000001-0000-0000-0000-000000000003', 'eeeee111-0000-0000-0000-000000000003', 70);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000009', '90000001-0000-0000-0000-000000000003', 'eeeee111-0000-0000-0000-000000000001', 70);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000010', '90000001-0000-0000-0000-000000000004', 'eeeee111-0000-0000-0000-000000000002', 90);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000011', '90000001-0000-0000-0000-000000000004', 'eeeee111-0000-0000-0000-000000000005', 85);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000012', '90000001-0000-0000-0000-000000000004', 'eeeee111-0000-0000-0000-000000000001', 80);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000013', '90000001-0000-0000-0000-000000000005', 'eeeee111-0000-0000-0000-000000000002', 80);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000014', '90000001-0000-0000-0000-000000000005', 'eeeee111-0000-0000-0000-000000000003', 75);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000015', '90000001-0000-0000-0000-000000000005', 'eeeee111-0000-0000-0000-000000000001', 72);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000016', '90000001-0000-0000-0000-000000000006', 'eeeee111-0000-0000-0000-000000000002', 70);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000017', '90000001-0000-0000-0000-000000000006', 'eeeee111-0000-0000-0000-000000000004', 68);
INSERT INTO public.program_exam VALUES ('10000001-0000-0000-0000-000000000018', '90000001-0000-0000-0000-000000000006', 'eeeee111-0000-0000-0000-000000000001', 68);


--
-- TOC entry 3517 (class 0 OID 33665)
-- Dependencies: 218
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.programs VALUES ('90000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'Прикладная математика и информатика', '01.03.02', 4, 'https://msu.ru/programs/01.03.02', 250, 50, 380000, 'Фундаментальная подготовка в области математики и программирования', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001');
INSERT INTO public.programs VALUES ('90000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000003', 'Программная инженерия', '09.03.04', 4, 'https://itmo.ru/programs/09.03.04', 200, 100, 350000, 'Разработка программного обеспечения и архитектура систем', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001');
INSERT INTO public.programs VALUES ('90000001-0000-0000-0000-000000000003', 'f0000001-0000-0000-0000-000000000004', 'Информационные системы и технологии', '09.03.02', 4, 'https://kpfu.ru/programs/09.03.02', 150, 75, 220000, 'Проектирование и сопровождение информационных систем', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001');
INSERT INTO public.programs VALUES ('90000001-0000-0000-0000-000000000004', 'f0000001-0000-0000-0000-000000000002', 'Экономика', '38.03.01', 4, 'https://msu.ru/programs/38.03.01', 180, 120, 400000, 'Экономическая теория, финансы и анализ данных', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001');
INSERT INTO public.programs VALUES ('90000001-0000-0000-0000-000000000005', 'f0000001-0000-0000-0000-000000000005', 'Информатика и вычислительная техника', '09.03.01', 4, 'https://nsu.ru/programs/09.03.01', 120, 40, 210000, 'Системное программирование и вычислительные системы', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001');
INSERT INTO public.programs VALUES ('90000001-0000-0000-0000-000000000006', 'f0000001-0000-0000-0000-000000000006', 'Радиотехника', '11.03.01', 4, 'https://urfu.ru/programs/11.03.01', 100, 50, 190000, 'Проектирование радиотехнических устройств и систем', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001');
INSERT INTO public.programs VALUES ('90000001-0000-0000-0000-000000000007', 'f0000001-0000-0000-0000-000000000001', 'Математика и компьютерные науки', '02.04.01', 2, 'https://msu.ru/programs/02.04.01', 60, 20, 390000, 'Магистерская программа по прикладной математике', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000003');


--
-- TOC entry 3528 (class 0 OID 33815)
-- Dependencies: 229
-- Data for Name: recimmendation_program_user; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.recimmendation_program_user VALUES ('80000001-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'Сумма баллов 274, проходной в 2025 — 290. Есть БВИ по олимпиаде по информатике.', 75);
INSERT INTO public.recimmendation_program_user VALUES ('80000001-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000002', 'Сумма баллов 274, проходной 285. Баллы выше среднего, шансы высокие.', 82);
INSERT INTO public.recimmendation_program_user VALUES ('80000001-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000002', '90000001-0000-0000-0000-000000000003', 'Сумма баллов 253, проходной 235. Уверенное превышение порога.', 90);
INSERT INTO public.recimmendation_program_user VALUES ('80000001-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000003', '90000001-0000-0000-0000-000000000005', 'Сумма баллов 232, проходной 245. Есть шанс за счёт волонтёрства.', 45);
INSERT INTO public.recimmendation_program_user VALUES ('80000001-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000004', '90000001-0000-0000-0000-000000000004', 'Сумма баллов 273, проходной 265. Золотая медаль даёт дополнительные баллы.', 88);
INSERT INTO public.recimmendation_program_user VALUES ('80000001-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000005', '90000001-0000-0000-0000-000000000006', 'Сумма баллов 214, проходной 215. Пограничная ситуация.', 50);
INSERT INTO public.recimmendation_program_user VALUES ('80000001-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000005', '90000001-0000-0000-0000-000000000005', 'Сумма баллов 214, проходной 227. Ниже порога, но есть достижения.', 30);


--
-- TOC entry 3521 (class 0 OID 33722)
-- Dependencies: 222
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.regions VALUES ('11111111-1111-1111-1111-111111111111', 'Москва');
INSERT INTO public.regions VALUES ('22222222-2222-2222-2222-222222222222', 'Санкт-Петербург');
INSERT INTO public.regions VALUES ('33333333-3333-3333-3333-333333333333', 'Республика Татарстан');
INSERT INTO public.regions VALUES ('44444444-4444-4444-4444-444444444444', 'Новосибирская область');
INSERT INTO public.regions VALUES ('55555555-5555-5555-5555-555555555555', 'Свердловская область');


--
-- TOC entry 3524 (class 0 OID 33756)
-- Dependencies: 225
-- Data for Name: statement_statuses; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.statement_statuses VALUES ('dddd1111-0000-0000-0000-000000000001', 'Черновик');
INSERT INTO public.statement_statuses VALUES ('dddd1111-0000-0000-0000-000000000002', 'Отправлено');
INSERT INTO public.statement_statuses VALUES ('dddd1111-0000-0000-0000-000000000003', 'На рассмотрении');
INSERT INTO public.statement_statuses VALUES ('dddd1111-0000-0000-0000-000000000004', 'Приглашение на экзамен');
INSERT INTO public.statement_statuses VALUES ('dddd1111-0000-0000-0000-000000000005', 'Зачислен');
INSERT INTO public.statement_statuses VALUES ('dddd1111-0000-0000-0000-000000000006', 'Отклонено');
INSERT INTO public.statement_statuses VALUES ('dddd1111-0000-0000-0000-000000000007', 'Отозвано');


--
-- TOC entry 3523 (class 0 OID 33751)
-- Dependencies: 224
-- Data for Name: statements; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.statements VALUES ('50000001-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'dddd1111-0000-0000-0000-000000000002');
INSERT INTO public.statements VALUES ('50000001-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000002', 'dddd1111-0000-0000-0000-000000000003');
INSERT INTO public.statements VALUES ('50000001-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000002', '90000001-0000-0000-0000-000000000003', 'dddd1111-0000-0000-0000-000000000002');
INSERT INTO public.statements VALUES ('50000001-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000003', '90000001-0000-0000-0000-000000000005', 'dddd1111-0000-0000-0000-000000000004');
INSERT INTO public.statements VALUES ('50000001-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000004', '90000001-0000-0000-0000-000000000004', 'dddd1111-0000-0000-0000-000000000005');
INSERT INTO public.statements VALUES ('50000001-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000005', '90000001-0000-0000-0000-000000000006', 'dddd1111-0000-0000-0000-000000000001');


--
-- TOC entry 3518 (class 0 OID 33679)
-- Dependencies: 219
-- Data for Name: type_study; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.type_study VALUES ('bbbb1111-0000-0000-0000-000000000001', 'Очная');
INSERT INTO public.type_study VALUES ('bbbb1111-0000-0000-0000-000000000002', 'Очно-заочная');
INSERT INTO public.type_study VALUES ('bbbb1111-0000-0000-0000-000000000003', 'Заочная');


--
-- TOC entry 3515 (class 0 OID 33634)
-- Dependencies: 216
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.universities VALUES ('e0000001-0000-0000-0000-000000000001', 'Московский государственный университет имени М.В. Ломоносова', 'priem@msu.ru', 'МГУ', 'https://msu.ru', 'https://msu.ru/logo.png', 'Крупнейший классический университет России', '11111111-1111-1111-1111-111111111111');
INSERT INTO public.universities VALUES ('e0000001-0000-0000-0000-000000000002', 'Национальный исследовательский университет ИТМО', 'priem@itmo.ru', 'ИТМО', 'https://itmo.ru', 'https://itmo.ru/logo.png', 'Ведущий университет в области ИТ, фотоники и робототехники', '22222222-2222-2222-2222-222222222222');
INSERT INTO public.universities VALUES ('e0000001-0000-0000-0000-000000000003', 'Казанский (Приволжский) федеральный университет', 'priem@kpfu.ru', 'КФУ', 'https://kpfu.ru', 'https://kpfu.ru/logo.png', 'Один из старейших университетов России', '33333333-3333-3333-3333-333333333333');
INSERT INTO public.universities VALUES ('e0000001-0000-0000-0000-000000000004', 'Новосибирский государственный университет', 'priem@nsu.ru', 'НГУ', 'https://nsu.ru', 'https://nsu.ru/logo.png', 'Ведущий научно-образовательный центр Сибири', '44444444-4444-4444-4444-444444444444');
INSERT INTO public.universities VALUES ('e0000001-0000-0000-0000-000000000005', 'Уральский федеральный университет имени Б.Н. Ельцина', 'priem@urfu.ru', 'УрФУ', 'https://urfu.ru', 'https://urfu.ru/logo.png', 'Крупнейший вуз Урала', '55555555-5555-5555-5555-555555555555');


--
-- TOC entry 3527 (class 0 OID 33800)
-- Dependencies: 228
-- Data for Name: user_exam; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', 'eeeee111-0000-0000-0000-000000000001', 87);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', 'eeeee111-0000-0000-0000-000000000002', 92);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000001', 'eeeee111-0000-0000-0000-000000000003', 95);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000002', 'eeeee111-0000-0000-0000-000000000001', 78);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000002', 'eeeee111-0000-0000-0000-000000000002', 85);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000002', 'eeeee111-0000-0000-0000-000000000005', 90);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000003', 'eeeee111-0000-0000-0000-000000000001', 72);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000008', '00000001-0000-0000-0000-000000000003', 'eeeee111-0000-0000-0000-000000000002', 78);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000009', '00000001-0000-0000-0000-000000000003', 'eeeee111-0000-0000-0000-000000000003', 82);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000010', '00000001-0000-0000-0000-000000000004', 'eeeee111-0000-0000-0000-000000000001', 91);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000011', '00000001-0000-0000-0000-000000000004', 'eeeee111-0000-0000-0000-000000000002', 88);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000012', '00000001-0000-0000-0000-000000000004', 'eeeee111-0000-0000-0000-000000000005', 94);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000013', '00000001-0000-0000-0000-000000000005', 'eeeee111-0000-0000-0000-000000000001', 69);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000014', '00000001-0000-0000-0000-000000000005', 'eeeee111-0000-0000-0000-000000000002', 74);
INSERT INTO public.user_exam VALUES ('20000001-0000-0000-0000-000000000015', '00000001-0000-0000-0000-000000000005', 'eeeee111-0000-0000-0000-000000000004', 71);


--
-- TOC entry 3513 (class 0 OID 33609)
-- Dependencies: 214
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.users VALUES ('00000001-0000-0000-0000-000000000001', 'Иван', 'Иванов', 'Сергеевич', 'ivanov@example.com', '4510 123456', '123-456-789 00', 'Среднее общее', '11111111-1111-1111-1111-111111111111');
INSERT INTO public.users VALUES ('00000001-0000-0000-0000-000000000002', 'Анна', 'Петрова', 'Дмитриевна', 'petrova@example.com', '4015 654321', '987-654-321 00', 'Среднее общее', '22222222-2222-2222-2222-222222222222');
INSERT INTO public.users VALUES ('00000001-0000-0000-0000-000000000003', 'Тимур', 'Гареев', 'Рустамович', 'gareev@example.com', '9212 112233', '111-222-333 44', 'Среднее общее', '33333333-3333-3333-3333-333333333333');
INSERT INTO public.users VALUES ('00000001-0000-0000-0000-000000000004', 'Мария', 'Кузнецова', 'Андреевна', 'kuznetsova@example.com', '5018 778899', '555-666-777 88', 'Среднее общее', '44444444-4444-4444-4444-444444444444');
INSERT INTO public.users VALUES ('00000001-0000-0000-0000-000000000005', 'Артём', 'Соколов', 'Игоревич', 'sokolov@example.com', '6601 445566', '222-333-444 55', 'Среднее общее', '55555555-5555-5555-5555-555555555555');


--
-- TOC entry 3520 (class 0 OID 33707)
-- Dependencies: 221
-- Data for Name: users_programs; Type: TABLE DATA; Schema: public; Owner: gmn
--

INSERT INTO public.users_programs VALUES ('70000001-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001');
INSERT INTO public.users_programs VALUES ('70000001-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000002');
INSERT INTO public.users_programs VALUES ('70000001-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000002', '90000001-0000-0000-0000-000000000003');
INSERT INTO public.users_programs VALUES ('70000001-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000003', '90000001-0000-0000-0000-000000000005');
INSERT INTO public.users_programs VALUES ('70000001-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000004', '90000001-0000-0000-0000-000000000004');
INSERT INTO public.users_programs VALUES ('70000001-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000005', '90000001-0000-0000-0000-000000000006');
INSERT INTO public.users_programs VALUES ('70000001-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000005', '90000001-0000-0000-0000-000000000005');


--
-- TOC entry 3334 (class 2606 OID 33745)
-- Name: achievement_categories achievement_categories_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.achievement_categories
    ADD CONSTRAINT achievement_categories_pk PRIMARY KEY (id);


--
-- TOC entry 3300 (class 2606 OID 33628)
-- Name: achievement achievement_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT achievement_pk PRIMARY KEY (id);


--
-- TOC entry 3348 (class 2606 OID 33838)
-- Name: comparisons comparisons_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.comparisons
    ADD CONSTRAINT comparisons_pk PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 33699)
-- Name: education_levels education_levels_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.education_levels
    ADD CONSTRAINT education_levels_pk PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 33701)
-- Name: education_levels education_levels_unique; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.education_levels
    ADD CONSTRAINT education_levels_unique UNIQUE (name);


--
-- TOC entry 3340 (class 2606 OID 33784)
-- Name: exams exams_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pk PRIMARY KEY (id);


--
-- TOC entry 3314 (class 2606 OID 33657)
-- Name: faculties faculties_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pk PRIMARY KEY (id);


--
-- TOC entry 3316 (class 2606 OID 33659)
-- Name: faculties faculties_unique; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_unique UNIQUE (short_name);


--
-- TOC entry 3342 (class 2606 OID 33789)
-- Name: program_exam program_exam_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.program_exam
    ADD CONSTRAINT program_exam_pk PRIMARY KEY (id);


--
-- TOC entry 3318 (class 2606 OID 33671)
-- Name: programs programs_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pk PRIMARY KEY (id);


--
-- TOC entry 3320 (class 2606 OID 33673)
-- Name: programs programs_unique; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_unique UNIQUE (official_url);


--
-- TOC entry 3346 (class 2606 OID 33821)
-- Name: recimmendation_program_user recimmendation_program_user_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.recimmendation_program_user
    ADD CONSTRAINT recimmendation_program_user_pk PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2606 OID 33728)
-- Name: regions regions_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pk PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 33762)
-- Name: statement_statuses statement_statuses_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.statement_statuses
    ADD CONSTRAINT statement_statuses_pk PRIMARY KEY (id);


--
-- TOC entry 3336 (class 2606 OID 33755)
-- Name: statements statements_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.statements
    ADD CONSTRAINT statements_pk PRIMARY KEY (id);


--
-- TOC entry 3322 (class 2606 OID 33685)
-- Name: type_study type_study_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.type_study
    ADD CONSTRAINT type_study_pk PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 33687)
-- Name: type_study type_study_unique; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.type_study
    ADD CONSTRAINT type_study_unique UNIQUE (name);


--
-- TOC entry 3302 (class 2606 OID 33640)
-- Name: universities universities_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pk PRIMARY KEY (id);


--
-- TOC entry 3304 (class 2606 OID 33642)
-- Name: universities universities_unique; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_unique UNIQUE (name);


--
-- TOC entry 3306 (class 2606 OID 33644)
-- Name: universities universities_unique_1; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_unique_1 UNIQUE (email);


--
-- TOC entry 3308 (class 2606 OID 33646)
-- Name: universities universities_unique_2; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_unique_2 UNIQUE (short_name);


--
-- TOC entry 3310 (class 2606 OID 33648)
-- Name: universities universities_unique_3; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_unique_3 UNIQUE (official_url);


--
-- TOC entry 3312 (class 2606 OID 33650)
-- Name: universities universities_unique_4; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_unique_4 UNIQUE (logo);


--
-- TOC entry 3344 (class 2606 OID 33804)
-- Name: user_exam user_exam_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.user_exam
    ADD CONSTRAINT user_exam_pk PRIMARY KEY (id);


--
-- TOC entry 3292 (class 2606 OID 33615)
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- TOC entry 3330 (class 2606 OID 33711)
-- Name: users_programs users_programs_pk; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users_programs
    ADD CONSTRAINT users_programs_pk PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 33617)
-- Name: users users_unique; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique UNIQUE (email);


--
-- TOC entry 3296 (class 2606 OID 33619)
-- Name: users users_unique_1; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique_1 UNIQUE (passport);


--
-- TOC entry 3298 (class 2606 OID 33621)
-- Name: users users_unique_2; Type: CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique_2 UNIQUE (snils);


--
-- TOC entry 3350 (class 2606 OID 33746)
-- Name: achievement achievement_achievement_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT achievement_achievement_categories_fk FOREIGN KEY (id_category) REFERENCES public.achievement_categories(id) ON DELETE SET NULL;


--
-- TOC entry 3351 (class 2606 OID 33629)
-- Name: achievement achievement_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT achievement_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3368 (class 2606 OID 33839)
-- Name: comparisons comparisons_programs_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.comparisons
    ADD CONSTRAINT comparisons_programs_fk FOREIGN KEY (id_program_fisrt) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3369 (class 2606 OID 33844)
-- Name: comparisons comparisons_programs_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.comparisons
    ADD CONSTRAINT comparisons_programs_fk_1 FOREIGN KEY (id_program_second) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3370 (class 2606 OID 33849)
-- Name: comparisons comparisons_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.comparisons
    ADD CONSTRAINT comparisons_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3353 (class 2606 OID 33660)
-- Name: faculties faculties_universities_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_universities_fk FOREIGN KEY (id_university) REFERENCES public.universities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3362 (class 2606 OID 33795)
-- Name: program_exam program_exam_exams_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.program_exam
    ADD CONSTRAINT program_exam_exams_fk FOREIGN KEY (id_exam) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- TOC entry 3363 (class 2606 OID 33790)
-- Name: program_exam program_exam_programs_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.program_exam
    ADD CONSTRAINT program_exam_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON DELETE CASCADE;


--
-- TOC entry 3354 (class 2606 OID 33702)
-- Name: programs programs_education_levels_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_education_levels_fk FOREIGN KEY (id_education_levels) REFERENCES public.education_levels(id);


--
-- TOC entry 3355 (class 2606 OID 33674)
-- Name: programs programs_faculties_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_faculties_fk FOREIGN KEY (id_faculty) REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3356 (class 2606 OID 33688)
-- Name: programs programs_type_study_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_type_study_fk FOREIGN KEY (id_type_study) REFERENCES public.type_study(id);


--
-- TOC entry 3366 (class 2606 OID 33827)
-- Name: recimmendation_program_user recimmendation_program_user_programs_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.recimmendation_program_user
    ADD CONSTRAINT recimmendation_program_user_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3367 (class 2606 OID 33822)
-- Name: recimmendation_program_user recimmendation_program_user_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.recimmendation_program_user
    ADD CONSTRAINT recimmendation_program_user_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3359 (class 2606 OID 33768)
-- Name: statements statements_programs_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.statements
    ADD CONSTRAINT statements_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON DELETE CASCADE;


--
-- TOC entry 3360 (class 2606 OID 33773)
-- Name: statements statements_statement_statuses_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.statements
    ADD CONSTRAINT statements_statement_statuses_fk FOREIGN KEY (id_status) REFERENCES public.statement_statuses(id) ON DELETE SET NULL;


--
-- TOC entry 3361 (class 2606 OID 33763)
-- Name: statements statements_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.statements
    ADD CONSTRAINT statements_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3352 (class 2606 OID 33734)
-- Name: universities universities_regions_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_regions_fk FOREIGN KEY (id_region) REFERENCES public.regions(id) ON DELETE SET NULL;


--
-- TOC entry 3364 (class 2606 OID 33810)
-- Name: user_exam user_exam_exams_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.user_exam
    ADD CONSTRAINT user_exam_exams_fk FOREIGN KEY (id_exam) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- TOC entry 3365 (class 2606 OID 33805)
-- Name: user_exam user_exam_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.user_exam
    ADD CONSTRAINT user_exam_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3357 (class 2606 OID 33717)
-- Name: users_programs users_programs_programs_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users_programs
    ADD CONSTRAINT users_programs_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3358 (class 2606 OID 33712)
-- Name: users_programs users_programs_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users_programs
    ADD CONSTRAINT users_programs_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3349 (class 2606 OID 33729)
-- Name: users users_regions_fk; Type: FK CONSTRAINT; Schema: public; Owner: gmn
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_regions_fk FOREIGN KEY (id_region) REFERENCES public.regions(id) ON DELETE SET NULL;


-- Completed on 2026-09-14 16:47:23

--
-- PostgreSQL database dump complete
--

