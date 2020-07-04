CREATE TABLE users (
    id SERIAL PRIMARY KEY ,
    username TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL

);