const Treeize = require('treeize')

const SavedMealsService = {
    getAllSavedMeals(db, user){
        return db.from('saved_meal_plans AS plans')
        .select(
           'plans.user_id',
           'plans.mealplan_id',
           'plans.mealplan_name',
           'saved.meal_id',
           'saved.label',
           'saved.meal_url',
           'saved.meal_image',
           'saved.dietlabels',
           'saved.healthlabels'
            )
        .where('plans.user_id', user)
        .leftJoin('saved_meals AS saved', 'plans.mealplan_id', 'saved.mealplan')

    },
   getSavedMealIds(db, user){
       return db.from('saved_meal_plans')
       .select('mealplan_id')
       .where('user_id', user)
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
    },
    deleteMealPlan(db, id, user){
        return db.from('saved_meal_plans AS plans')
        .select('*')
        .where('plans.user_id', user)
        .andWhere('plans.mealplan_id', id)
        .del()
    },
    saveNewMealPlan(db, savedMealPlan, meals){
            let savedMeals = meals;
            return db.insert(savedMealPlan)
            .into('saved_meal_plans')
            .returning('*')
            .then(([plan]) => {
                const id = plan.mealplan_id
                    savedMeals.map(meal => {
                        meal.mealplan = id
                    })
                    return savedMeals;
            })
            .then(savedMeals => SavedMealsService.saveMeals(db,savedMeals))
            
    },
    saveMeals(db, savedMeals){
            return db('saved_meals').insert(savedMeals).returning('*')
    }
}

module.exports = SavedMealsService;
