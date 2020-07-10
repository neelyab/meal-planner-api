module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN:  'https://meal-planner-app-eight.vercel.app/',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://amanda:amanda@localhost/meal_planner',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://amanda:amanda@localhost/meal_planner_test",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY
  }