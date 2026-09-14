-- public.type_study определение

-- Drop table

-- DROP TABLE public.type_study;

CREATE TABLE public.type_study (
	id uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT type_study_pk PRIMARY KEY (id),
	CONSTRAINT type_study_unique UNIQUE (name)
);


-- public.education_levels определение

-- Drop table

-- DROP TABLE public.education_levels;

CREATE TABLE public.education_levels (
	id uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT education_levels_pk PRIMARY KEY (id),
	CONSTRAINT education_levels_unique UNIQUE (name)
);


-- public.regions определение

-- Drop table

-- DROP TABLE public.regions;

CREATE TABLE public.regions (
	id uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT regions_pk PRIMARY KEY (id)
);


-- public.achievement_categories определение

-- Drop table

-- DROP TABLE public.achievement_categories;

CREATE TABLE public.achievement_categories (
	id uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT achievement_categories_pk PRIMARY KEY (id)
);


-- public.statement_statuses определение

-- Drop table

-- DROP TABLE public.statement_statuses;

CREATE TABLE public.statement_statuses (
	id uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT statement_statuses_pk PRIMARY KEY (id)
);


-- public.exams определение

-- Drop table

-- DROP TABLE public.exams;

CREATE TABLE public.exams (
	id uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT exams_pk PRIMARY KEY (id)
);


-- public.users определение

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid NOT NULL,
	first_name text NOT NULL,
	last_name text NOT NULL,
	patronymic text NOT NULL,
	email text NOT NULL,
	passport text NOT NULL,
	snils text NOT NULL,
	education text NOT NULL,
	id_region uuid NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_unique UNIQUE (email),
	CONSTRAINT users_unique_1 UNIQUE (passport),
	CONSTRAINT users_unique_2 UNIQUE (snils),
	CONSTRAINT users_regions_fk FOREIGN KEY (id_region) REFERENCES public.regions(id) ON DELETE SET NULL
);


-- public.achievement определение

-- Drop table

-- DROP TABLE public.achievement;

