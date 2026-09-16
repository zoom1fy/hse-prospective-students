-- Силд-скрипт для HSE Prospective Students.
-- Предполагает, что схема уже создана миграциями Alembic (python -m alembic upgrade head).
-- Запуск: psql -U postgres -d hse_prospective_students -f backend/db_scripts/seed.sql
--
-- Пароль всех демо-пользователей: password123
-- (users.password_hash -- argon2id хеш, сгенерирован app/core/security.hash_password)

BEGIN;

TRUNCATE TABLE
    achievement,
    achievement_categories,
    comparisons,
    education_level,
    exams,
    faculties,
    program_exam,
    programs,
    recommendation_program_user,
    regions,
    statement,
    statement_statuses,
    type_study,
    user_exam,
    user_programs,
    universities,
    users
RESTART IDENTITY CASCADE;

-- ----- Справочники -----

INSERT INTO regions (id, name) VALUES
    (1, 'Москва'),
    (2, 'Санкт-Петербург'),
    (3, 'Республика Татарстан'),
    (4, 'Новосибирская область'),
    (5, 'Свердловская область'),
    (6, 'Нижегородская область');

INSERT INTO type_study (id, name) VALUES
    (1, 'Очная'),
    (2, 'Очно-заочная'),
    (3, 'Заочная');

INSERT INTO education_level (id, name) VALUES
    (1, 'Бакалавриат'),
    (2, 'Специалитет'),
    (3, 'Магистратура'),
    (4, 'Аспирантура');

INSERT INTO statement_statuses (id, name) VALUES
    (1, 'Черновик'),
    (2, 'Отправлено'),
    (3, 'На рассмотрении'),
    (4, 'Приглашение на экзамен'),
    (5, 'Зачислен'),
    (6, 'Отклонено'),
    (7, 'Отозвано');

INSERT INTO achievement_categories (id, name) VALUES
    (1, 'Олимпиады'),
    (2, 'Спорт'),
    (3, 'Волонтёрство'),
    (4, 'Академические успехи'),
    (5, 'Творческие конкурсы');

INSERT INTO exams (id, name) VALUES
    (1, 'Русский язык'),
    (2, 'Математика (профиль)'),
    (3, 'Информатика'),
    (4, 'Физика'),
    (5, 'Обществознание'),
    (6, 'История'),
    (7, 'Биология'),
    (8, 'Химия'),
    (9, 'Английский язык');

-- ----- Университеты -----

INSERT INTO universities (id, name, email, short_name, description, official_url, logo, id_region) VALUES
    (1, 'Московский государственный университет имени М.В. Ломоносова', 'priem@msu.ru', 'МГУ', 'Крупнейший классический университет России', 'https://msu.ru', 'https://msu.ru/logo.png', 1),
    (2, 'Национальный исследовательский университет ИТМО', 'priem@itmo.ru', 'ИТМО', 'Ведущий университет в области ИТ, фотоники и робототехники', 'https://itmo.ru', 'https://itmo.ru/logo.png', 2),
    (3, 'Казанский (Приволжский) федеральный университет', 'priem@kpfu.ru', 'КФУ', 'Один из старейших университетов России', 'https://kpfu.ru', 'https://kpfu.ru/logo.png', 3),
    (4, 'Новосибирский государственный университет', 'priem@nsu.ru', 'НГУ', 'Ведущий научно-образовательный центр Сибири', 'https://nsu.ru', 'https://nsu.ru/logo.png', 4),
    (5, 'Уральский федеральный университет имени Б.Н. Ельцина', 'priem@urfu.ru', 'УрФУ', 'Крупнейший вуз Урала', 'https://urfu.ru', 'https://urfu.ru/logo.png', 5);

-- ----- Пользователи -----

