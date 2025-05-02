require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoutes = require("./APIs/userRoutes");
const foodRoutes = require("./APIs/foodRoutes");
const recipeRoutes = require("./APIs/recipeRoutes");
const mealPlanRoutes = require("./APIs/mealPlanRoutes");
const nutritionalRequirementRoutes = require("./APIs/nutritionalRequirementsRoutes");
const userMealRoutes = require("./APIs/userMealroutes");


const app = express();

const corsOptions = {
  origin: ["http://localhost:3000","http://localhost:3001"] ,// ✅ Allow frontend access
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // ✅ Allow cookies/auth headers
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));


// Middleware

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/Foods",foodRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use('/api/user/meals', userMealRoutes);
app.use("/api/nutritional-requirements", nutritionalRequirementRoutes);


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
