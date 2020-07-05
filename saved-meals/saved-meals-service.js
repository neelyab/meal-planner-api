const SavedMealsService = {
    getAllSavedMeals(db, user){
        return db.from('saved_meal_plans AS plans')
        .select('*')
        .where('plans.user_id', user)
        .innerJoin('saved_meals', 'saved_meals.mealplan_id', 'plans.mealplan_id')
    },
    getMealPlanById(db, id, user){
        return db.from('saved_meal_plans AS plans')
        .select('*')
        .where('user_id', user)
        .andWhere('mealplan_id', id)
        .first()
    },
    getMealPlanDetails(db, id, user){
        return db.from('saved_meal_plans')
        .select('*')
        .where('user_id', user)
        .andWhere('mealplan_id', id)
        .innerJoin('saved_meals AS meals', 'meals.mealplan_id', 'plans.mealplan_id')
    }
}

module.exports = SavedMealsService;