INSERT INTO users (id, first_name, last_name, patronymic, email, password_hash, passport, snils, education, id_region, created_at, updated_at) VALUES
    (1, 'Иван', 'Иванов', 'Иванович', 'ivan.ivanov@example.com', '$argon2id$v=19$m=65536,t=3,p=4$yVXSThbNA6ksrMst7H2uDQ$Mi/kADD/5QyCeEcAFWc3MuCvAd0jENsStAR/CfG1tMw', '4510 123456', '123-456-789 01', '11 классов', 1, '2026-09-01 10:00:00+00', '2026-09-01 10:00:00+00'),
    (2, 'Мария', 'Петрова', 'Александровна', 'maria.petrova@example.com', '$argon2id$v=19$m=65536,t=3,p=4$yVXSThbNA6ksrMst7H2uDQ$Mi/kADD/5QyCeEcAFWc3MuCvAd0jENsStAR/CfG1tMw', '4510 654321', '987-654-321 02', '11 классов', 2, '2026-09-01 10:05:00+00', '2026-09-01 10:05:00+00'),
    (3, 'Алексей', 'Смирнов', 'Сергеевич', 'alexey.smirnov@example.com', '$argon2id$v=19$m=65536,t=3,p=4$yVXSThbNA6ksrMst7H2uDQ$Mi/kADD/5QyCeEcAFWc3MuCvAd0jENsStAR/CfG1tMw', '4512 111222', '111-222-333 03', '11 классов', 4, '2026-09-01 10:10:00+00', '2026-09-01 10:10:00+00'),
    (4, 'Елена', 'Кузнецова', 'Дмитриевна', 'elena.kuznetsova@example.com', '$argon2id$v=19$m=65536,t=3,p=4$yVXSThbNA6ksrMst7H2uDQ$Mi/kADD/5QyCeEcAFWc3MuCvAd0jENsStAR/CfG1tMw', '4514 333444', '444-555-666 04', '11 классов', 3, '2026-09-01 10:15:00+00', '2026-09-01 10:15:00+00'),
    (5, 'Дмитрий', 'Соколов', 'Олегович', 'dmitry.sokolov@example.com', '$argon2id$v=19$m=65536,t=3,p=4$yVXSThbNA6ksrMst7H2uDQ$Mi/kADD/5QyCeEcAFWc3MuCvAd0jENsStAR/CfG1tMw', '4516 555666', '777-888-999 05', '11 классов', 5, '2026-09-01 10:20:00+00', '2026-09-01 10:20:00+00');

-- ----- Факультеты -----

INSERT INTO faculties (id, name, short_name, official_url, id_university) VALUES
    (1, 'Факультет вычислительной математики и кибернетики', 'ВМК МГУ', 'https://msu.ru/vmk', 1),
    (2, 'Экономический факультет', 'ЭФ МГУ', 'https://msu.ru/econ', 1),
    (3, 'Факультет информационных технологий и программирования', 'ФИТиП ИТМО', 'https://itmo.ru/fitip', 2),
    (4, 'Институт информационных технологий и интеллектуальных систем', 'ИТИС КФУ', 'https://kpfu.ru/itis', 3),
    (5, 'Факультет информационных технологий', 'ФИТ НГУ', 'https://nsu.ru/fit', 4),
    (6, 'Институт радиоэлектроники и информационных технологий', 'ИРИТ-РТФ УрФУ', 'https://urfu.ru/irit', 5);

-- ----- Программы обучения -----

INSERT INTO programs (id, name, code, description, official_url, duration_years, budget_places, paid_places, tuition_price, is_active, id_type_study, id_education_level, id_faculty) VALUES
    (1, 'Прикладная математика и информатика', '01.03.02', 'Фундаментальная подготовка в области математики и программирования', 'https://msu.ru/programs/01.03.02', 4, 250, 50, 380000.00, TRUE, 1, 1, 1),
    (2, 'Программная инженерия', '09.03.04', 'Разработка программного обеспечения и архитектура систем', 'https://itmo.ru/programs/09.03.04', 4, 200, 100, 350000.00, TRUE, 1, 1, 3),
    (3, 'Информационные системы и технологии', '09.03.02', 'Проектирование и сопровождение информационных систем', 'https://kpfu.ru/programs/09.03.02', 4, 150, 75, 220000.00, TRUE, 1, 1, 4),
    (4, 'Экономика', '38.03.01', 'Экономическая теория, финансы и анализ данных', 'https://msu.ru/programs/38.03.01', 4, 180, 120, 400000.00, TRUE, 1, 1, 2),
    (5, 'Информатика и вычислительная техника', '09.03.01', 'Системное программирование и вычислительные системы', 'https://nsu.ru/programs/09.03.01', 4, 120, 40, 210000.00, TRUE, 1, 1, 5),
    (6, 'Радиотехника', '11.03.01', 'Проектирование радиотехнических устройств и систем', 'https://urfu.ru/programs/11.03.01', 4, 100, 50, 190000.00, TRUE, 1, 1, 6),
    (7, 'Математика и компьютерные науки', '02.04.01', 'Магистерская программа по прикладной математике', 'https://msu.ru/programs/02.04.01', 2, 60, 20, 390000.00, TRUE, 1, 3, 1);

-- ----- Достижения -----

INSERT INTO achievement (id, name, id_user, id_category) VALUES
    (1, 'Призёр ВсОШ по информатике', 1, 1),
    (2, 'Золотой знак ГТО', 1, 2),
    (3, 'Победитель олимпиады «Высшая проба»', 2, 1),
    (4, 'Волонтёрство 150+ часов', 3, 3),
    (5, 'Золотая медаль', 4, 4),
    (6, 'Призёр регионального этапа ВсОШ по физике', 5, 1);

-- ----- Экзамены пользователей -----

