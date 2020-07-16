use employeesdb;
INSERT INTO department
    (department_name )
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');
INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Sales Lead', 94000, 1),
    ('Salesperson', 75000, 1),
    ('Lead Engineer', 160000, 2),
    ('Software Engineer', 110000, 2),
    ('Account Manager', 170000, 3),
    ('Accountant', 145000, 3),
    ('Legal Team Lead', 277000, 4),
    ('Lawyer', 200000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Carlos', 'Garcia', 1, NULL),
    ('Kyle', 'Richter', 2, 1),
    ('Barbera', 'Metz', 3, NULL),
    ('Cody', 'Pastra', 4, 3),
    ('Diego', 'Bonavilla', 5, NULL),
    ('Madelaine', 'Smith', 6, 5),
    ('Laura', 'Zanthros', 7, NULL),
    ('Vivian', 'Nazgossi', 8, 7);