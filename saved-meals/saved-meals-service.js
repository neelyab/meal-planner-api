const SavedMealsService = {
    getAllSavedMeals(db, user){
        return db.from('saved_meal_plans AS plans')
        .select('*')
        .where('plans.user_id', user)
        .innerJoin('saved_meals', 'saved_meals.mealplan_id', 'plans.mealplan_id')
    }
}

module.exports = SavedMealsService;