INSERT INTO user_exam (id, id_user, id_exam, score_achieved) VALUES
    (1, 1, 1, 87),
    (2, 1, 2, 92),
    (3, 1, 3, 95),
    (4, 2, 1, 78),
    (5, 2, 2, 85),
    (6, 2, 5, 90),
    (7, 3, 1, 72),
    (8, 3, 2, 78),
    (9, 3, 3, 82),
    (10, 4, 1, 91),
    (11, 4, 2, 88),
    (12, 5, 1, 70),
    (13, 5, 2, 74),
    (14, 5, 4, 70);

-- ----- Необходимые экзамены программ -----

INSERT INTO program_exam (id, id_program, id_exam, passing_score) VALUES
    (1, 1, 2, 90),
    (2, 1, 3, 85),
    (3, 1, 1, 80),
    (4, 2, 2, 88),
    (5, 2, 3, 85),
    (6, 2, 1, 78),
    (7, 3, 2, 75),
    (8, 3, 3, 70),
    (9, 3, 1, 70),
    (10, 4, 2, 90),
    (11, 4, 5, 85),
    (12, 4, 1, 80),
    (13, 5, 2, 80),
    (14, 5, 3, 75),
    (15, 5, 1, 72),
    (16, 6, 2, 70),
    (17, 6, 4, 68),
    (18, 6, 1, 68);

-- ----- Заявления -----

INSERT INTO statement (id, id_user, id_program, id_status, created_at, updated_at) VALUES
    (1, 1, 1, 2, '2026-09-02 12:00:00+00', '2026-09-03 12:00:00+00'),
    (2, 1, 2, 3, '2026-09-02 12:05:00+00', '2026-09-03 12:05:00+00'),
    (3, 2, 3, 2, '2026-09-02 13:00:00+00', '2026-09-02 13:00:00+00'),
    (4, 3, 5, 4, '2026-09-02 14:00:00+00', '2026-09-05 14:00:00+00'),
    (5, 4, 4, 5, '2026-09-02 15:00:00+00', '2026-09-06 15:00:00+00'),
    (6, 5, 6, 1, '2026-09-02 16:00:00+00', '2026-09-02 16:00:00+00');

-- ----- Рекомендации -----

INSERT INTO recommendation_program_user (id, id_user, id_program, rank, explanation, created_at) VALUES
    (1, 1, 1, 75, 'Сумма баллов 274, проходной в 2025 — 290. Есть БВИ по олимпиаде по информатике.', '2026-09-02 11:00:00+00'),
    (2, 1, 2, 82, 'Сумма баллов 274, проходной 285. Баллы выше среднего, шансы высокие.', '2026-09-02 11:00:00+00'),
    (3, 2, 3, 90, 'Сумма баллов 253, проходной 235. Уверенное превышение порога.', '2026-09-02 11:05:00+00'),
    (4, 3, 5, 45, 'Сумма баллов 232, проходной 245. Есть шанс за счёт волонтёрства.', '2026-09-02 11:10:00+00'),
    (5, 4, 4, 88, 'Сумма баллов 273, проходной 265. Золотая медаль даёт дополнительные баллы.', '2026-09-02 11:15:00+00'),
    (6, 5, 6, 50, 'Сумма баллов 214, проходной 215. Пограничная ситуация.', '2026-09-02 11:20:00+00'),
    (7, 5, 5, 30, 'Сумма баллов 214, проходной 227. Ниже порога, но есть достижения.', '2026-09-02 11:20:00+00');

-- ----- Избранные программы -----

INSERT INTO user_programs (id, id_user, id_program, created_at) VALUES
    (1, 1, 2, '2026-09-01 12:00:00+00'),
    (2, 2, 4, '2026-09-01 13:00:00+00'),
    (3, 3, 1, '2026-09-01 14:00:00+00');

-- ----- Сравнения -----

INSERT INTO comparisons (id, id_user, id_program_1, id_program_2, selected_program_id, explanation, created_at) VALUES
    (1, 1, 1, 2, 2, 'ПМИ МГУ: выше проходной, но больше бюджетных мест. ПИ ИТМО: ниже стоимость и выше шанс поступить. Для Ивана выгоднее ИТМО по совокупности факторов.', '2026-09-03 10:00:00+00');

-- ----- Синхронизация sequence после вставки с явными id -----

DO $$
DECLARE
    seq_name text;
BEGIN
    FOREACH seq_name IN ARRAY ARRAY[
        'achievement_id_seq', 'achievement_categories_id_seq', 'comparisons_id_seq',
        'education_level_id_seq', 'exams_id_seq', 'faculties_id_seq', 'program_exam_id_seq',
        'programs_id_seq', 'recommendation_program_user_id_seq', 'regions_id_seq',
        'statement_id_seq', 'statement_statuses_id_seq', 'type_study_id_seq',
        'user_exam_id_seq', 'user_programs_id_seq', 'universities_id_seq', 'users_id_seq'
    ] LOOP
        EXECUTE format(
            'SELECT setval(%L, (SELECT MAX(id) FROM %I))',
            seq_name,
            replace(seq_name, '_id_seq', '')
        );
    END LOOP;
END $$;

COMMIT;