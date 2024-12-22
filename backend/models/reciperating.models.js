const mongoose = require('mongoose');   



const ratingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    recipeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe'
    },
    rating:{
        type: Number,
        required: true
    },
    comment:{
        type: String,
        default: ''
    }
}, {timestamps: true});

const RecipeRating = mongoose.model('recipe-rating', ratingSchema);

module.exports = RecipeRating;
