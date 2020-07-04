CREATE TABLE saved_meal_plans (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mealplan_id SERIAL PRIMARY KEY UNIQUE,
    mealplan_name TEXT NOT NULL 
);