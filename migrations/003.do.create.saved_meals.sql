CREATE TABLE saved_meals (
    mealplan INTEGER REFERENCES saved_meal_plans(mealplan_id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    meal_id SERIAL PRIMARY KEY,
    meal_url TEXT NOT NULL,
    meal_image TEXT NOT NULL,
    dietlabels TEXT ,
    healthlabels TEXT
);
