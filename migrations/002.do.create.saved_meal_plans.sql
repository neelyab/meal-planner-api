CREATE TABLE saved_meal_plans (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mealplan_id SERIAL PRIMARY KEY,
    mealplan_name TEXT NOT NULL 
);