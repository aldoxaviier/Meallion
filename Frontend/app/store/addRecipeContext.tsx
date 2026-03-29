import { createContext, useState, useContext } from "react";
import { RegisterContext } from "./registerContext";

interface image{
    uri: string;
    name: string;
    type: string;
}

interface recipeData {
  name?: string;
  cookTime?: number;
  prepTime?: number;
  description?: string;
  image?: image;
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
  });

  const resetRecipeData = () => setRecipeData({ name: "", cookTime: 0, prepTime: 0, description: "", image: undefined });
  return (
    <RecipeContext.Provider value={{ recipeData, setRecipeData, resetRecipeData }}>
      {children}
    </RecipeContext.Provider>
  );
};

export {RecipeContext}
export default RecipeProvider;