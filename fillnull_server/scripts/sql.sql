create table article (article_id int not null auto_increment, category varchar(500) not null, title varchar(500) not null, filename varchar(500) not null, created date, status varchar(20), user varchar(50), primary key (article_id))

create table attachments (attachment_id int not null auto_increment, user varchar(50) not null, filename varchar(500) not null, uploaded date, status varchar(20), filetype varchar(20), primary key (attachment_id))


