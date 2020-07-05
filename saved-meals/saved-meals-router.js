const express = require('express')
const SavedMealsService = require('./saved-meals-service')
const requireAuth = require('../middleware/jwt-auth')

savedMealsRouter = express.Router()
jsonBodyParser = express.json()


savedMealsRouter
.route('/')
.all(requireAuth)
.get((req, res) => {
    const user = req.user.id
    return SavedMealsService.getAllSavedMeals(req.app.get('db'), user)
    .then(meal => {
        return res.status(200).json(meal)
    })
})

savedMealsRouter
.route('/:mealId')
.all(requireAuth)
.get(checkIfExists, (req, res) => {
  const mealId = req.mealId
  const user = req.user
  return SavedMealsService.getMealPlanDetails(req.app.get('db'), mealId, user)
  .then(mealPlan => {
    return res.status(200).json(mealPlan)
  })
})
.delete(checkIfExists, (req, res) => {
    const mealId = req.mealId
    const user = req.user
    return SavedMealsService.deleteMealPlan(req.app.get('db'), mealId, user)
    .then(() => {
        return res.status(200).send(`Plan ${mealId} deleted`)
    })

})
async function checkIfExists(req, res, next) {
    try {
    const user = req.user.id
    const mealId = req.params.mealId
    console.log(mealId)
    const mealPlan = await SavedMealsService.getMealPlanById(req.app.get('db'), mealId, user)
    if(!mealPlan){
        return res.status(404).json({error: 'Meal plan not found'})
    }
    req.user = user
    req.mealId = mealId
    next()
    }
    catch(error) {
        next(error)
    }


}
module.exports = savedMealsRouter;