/* ROLES */
create table if not exists ROLE (
  role_id int auto_increment not null primary key,
  role varchar(255)
);

/* USERS */
create table if not exists USER (
  user_id int auto_increment not null primary key,
  email varchar(256) unique not null,
  first_name varchar(256),
  last_name varchar(256),
  password varchar(256),
  avatar varchar(256),
  is_valid boolean default false,
  role_id int,
  foreign key(role_id) references ROLE(role_id) on delete cascade on update cascade
);

/* VALIDATIONS */
create table if not exists VALIDATION (
  validation_id int auto_increment not null primary key,
  code int,
  user_id int,
  foreign key(user_id) references USER(user_id) on delete cascade on update cascade
);

/* PROMOS */
create table if not exists PROMO (
  promo_id int auto_increment not null primary key,
  promo varchar(256),
  user_id int,
  foreign key(user_id) references USER(user_id) on delete cascade on update cascade
);

/* CHALLENGES */
create table if not exists CHALLENGE (
  challenge_id int auto_increment not null primary key,
  challenge varchar(256),
  is_active boolean default true
);

/* PARTICIPATONS */
create table if not exists PARTICIPATON (
  user_id int,
  challenge_id int,
  promo_id int,
  score int default 0,
  foreign key(user_id) references USER(user_id) on delete cascade on update cascade,
  foreign key(challenge_id) references CHALLENGE(challenge_id) on delete cascade on update cascade,
  foreign key(promo_id) references PROMO(promo_id) on delete cascade on update cascade
);


/* INITIALISATION DE LA TABLE ROLE */
insert into role (role_id, role) values (1, 'pofessor'), (2, 'student');