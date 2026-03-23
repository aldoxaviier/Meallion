import { createContext, useContext, useRef } from "react";
import { Animated } from "react-native";

const ScrollContext = createContext<{ scrollY: Animated.Value } | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  return (
    <ScrollContext.Provider value={{ scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);