/* ROLES */
create table if not exists ROLES (
  role_id int auto_increment not null primary key,
  role varchar(255)
);

/* USERS */
create table if not exists USERS (
  user_id int auto_increment not null primary key,
  email varchar(256) unique not null,
  firtname varchar(256),
  lastname varchar(256),
  password varchar(256),
  avatar varchar(256),
  isValid boolean default false,
  role_id int,
  foreign key(role_id) references ROLES(role_id) on delete cascade on update cascade
);

/* VALIDATIONS */
create table if not exists VALIDATIONS (
  validation_id int auto_increment not null primary key,
  code int,
  user_id int,
  foreign key(user_id) references USERS(user_id) on delete cascade on update cascade
);

/* PROMOS */
create table if not exists PROMOS (
  promo_id int auto_increment not null primary key,
  promo varchar(256),
  user_id int,
  foreign key(user_id) references USERS(user_id) on delete cascade on update cascade
);

/* CHALLENGES */
create table if not exists CHALLENGES (
  challenge_id int auto_increment not null primary key,
  challenge varchar(256),
  isActive boolean default true
);

/* PARTICIPATONS */
create table if not exists PARTICIPATONS (
  user_id int,
  challenge_id int,
  promo_id int,
  score int,
  foreign key(user_id) references USERS(user_id) on delete cascade on update cascade,
  foreign key(challenge_id) references CHALLENGES(challenge_id) on delete cascade on update cascade,
  foreign key(promo_id) references PROMOS(promo_id) on delete cascade on update cascade,
);
