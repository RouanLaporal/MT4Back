
/* user */
create table if not exists user (
  userId int auto_increment not null primary key,
  email varchar(256) unique not null, 
  firstName varchar(256), 
  lastName varchar(256),
  roleId int not null,
  avatar varchar(256),
  password varchar(256),
  constraint `fk_role_user`
    foreign key(roleId) references role(roleId) on delete cascade on update cascade
);


drop trigger if exists before_insert_user;

create trigger before_insert_user
before insert
on user for each row set new.email = lower(trim(new.email));


/* challenge */
create table if not exists challenge (
  challengeId int auto_increment not null,
  name varchar(256) not null, 
  status varchar(256) not null,
  primary key(challengeId)
);

/* role */
create table if not exists role (
  roleId int auto_increment not null,
  name varchar(256) not null,
  primary key(roleId)
);

/* score */
create table if not exists score (
  scoreId int auto_increment not null,
  nbScore int default 0,
  primary key(scoreId)
);

/* promo */
create table if not exists promo (
  promoId int auto_increment not null,
  name varchar(256) not null,
  primary key(promoId)
);

/* ssh */
create table if not exists ssh (
  sshId int auto_increment not null,
  UserName varchar(256) not null,
  IpAddress varchar(256) not null,
  primary key(sshId)
);

/* challenge_user */
create table if not exists challenge_user (
  challengeId int,
  userId int,
  promoId int,
  scoreId int,
  foreign key(challengeId) references challenge(challengeId) on delete cascade on update cascade,
  foreign key(userId) references user(userId) on delete cascade on update cascade,
  foreign key(promoId) references promo(promoId) on delete cascade on update cascade,
  foreign key(scoreId) references score(scoreId) on delete cascade on update cascade
);