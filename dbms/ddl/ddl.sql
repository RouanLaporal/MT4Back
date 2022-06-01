
/* user */
create table if not exists user (
  userId int auto_increment not null,
  email varchar(256) unique not null, 
  firstName varchar(256), 
  lastName varchar(256),
  roleId varchar(256) not null,
  primary key(userId),
  foreign key(roleId) references role(roleId)
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
  sshUserName varchar(256) not null,
  sshIpAdress varchar(256) not null,
  primary key(sshId)
);

/* challenge_user */
create table if not exists challenge_user (
  challengeId int,
  userId int,
  promoId int,
  scoreId int,
  foreign key(challengeId) references challenge(challengeId),
  foreign key(userId) references user(userId),
  foreign key promoId references promo(promoId),
  foreign key(scoreId) references score(scoreId)
);