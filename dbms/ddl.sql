
/* user */
create table if not exists user (
  userId int auto_increment not null,
  email varchar(256) unique not null, 
  familyName varchar(256), 
  givenName varchar(256), 
  primary key(userId)
);


drop trigger if exists before_insert_user;

create trigger before_insert_user
before insert
on user for each row set new.email = lower(trim(new.email));


/* exemple */


create table if not exists film (
  filmId int auto_increment not null,
  title varchar(256) not null, 
  duration int default 0,
  rentalRate decimal(6,2) not null default 0 check (rentalRate >= 0),
  primary key(filmId)
);