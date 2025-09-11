CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_profiles (
  user_id           BIGINT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  birthdate         DATE
  height_cm         NUMERIC(5,2),
  weight_kg         NUMERIC(5,2),
  activity_level    TEXT,                 
  goal_plan         TEXT,                     
  allergies         TEXT[] DEFAULT '{}',      
  diet_preferences  TEXT[] DEFAULT '{}',      
  favorite_cuisines TEXT[] DEFAULT '{}',
);

CREATE TABLE recipe_bookmarks (
  bookmark_id BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  recipe_id   BIGINT NOT NULL REFERENCES recipes(recipe_id) ON DELETE CASCADE,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, recipe_id)             
);
