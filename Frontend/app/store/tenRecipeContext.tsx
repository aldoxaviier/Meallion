import { createContext, useState } from "react";

interface TenRecipe {
    recipe_id?: number;
    name?: string;
    AuthorName?: string;
    rating_score?: number;
    TotalTime?: string;
    Images?: string;
    author_name?: string;
    tags?: string;
}

interface TenRecipeType {
    TenRecipe: any[];
    setTenRecipe: React.Dispatch<React.SetStateAction<any[]>>;
}

const TenRecipeContext = createContext<TenRecipeType | undefined>(undefined)

const TenRecipeProvider = ({ children } : { children: React.ReactNode }) => {
    const [TenRecipe, setTenRecipe] = useState<any[]>([])
    return(
        <TenRecipeContext.Provider value={{ TenRecipe, setTenRecipe}}>
            {children}
        </TenRecipeContext.Provider>
    )
}

export {TenRecipeContext}
export default TenRecipeProvider

