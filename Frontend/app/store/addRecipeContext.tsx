import { createContext, useState, useContext } from "react";
import { RegisterContext } from "./registerContext";

interface image{
    uri: string;
    name: string;
    type: string;
}

type Ingredient = {
    id: number;
    ingredientId: string;
    simplified_name: string;
    original_name: string;
    calories: number;
    protein: number;
    carbohydrate: number;
    fiber: number;
    sodium: number;
    sugar: number;
    fdcId: number;
    cholesterol: number;
    fat: number;
    unit: string[];
    calories_per_unit: number[];
    qty: string;
};

interface step{
    description: string;
}

interface recipeData {
  name?: string;
  cookTime?: number;
  prepTime?: number;
  description?: string;
  image?: image;
  ingredients?: Ingredient[];
  tags?: string[];
  steps?: step[];
}

interface RecipeContextType {
  recipeData: recipeData;
  setRecipeData: React.Dispatch<React.SetStateAction<recipeData>>;
  resetRecipeData: () => void;
}

const RecipeContext = createContext<RecipeContextType | null>(null);

const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipeData, setRecipeData] = useState<recipeData>({
    name: "",
    cookTime: 0,
    prepTime: 0,
    description: "",
    image: undefined,
    ingredients: [],
    steps: [],
    tags: [],
  });

  const resetRecipeData = () => setRecipeData({ name: "", cookTime: 0, prepTime: 0, description: "", image: undefined, ingredients: [], steps: [], tags: []  });
  return (
    <RecipeContext.Provider value={{ recipeData, setRecipeData, resetRecipeData }}>
      {children}
    </RecipeContext.Provider>
  );
};

export {RecipeContext}
export default RecipeProvider;