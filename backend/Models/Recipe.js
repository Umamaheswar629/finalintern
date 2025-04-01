// models/Recipe.js
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  calories: {
    type: Number,
    default: 0
  },
  cookingTime: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  dietType: [{
    type: String
  }],
  ingredients: [{
    name: String,
    quantity: String
  }],
  instructions: [{
    type: String
  }],
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  nutritionalInfo: {
    protein: Number,
    carbs: Number,
    fat: Number
  }
}, { 
  timestamps: true 
});


RecipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Recipe", RecipeSchema);
