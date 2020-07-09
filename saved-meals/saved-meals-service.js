const SavedMealsService = {
    getAllSavedMeals(db, user){
        return db.from('saved_meal_plans AS plans')
        .select('*')
        .where('plans.user_id', user)
        .rightJoin('saved_meals', 'saved_meals.mealplan', 'plans.mealplan_id')
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
        .select('user_id', 'mealplan_id', 'meal_id', 'mealplan_name', 
        'label', 'meal_url', 'meal_image', 
        'healthlabels', 'dietlabels')
        .where('saved_meal_plans.user_id', user)
        .andWhere('saved_meal_plans.mealplan_id', id)
        .innerJoin('saved_meals', function() {
            this.on('saved_meal_plans.mealplan_id', '=', 'saved_meals.mealplan') })
        // .rightOuterJoin('saved_meals AS saved', 'plans.mealplan_id', 'saved.mealplan')
    },
    deleteMealPlan(db, id, user){
        return db.from('saved_meal_plans AS plans')
        .select('*')
        .where('plans.user_id', user)
        .andWhere('plans.mealplan_id', id)
        .del()
    },
    saveNewMealPlan(db, savedMealPlan, meals){
            // async knex transaction to insert savedMealPlan and then all of the meals into saved_meals
            let savedMeals = meals;
            // console.log(savedMeals)
            return db.transaction(trx => {
                // insert savedMealPlan which includes name and user id
                return trx
                .insert(savedMealPlan)
                .into('saved_meal_plans')
                .returning('*')
                .then((plan) => {
                    console.log(plan)
                    const id = plan[0].mealplan_id
                 savedMeals.map(meal => {
                        meal.mealplan = id
                        console.log(meal);
                        return trx('saved_meals').insert(meal);
                    })
                })
                .then(meals => console.log(meals))
                .catch(err => console.log(err))
            })
    }
}

module.exports = SavedMealsService;
