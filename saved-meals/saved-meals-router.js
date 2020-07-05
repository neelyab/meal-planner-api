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


module.exports = savedMealsRouter;