const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 3
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    summary:{
        type: String,
        required: true,
       
    },
    description:{
        type: String,
        required: true,
     
    },
    image:{
        type: String,
        default: ''
    },
    imageId:{
        type: String,
        default: ''
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    type:{
        type: String,
        required: true
    },
    ingredients:[{
        type: String,
        // required: true
    }],
    method:[{
        type: String,
        // required: true
    }],
    categories:[{
        type: String,
        // required: true
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    likeCounts:{
        type:Number,
        default: 0
    },
    saved:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    views:{
        type: Number,
        default: 0
    },
    ratings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe-rating'
    }],
    

}, {timestamps: true});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;