CREATE TABLE public.achievement (
	id uuid NOT NULL,
	"name" text NOT NULL,
	id_user uuid NOT NULL,
	id_category uuid NOT NULL,
	CONSTRAINT achievement_pk PRIMARY KEY (id),
	CONSTRAINT achievement_achievement_categories_fk FOREIGN KEY (id_category) REFERENCES public.achievement_categories(id) ON DELETE SET NULL,
	CONSTRAINT achievement_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.universities определение

-- Drop table

-- DROP TABLE public.universities;

CREATE TABLE public.universities (
	id uuid NOT NULL,
	"name" text NOT NULL,
	email text NOT NULL,
	short_name text NOT NULL,
	official_url text NULL,
	logo text NULL,
	description text NULL,
	id_region uuid NULL,
	CONSTRAINT universities_pk PRIMARY KEY (id),
	CONSTRAINT universities_unique UNIQUE (name),
	CONSTRAINT universities_unique_1 UNIQUE (email),
	CONSTRAINT universities_unique_2 UNIQUE (short_name),
	CONSTRAINT universities_unique_3 UNIQUE (official_url),
	CONSTRAINT universities_unique_4 UNIQUE (logo),
	CONSTRAINT universities_regions_fk FOREIGN KEY (id_region) REFERENCES public.regions(id) ON DELETE SET NULL
);


-- public.faculties определение

-- Drop table

-- DROP TABLE public.faculties;

CREATE TABLE public.faculties (
	id uuid NOT NULL,
	"name" text NOT NULL,
	id_university uuid NOT NULL,
	short_name text NOT NULL,
	official_url text NULL,
	CONSTRAINT faculties_pk PRIMARY KEY (id),
	CONSTRAINT faculties_unique UNIQUE (short_name),
	CONSTRAINT faculties_universities_fk FOREIGN KEY (id_university) REFERENCES public.universities(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.programs определение

-- Drop table

-- DROP TABLE public.programs;

CREATE TABLE public.programs (
	id uuid NOT NULL,
	id_faculty uuid NOT NULL,
	"name" text NOT NULL,
	code text NOT NULL,
	duration_years int4 NOT NULL,
	official_url text NULL,
	budget_places int4 NOT NULL,
	paid_places int4 NULL,
	tuition_price int4 NULL,
	description text NULL,
	id_type_study uuid NULL,
	id_education_levels uuid NOT NULL,
	CONSTRAINT programs_pk PRIMARY KEY (id),
	CONSTRAINT programs_unique UNIQUE (official_url),
	CONSTRAINT programs_education_levels_fk FOREIGN KEY (id_education_levels) REFERENCES public.education_levels(id),
	CONSTRAINT programs_faculties_fk FOREIGN KEY (id_faculty) REFERENCES public.faculties(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT programs_type_study_fk FOREIGN KEY (id_type_study) REFERENCES public.type_study(id)
);


-- public.users_programs определение

-- Drop table

-- DROP TABLE public.users_programs;

CREATE TABLE public.users_programs (
	id uuid NOT NULL,
	id_user uuid NOT NULL,
	id_program uuid NOT NULL,
	CONSTRAINT users_programs_pk PRIMARY KEY (id),
	CONSTRAINT users_programs_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT users_programs_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.statements определение

-- Drop table

-- DROP TABLE public.statements;

CREATE TABLE public.statements (
	id uuid NOT NULL,
	id_user uuid NOT NULL,
	id_program uuid NOT NULL,
	id_status uuid NOT NULL,
	CONSTRAINT statements_pk PRIMARY KEY (id),
	CONSTRAINT statements_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON DELETE CASCADE,
	CONSTRAINT statements_statement_statuses_fk FOREIGN KEY (id_status) REFERENCES public.statement_statuses(id) ON DELETE SET NULL,
	CONSTRAINT statements_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.program_exam определение

-- Drop table

-- DROP TABLE public.program_exam;

CREATE TABLE public.program_exam (
	id uuid NOT NULL,
	id_program uuid NOT NULL,
	id_exam uuid NULL,
	passing_score int4 NOT NULL,
	CONSTRAINT program_exam_pk PRIMARY KEY (id),
	CONSTRAINT program_exam_exams_fk FOREIGN KEY (id_exam) REFERENCES public.exams(id) ON DELETE CASCADE,
	CONSTRAINT program_exam_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON DELETE CASCADE
);


-- public.user_exam определение

-- Drop table

-- DROP TABLE public.user_exam;

CREATE TABLE public.user_exam (
	id uuid NOT NULL,
	id_user uuid NOT NULL,
	id_exam uuid NOT NULL,
	score_achieved int4 NOT NULL,
	CONSTRAINT user_exam_pk PRIMARY KEY (id),
	CONSTRAINT user_exam_exams_fk FOREIGN KEY (id_exam) REFERENCES public.exams(id) ON DELETE CASCADE,
	CONSTRAINT user_exam_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.recimmendation_program_user определение

-- Drop table

-- DROP TABLE public.recimmendation_program_user;

CREATE TABLE public.recimmendation_program_user (
	id uuid NOT NULL,
	id_user uuid NOT NULL,
	id_program uuid NULL,
	explanation text NOT NULL,
	chance_score int4 NOT NULL,
	CONSTRAINT recimmendation_program_user_pk PRIMARY KEY (id),
	CONSTRAINT recimmendation_program_user_programs_fk FOREIGN KEY (id_program) REFERENCES public.programs(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT recimmendation_program_user_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.comparisons определение

-- Drop table

-- DROP TABLE public.comparisons;

CREATE TABLE public.comparisons (
	id uuid NOT NULL,
	id_user uuid NOT NULL,
	id_program_fisrt uuid NOT NULL,
	id_program_second uuid NOT NULL,
	explanation text NOT NULL,
	top_program int4 NOT NULL,
	CONSTRAINT comparisons_pk PRIMARY KEY (id),
	CONSTRAINT comparisons_programs_fk FOREIGN KEY (id_program_fisrt) REFERENCES public.programs(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT comparisons_programs_fk_1 FOREIGN KEY (id_program_second) REFERENCES public.programs(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT comparisons_users_fk FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- =========================================================
-- 1. СПРАВОЧНИКИ
-- =========================================================

INSERT INTO public.regions (id, "name") VALUES
('11111111-1111-1111-1111-111111111111', 'Москва'),
('22222222-2222-2222-2222-222222222222', 'Санкт-Петербург'),
('33333333-3333-3333-3333-333333333333', 'Республика Татарстан'),
('44444444-4444-4444-4444-444444444444', 'Новосибирская область'),
('55555555-5555-5555-5555-555555555555', 'Свердловская область');

INSERT INTO public.education_levels (id, "name") VALUES
('aaaa1111-0000-0000-0000-000000000001', 'Бакалавриат'),
('aaaa1111-0000-0000-0000-000000000002', 'Специалитет'),
('aaaa1111-0000-0000-0000-000000000003', 'Магистратура'),
('aaaa1111-0000-0000-0000-000000000004', 'Аспирантура');

INSERT INTO public.type_study (id, "name") VALUES
('bbbb1111-0000-0000-0000-000000000001', 'Очная'),
('bbbb1111-0000-0000-0000-000000000002', 'Очно-заочная'),
('bbbb1111-0000-0000-0000-000000000003', 'Заочная');

INSERT INTO public.achievement_categories (id, "name") VALUES
('cccc1111-0000-0000-0000-000000000001', 'Олимпиады'),
('cccc1111-0000-0000-0000-000000000002', 'Спорт'),
('cccc1111-0000-0000-0000-000000000003', 'Волонтёрство'),
('cccc1111-0000-0000-0000-000000000004', 'Академические успехи'),
('cccc1111-0000-0000-0000-000000000005', 'Творческие конкурсы');

INSERT INTO public.statement_statuses (id, "name") VALUES
('dddd1111-0000-0000-0000-000000000001', 'Черновик'),
('dddd1111-0000-0000-0000-000000000002', 'Отправлено'),
('dddd1111-0000-0000-0000-000000000003', 'На рассмотрении'),
('dddd1111-0000-0000-0000-000000000004', 'Приглашение на экзамен'),
('dddd1111-0000-0000-0000-000000000005', 'Зачислен'),
('dddd1111-0000-0000-0000-000000000006', 'Отклонено'),
('dddd1111-0000-0000-0000-000000000007', 'Отозвано');

-- Экзамены (ЕГЭ)
INSERT INTO public.exams (id, "name") VALUES
('eeeee111-0000-0000-0000-000000000001', 'Русский язык'),
('eeeee111-0000-0000-0000-000000000002', 'Математика (профиль)'),
('eeeee111-0000-0000-0000-000000000003', 'Информатика'),
('eeeee111-0000-0000-0000-000000000004', 'Физика'),
('eeeee111-0000-0000-0000-000000000005', 'Обществознание'),
('eeeee111-0000-0000-0000-000000000006', 'История'),
('eeeee111-0000-0000-0000-000000000007', 'Биология'),
('eeeee111-0000-0000-0000-000000000008', 'Химия'),
('eeeee111-0000-0000-0000-000000000009', 'Английский язык');

-- =========================================================
-- 2. ПОЛЬЗОВАТЕЛИ
-- =========================================================

INSERT INTO public.users
(id, first_name, last_name, patronymic, email, passport, snils, education, id_region)
VALUES
('00000001-0000-0000-0000-000000000001', 'Иван', 'Иванов', 'Сергеевич',
 'ivanov@example.com', '4510 123456', '123-456-789 00', 'Среднее общее',
 '11111111-1111-1111-1111-111111111111'),

('00000001-0000-0000-0000-000000000002', 'Анна', 'Петрова', 'Дмитриевна',
 'petrova@example.com', '4015 654321', '987-654-321 00', 'Среднее общее',
 '22222222-2222-2222-2222-222222222222'),

('00000001-0000-0000-0000-000000000003', 'Тимур', 'Гареев', 'Рустамович',
 'gareev@example.com', '9212 112233', '111-222-333 44', 'Среднее общее',
 '33333333-3333-3333-3333-333333333333'),

('00000001-0000-0000-0000-000000000004', 'Мария', 'Кузнецова', 'Андреевна',
 'kuznetsova@example.com', '5018 778899', '555-666-777 88', 'Среднее общее',
 '44444444-4444-4444-4444-444444444444'),

('00000001-0000-0000-0000-000000000005', 'Артём', 'Соколов', 'Игоревич',
 'sokolov@example.com', '6601 445566', '222-333-444 55', 'Среднее общее',
 '55555555-5555-5555-5555-555555555555');

-- =========================================================
-- 3. ДОСТИЖЕНИЯ
-- =========================================================

INSERT INTO public.achievement (id, "name", id_user, id_category) VALUES
('00000001-0000-0000-0000-000000000001', 'Призёр ВсОШ по информатике',
 '00000001-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000001'),

('00000001-0000-0000-0000-000000000002', 'Золотой знак ГТО',
 '00000001-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000002'),

('00000001-0000-0000-0000-000000000003', 'Победитель олимпиады «Высшая проба»',
 '00000001-0000-0000-0000-000000000002', 'cccc1111-0000-0000-0000-000000000001'),

('00000001-0000-0000-0000-000000000004', 'Волонтёрство 150+ часов',
 '00000001-0000-0000-0000-000000000003', 'cccc1111-0000-0000-0000-000000000003'),

('00000001-0000-0000-0000-000000000005', 'Золотая медаль',
 '00000001-0000-0000-0000-000000000004', 'cccc1111-0000-0000-0000-000000000004'),

('00000001-0000-0000-0000-000000000006', 'Призёр регионального этапа ВсОШ по физике',
 '00000001-0000-0000-0000-000000000005', 'cccc1111-0000-0000-0000-000000000001');

-- =========================================================
-- 4. ВУЗЫ
-- =========================================================

INSERT INTO public.universities
(id, "name", email, short_name, official_url, logo, description, id_region)
VALUES
('e0000001-0000-0000-0000-000000000001',
 'Московский государственный университет имени М.В. Ломоносова',
 'priem@msu.ru', 'МГУ', 'https://msu.ru', 'https://msu.ru/logo.png',
 'Крупнейший классический университет России',
 '11111111-1111-1111-1111-111111111111'),

('e0000001-0000-0000-0000-000000000002',
 'Национальный исследовательский университет ИТМО',
 'priem@itmo.ru', 'ИТМО', 'https://itmo.ru', 'https://itmo.ru/logo.png',
 'Ведущий университет в области ИТ, фотоники и робототехники',
 '22222222-2222-2222-2222-222222222222'),

('e0000001-0000-0000-0000-000000000003',
 'Казанский (Приволжский) федеральный университет',
 'priem@kpfu.ru', 'КФУ', 'https://kpfu.ru', 'https://kpfu.ru/logo.png',
 'Один из старейших университетов России',
 '33333333-3333-3333-3333-333333333333'),

('e0000001-0000-0000-0000-000000000004',
 'Новосибирский государственный университет',
 'priem@nsu.ru', 'НГУ', 'https://nsu.ru', 'https://nsu.ru/logo.png',
 'Ведущий научно-образовательный центр Сибири',
 '44444444-4444-4444-4444-444444444444'),

('e0000001-0000-0000-0000-000000000005',
 'Уральский федеральный университет имени Б.Н. Ельцина',
 'priem@urfu.ru', 'УрФУ', 'https://urfu.ru', 'https://urfu.ru/logo.png',
 'Крупнейший вуз Урала',
 '55555555-5555-5555-5555-555555555555');

-- =========================================================
-- 5. ФАКУЛЬТЕТЫ
-- =========================================================

INSERT INTO public.faculties
(id, "name", id_university, short_name, official_url)
VALUES
('f0000001-0000-0000-0000-000000000001',
 'Факультет вычислительной математики и кибернетики',
 'e0000001-0000-0000-0000-000000000001', 'ВМК МГУ',
 'https://msu.ru/vmk'),

('f0000001-0000-0000-0000-000000000002',
 'Экономический факультет',
 'e0000001-0000-0000-0000-000000000001', 'ЭФ МГУ',
 'https://msu.ru/econ'),

('f0000001-0000-0000-0000-000000000003',
 'Факультет информационных технологий и программирования',
 'e0000001-0000-0000-0000-000000000002', 'ФИТиП ИТМО',
 'https://itmo.ru/fitip'),

('f0000001-0000-0000-0000-000000000004',
 'Институт информационных технологий и интеллектуальных систем',
 'e0000001-0000-0000-0000-000000000003', 'ИТИС КФУ',
 'https://kpfu.ru/itis'),

('f0000001-0000-0000-0000-000000000005',
 'Факультет информационных технологий',
 'e0000001-0000-0000-0000-000000000004', 'ФИТ НГУ',
 'https://nsu.ru/fit'),

('f0000001-0000-0000-0000-000000000006',
 'Институт радиоэлектроники и информационных технологий',
 'e0000001-0000-0000-0000-000000000005', 'ИРИТ-РТФ УрФУ',
 'https://urfu.ru/irit');

-- =========================================================
-- 6. ПРОГРАММЫ
-- =========================================================

INSERT INTO public.programs
(id, id_faculty, "name", code, duration_years, official_url,
 budget_places, paid_places, tuition_price, description,
 id_type_study, id_education_levels)
VALUES
('90000001-0000-0000-0000-000000000001',
 'f0000001-0000-0000-0000-000000000001',
 'Прикладная математика и информатика', '01.03.02', 4,
 'https://msu.ru/programs/01.03.02', 250, 50, 380000,
 'Фундаментальная подготовка в области математики и программирования',
 'bbbb1111-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000001'),

('90000001-0000-0000-0000-000000000002',
 'f0000001-0000-0000-0000-000000000003',
 'Программная инженерия', '09.03.04', 4,
 'https://itmo.ru/programs/09.03.04', 200, 100, 350000,
 'Разработка программного обеспечения и архитектура систем',
 'bbbb1111-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000001'),

('90000001-0000-0000-0000-000000000003',
 'f0000001-0000-0000-0000-000000000004',
 'Информационные системы и технологии', '09.03.02', 4,
 'https://kpfu.ru/programs/09.03.02', 150, 75, 220000,
 'Проектирование и сопровождение информационных систем',
 'bbbb1111-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000001'),

('90000001-0000-0000-0000-000000000004',
 'f0000001-0000-0000-0000-000000000002',
 'Экономика', '38.03.01', 4,
 'https://msu.ru/programs/38.03.01', 180, 120, 400000,
 'Экономическая теория, финансы и анализ данных',
 'bbbb1111-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000001'),

('90000001-0000-0000-0000-000000000005',
 'f0000001-0000-0000-0000-000000000005',
 'Информатика и вычислительная техника', '09.03.01', 4,
 'https://nsu.ru/programs/09.03.01', 120, 40, 210000,
 'Системное программирование и вычислительные системы',
 'bbbb1111-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000001'),

('90000001-0000-0000-0000-000000000006',
 'f0000001-0000-0000-0000-000000000006',
 'Радиотехника', '11.03.01', 4,
 'https://urfu.ru/programs/11.03.01', 100, 50, 190000,
 'Проектирование радиотехнических устройств и систем',
 'bbbb1111-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000001'),

('90000001-0000-0000-0000-000000000007',
 'f0000001-0000-0000-0000-000000000001',
 'Математика и компьютерные науки', '02.04.01', 2,
 'https://msu.ru/programs/02.04.01', 60, 20, 390000,
 'Магистерская программа по прикладной математике',
 'bbbb1111-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000003');

-- =========================================================
-- 7. ТРЕБУЕМЫЕ ЭКЗАМЕНЫ ПО ПРОГРАММАМ (program_exam)
-- =========================================================

INSERT INTO public.program_exam (id, id_program, id_exam, passing_score) VALUES
-- ПМИ МГУ
('10000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000001',
 'eeeee111-0000-0000-0000-000000000002', 90),
('10000001-0000-0000-0000-000000000002',
 '90000001-0000-0000-0000-000000000001',
 'eeeee111-0000-0000-0000-000000000003', 85),
('10000001-0000-0000-0000-000000000003',
 '90000001-0000-0000-0000-000000000001',
 'eeeee111-0000-0000-0000-000000000001', 80),

-- Программная инженерия ИТМО
('10000001-0000-0000-0000-000000000004',
 '90000001-0000-0000-0000-000000000002',
 'eeeee111-0000-0000-0000-000000000002', 88),
('10000001-0000-0000-0000-000000000005',
 '90000001-0000-0000-0000-000000000002',
 'eeeee111-0000-0000-0000-000000000003', 85),
('10000001-0000-0000-0000-000000000006',
 '90000001-0000-0000-0000-000000000002',
 'eeeee111-0000-0000-0000-000000000001', 78),

-- ИСиТ КФУ
('10000001-0000-0000-0000-000000000007',
 '90000001-0000-0000-0000-000000000003',
 'eeeee111-0000-0000-0000-000000000002', 75),
('10000001-0000-0000-0000-000000000008',
 '90000001-0000-0000-0000-000000000003',
 'eeeee111-0000-0000-0000-000000000003', 70),
('10000001-0000-0000-0000-000000000009',
 '90000001-0000-0000-0000-000000000003',
 'eeeee111-0000-0000-0000-000000000001', 70),

-- Экономика МГУ
('10000001-0000-0000-0000-000000000010',
 '90000001-0000-0000-0000-000000000004',
 'eeeee111-0000-0000-0000-000000000002', 90),
('10000001-0000-0000-0000-000000000011',
 '90000001-0000-0000-0000-000000000004',
 'eeeee111-0000-0000-0000-000000000005', 85),
('10000001-0000-0000-0000-000000000012',
 '90000001-0000-0000-0000-000000000004',
 'eeeee111-0000-0000-0000-000000000001', 80),

-- ИВТ НГУ
('10000001-0000-0000-0000-000000000013',
 '90000001-0000-0000-0000-000000000005',
 'eeeee111-0000-0000-0000-000000000002', 80),
('10000001-0000-0000-0000-000000000014',
 '90000001-0000-0000-0000-000000000005',
 'eeeee111-0000-0000-0000-000000000003', 75),
('10000001-0000-0000-0000-000000000015',
 '90000001-0000-0000-0000-000000000005',
 'eeeee111-0000-0000-0000-000000000001', 72),

-- Радиотехника УрФУ
('10000001-0000-0000-0000-000000000016',
 '90000001-0000-0000-0000-000000000006',
 'eeeee111-0000-0000-0000-000000000002', 70),
('10000001-0000-0000-0000-000000000017',
 '90000001-0000-0000-0000-000000000006',
 'eeeee111-0000-0000-0000-000000000004', 68),
('10000001-0000-0000-0000-000000000018',
 '90000001-0000-0000-0000-000000000006',
 'eeeee111-0000-0000-0000-000000000001', 68);

-- =========================================================
-- 8. БАЛЛЫ ПОЛЬЗОВАТЕЛЕЙ ЗА ЭКЗАМЕНЫ (user_exam)
-- =========================================================

INSERT INTO public.user_exam (id, id_user, id_exam, score_achieved) VALUES
-- Иван Иванов
('20000001-0000-0000-0000-000000000001',
 '00000001-0000-0000-0000-000000000001',
 'eeeee111-0000-0000-0000-000000000001', 87),
('20000001-0000-0000-0000-000000000002',
 '00000001-0000-0000-0000-000000000001',
 'eeeee111-0000-0000-0000-000000000002', 92),
('20000001-0000-0000-0000-000000000003',
 '00000001-0000-0000-0000-000000000001',
 'eeeee111-0000-0000-0000-000000000003', 95),

-- Анна Петрова
('20000001-0000-0000-0000-000000000004',
 '00000001-0000-0000-0000-000000000002',
 'eeeee111-0000-0000-0000-000000000001', 78),
('20000001-0000-0000-0000-000000000005',
 '00000001-0000-0000-0000-000000000002',
 'eeeee111-0000-0000-0000-000000000002', 85),
('20000001-0000-0000-0000-000000000006',
 '00000001-0000-0000-0000-000000000002',
 'eeeee111-0000-0000-0000-000000000005', 90),

-- Тимур Гареев
('20000001-0000-0000-0000-000000000007',
 '00000001-0000-0000-0000-000000000003',
 'eeeee111-0000-0000-0000-000000000001', 72),
('20000001-0000-0000-0000-000000000008',
 '00000001-0000-0000-0000-000000000003',
 'eeeee111-0000-0000-0000-000000000002', 78),
('20000001-0000-0000-0000-000000000009',
 '00000001-0000-0000-0000-000000000003',
 'eeeee111-0000-0000-0000-000000000003', 82),

-- Мария Кузнецова
('20000001-0000-0000-0000-000000000010',
 '00000001-0000-0000-0000-000000000004',
 'eeeee111-0000-0000-0000-000000000001', 91),
('20000001-0000-0000-0000-000000000011',
 '00000001-0000-0000-0000-000000000004',
 'eeeee111-0000-0000-0000-000000000002', 88),
('20000001-0000-0000-0000-000000000012',
 '00000001-0000-0000-0000-000000000004',
 'eeeee111-0000-0000-0000-000000000005', 94),

-- Артём Соколов
('20000001-0000-0000-0000-000000000013',
 '00000001-0000-0000-0000-000000000005',
 'eeeee111-0000-0000-0000-000000000001', 69),
('20000001-0000-0000-0000-000000000014',
 '00000001-0000-0000-0000-000000000005',
 'eeeee111-0000-0000-0000-000000000002', 74),
('20000001-0000-0000-0000-000000000015',
 '00000001-0000-0000-0000-000000000005',
 'eeeee111-0000-0000-0000-000000000004', 71);

-- =========================================================
-- 9. ИЗБРАННОЕ (users_programs)
-- =========================================================

INSERT INTO public.users_programs (id, id_user, id_program) VALUES
('70000001-0000-0000-0000-000000000001',
 '00000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000001'),
('70000001-0000-0000-0000-000000000002',
 '00000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000002'),
('70000001-0000-0000-0000-000000000003',
 '00000001-0000-0000-0000-000000000002',
 '90000001-0000-0000-0000-000000000003'),
('70000001-0000-0000-0000-000000000004',
 '00000001-0000-0000-0000-000000000003',
 '90000001-0000-0000-0000-000000000005'),
('70000001-0000-0000-0000-000000000005',
 '00000001-0000-0000-0000-000000000004',
 '90000001-0000-0000-0000-000000000004'),
('70000001-0000-0000-0000-000000000006',
 '00000001-0000-0000-0000-000000000005',
 '90000001-0000-0000-0000-000000000006'),
('70000001-0000-0000-0000-000000000007',
 '00000001-0000-0000-0000-000000000005',
 '90000001-0000-0000-0000-000000000005');

-- =========================================================
-- 10. ЗАЯВЛЕНИЯ (statements)
-- =========================================================

INSERT INTO public.statements (id, id_user, id_program, id_status) VALUES
('50000001-0000-0000-0000-000000000001',
 '00000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000001',
 'dddd1111-0000-0000-0000-000000000002'),

('50000001-0000-0000-0000-000000000002',
 '00000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000002',
 'dddd1111-0000-0000-0000-000000000003'),

('50000001-0000-0000-0000-000000000003',
 '00000001-0000-0000-0000-000000000002',
 '90000001-0000-0000-0000-000000000003',
 'dddd1111-0000-0000-0000-000000000002'),

('50000001-0000-0000-0000-000000000004',
 '00000001-0000-0000-0000-000000000003',
 '90000001-0000-0000-0000-000000000005',
 'dddd1111-0000-0000-0000-000000000004'),

('50000001-0000-0000-0000-000000000005',
 '00000001-0000-0000-0000-000000000004',
 '90000001-0000-0000-0000-000000000004',
 'dddd1111-0000-0000-0000-000000000005'),

('50000001-0000-0000-0000-000000000006',
 '00000001-0000-0000-0000-000000000005',
 '90000001-0000-0000-0000-000000000006',
 'dddd1111-0000-0000-0000-000000000001');

-- =========================================================
-- 11. РЕКОМЕНДАЦИИ (recimmendation_program_user)
-- =========================================================

INSERT INTO public.recimmendation_program_user
(id, id_user, id_program, explanation, chance_score)
VALUES
('80000001-0000-0000-0000-000000000001',
 '00000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000001',
 'Сумма баллов 274, проходной в 2025 — 290. Есть БВИ по олимпиаде по информатике.',
 75),

('80000001-0000-0000-0000-000000000002',
 '00000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000002',
 'Сумма баллов 274, проходной 285. Баллы выше среднего, шансы высокие.',
 82),

('80000001-0000-0000-0000-000000000003',
 '00000001-0000-0000-0000-000000000002',
 '90000001-0000-0000-0000-000000000003',
 'Сумма баллов 253, проходной 235. Уверенное превышение порога.',
 90),

('80000001-0000-0000-0000-000000000004',
 '00000001-0000-0000-0000-000000000003',
 '90000001-0000-0000-0000-000000000005',
 'Сумма баллов 232, проходной 245. Есть шанс за счёт волонтёрства.',
 45),

('80000001-0000-0000-0000-000000000005',
 '00000001-0000-0000-0000-000000000004',
 '90000001-0000-0000-0000-000000000004',
 'Сумма баллов 273, проходной 265. Золотая медаль даёт дополнительные баллы.',
 88),

('80000001-0000-0000-0000-000000000006',
 '00000001-0000-0000-0000-000000000005',
 '90000001-0000-0000-0000-000000000006',
 'Сумма баллов 214, проходной 215. Пограничная ситуация.',
 50),

('80000001-0000-0000-0000-000000000007',
 '00000001-0000-0000-0000-000000000005',
 '90000001-0000-0000-0000-000000000005',
 'Сумма баллов 214, проходной 227. Ниже порога, но есть достижения.',
 30);

-- =========================================================
-- 12. СРАВНЕНИЯ (comparisons)
-- =========================================================

INSERT INTO public.comparisons
(id, id_user, id_program_fisrt, id_program_second, explanation, top_program)
VALUES
('60000001-0000-0000-0000-000000000001',
 '00000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000001',
 '90000001-0000-0000-0000-000000000002',
 'ПМИ МГУ: выше проходной, но больше бюджетных мест. ПИ ИТМО: ниже стоимость и выше шанс поступить. Для Ивана выгоднее ИТМО по совокупности факторов.',
 2)