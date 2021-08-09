-- users data
create table users(
    id serial,
    email varchar(50) not null,
    password varchar(100) not null,
    -- primary key
    primary key(id),
    -- unique
    unique(email)
);

-- dictionaries (user CAN'T define them)
create table classes(
    id serial,
    name varchar(20) not null,
    -- primary key
    primary key(id),
    -- unique
    unique(name)
);

create table types(
    id serial,
    name varchar(20) not null,
    color varchar(7) default '#000000' not null,
    -- set primary key
    primary key(id),
    -- unique
    unique(name)
);

-- dictionaries (user CAN define them)
create table teachers(
    id serial,
    user_id integer not null,
    name varchar(20) not null,
    surname varchar(20) not null,
    color varchar(7) default '#ffffff' not null,
    -- set primary key
    primary key(id),
    -- unique
    unique (user_id, name, surname),
    -- references
    foreign key (user_id) references users(id)
);

create table rooms(
    id serial,
    user_id integer not null,
    name varchar(20) not null,
    -- set primary key
    primary key(id),
    -- unique
    unique (user_id, name),
    -- references
    foreign key (user_id) references users(id)
);

-- plans
create table plans(
    id serial,
    user_id integer not null,
    name varchar(20) not null,
    weeks_numb integer not null,
    blocks_numb integer not null,
    -- set primary key
    primary key(id),
    -- unique
    unique (user_id, name),
    -- checks
    check (weeks_numb > 0 and weeks_numb < 4),
    check (blocks_numb > 0 and blocks_numb < 10),
    -- references
    foreign key (user_id) references users(id)
);

create table plan_configs(
    id serial,
    user_id integer not null,
    plan_id integer not null,
    config json not null,
    -- set primary key
    primary key(id),
    -- references
    foreign key (user_id) references users(id),
    foreign key (plan_id) references plans(id) on delete cascade
);

-- children
create table groups(
    id serial,
    user_id integer not null,
    name varchar(20) not null,
    color varchar(7) default '#ffffff' not null,
    -- set primary key
    primary key(id),
    -- unique
    unique (user_id, name),
    -- references
    foreign key (user_id) references users(id)
);

create table children(
    id serial,
    user_id integer not null,
    group_id integer not null,
    name varchar(20) not null,
    surname varchar(20) not null,
    -- set primary key
    primary key(id),
    -- unique
    unique(user_id, name, surname),
    -- references
    foreign key (user_id) references users(id),
    foreign key (group_id) references groups(id) on delete cascade
);

-- planned tiles
create table activities(
    id serial,
    user_id integer not null,
    plan_id integer not null,
    class_id integer not null,
    type_id integer not null,
    teacher_id integer not null,
    room_id integer not null,
    week_index integer not null,
    day_index integer not null,
    block_index integer not null,
    -- set primary key
    primary key(id),
    -- checks
    check (week_index >= 0),
    check (day_index >= 0),
    check (block_index >= 0),
    -- references
    foreign key (user_id) references users(id),
    foreign key (plan_id) references plans(id) on delete cascade,
    foreign key (class_id) references classes(id) on delete cascade,
    foreign key (type_id) references types(id) on delete cascade,
    foreign key (teacher_id) references teachers(id) on delete cascade,
    foreign key (room_id) references rooms(id) on delete cascade
);

-- intersections (many to many relation)
create table assignments_t(
    id serial,
    class_id integer not null,
    teacher_id integer not null,
    -- set primary key
    primary key(id),
    -- references
    foreign key (class_id) references classes(id) on delete cascade,
    foreign key (teacher_id) references teachers(id) on delete cascade
);

create table assignments_c(
    id serial,
    activity_id integer not null,
    child_id integer not null,
    -- set primary key
    primary key(id),
    -- references
    foreign key (activity_id) references activities(id) on delete cascade,
    foreign key (child_id) references children(id) on delete cascade
);

-- initialize dict
insert into classes (name) values 
    ('Terapia indywidualna'),
    ('Logopedia'),
    ('Terapia sensoryczna');

insert into types (name, color) values
    ('Pakiet', '#000000'),
    ('WWR', '#e32214'),
    ('Płatne', '#1255db');