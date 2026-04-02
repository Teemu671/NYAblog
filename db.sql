--drop database if exists NYAdb;

create database NYAdb;

use NYAdb;

create table "users" (
    "user_id" serial primary key,
    "email" varchar(100) unique not null,
    "display_name", varchar(26) not null,
    "username" varchar(26) unique not null,
    "password" varchar(255) not null,
    "role" varchar(16) not null,
    "created_at" timestamp not null default NOW(),
)

create table "posts" (
    "post_id" serial primary key,
    "parent_id" int,
    "author_id" int,
    "text" varchar(255) not null,
    "tag" varchar(16),
    "created_at" timestamp not null default NOW(),
    "updated_at" timestamp not null default NOW(),
    CONSTRAINT fk_users FOREIGN KEY (author_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
    CONSTRAINT fk_post FOREIGN KEY (parent_id)
    REFERENCES posts(post_id)
    ON DELETE CASCADE
);


insert into posts (parent_id,author_id) 