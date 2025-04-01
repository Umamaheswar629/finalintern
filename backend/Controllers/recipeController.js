// controllers/recipeController.js
const Recipe = require('../Models/Recipe');

// // Create a new recipe
// exports.createRecipe = async (req, res) => {
//   try {
//     const recipe = new Recipe({
//       ...req.body,
//       createdBy: req.user._id  // Assuming you have authentication middleware
//     });
//     await recipe.save();
//     res.status(201).json(recipe);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Get all recipes with filtering and pagination

exports.getAllRecipes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      dietType, 
      tags 
    } = req.query;

    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by diet preferences
    if (dietType) {
      query.dietType = dietType;
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const recipes = await Recipe.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single recipe by ID
exports.getRecipeById = async (req, res) => {
  try {

    const id = req.params.id.startsWith(':') 
      ? req.params.id.slice(1) 
      : req.params.id;
    console.log("Cleaned Recipe ID:", id); // Debugging log
      
      // Validate ID format (assuming MongoDB ObjectId)
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          message: 'Invalid recipe ID format',
          receivedId: id 
        });
      }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ 
        message: 'Recipe not found', 
        searchedId: id 
      });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ 
      message: error.message,
      stack: error.stack 
    });
  }
};
// // Update a recipe
// exports.updateRecipe = async (req, res) => {
//   try {
//     const recipe = await Recipe.findByIdAndUpdate(
//       req.params.id, 
//       req.body, 
//       { new: true, runValidators: true }
//     );
    
//     if (!recipe) {
//       return res.status(404).json({ message: 'Recipe not found' });
//     }
    
//     res.json(recipe);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a recipe
// exports.deleteRecipe = async (req, res) => {
//   try {
//     const recipe = await Recipe.findByIdAndDelete(req.params.id);
    
//     if (!recipe) {
//       return res.status(404).json({ message: 'Recipe not found' });
//     }
    
//     res.json({ message: 'Recipe deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Toggle Favorite Recipe

exports.toggleFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const userId = req.user._id;  // Assuming authentication middleware
    const isFavorited = recipe.favorites.includes(userId);

    if (isFavorited) {
      // Remove from favorites
      recipe.favorites = recipe.favorites.filter(
        favoriteId => favoriteId.toString() !== userId.toString()
      );
    } else {
      // Add to favorites
      recipe.favorites.push(userId);
    }

    await recipe.save();

    res.json({
      recipe,
      isFavorited: !isFavorited
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User's Favorite Recipes
exports.getUserFavoriteRecipes = async (req, res) => {
  try {
    const favoriteRecipes = await Recipe.find({ 
      favorites: req.user._id 
    });

    res.json(favoriteRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/recipeController.js
exports.searchRecipes = async (req, res) => {
  try {
    const { 
      search = '', 
      page = 1, 
      limit = 10, 
      dietType, 
      tags,
      minCalories,
      maxCalories,
      cookingTime
    } = req.query;

    // Build a complex search query
    const query = {};

    // Comprehensive text search across multiple fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by diet preferences
    if (dietType) {
      query.dietType = dietType;
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    // Perform the search with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 } // Most recent first
    };

    const result = await Recipe.paginate(query, options);

    res.json({
      recipes: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      totalRecipes: result.total
    });
  } catch (error) {
    console.error('Detailed Search Recipes Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      query: req.query
    });
    res.status(500).json({ 
      message: 'Error searching recipes', 
      error: error.message,
      details: error.stack
    });
  }
};