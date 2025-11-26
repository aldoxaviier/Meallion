import { createContext, useState, useContext } from "react";
import { RegisterContext } from "./registerContext";

interface profileData {
  height?: number;
  weight?: number;
  activity?: number;
  goal?: string;
  dietaryRequirements?: string[];
  dislikes?: string[];
}

interface ProfileContextType {
  profileData: profileData;
  setProfileData: React.Dispatch<React.SetStateAction<profileData>>;
  resetProfileData: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileData, setProfileData] = useState<profileData>({
    height: 0,
    weight: 0,
    activity: 0,
    goal: "",
    dietaryRequirements: [],
    dislikes: [],
  });

  const resetProfileData = () => setProfileData({ height: 0, weight: 0, activity: 0, goal: "", dietaryRequirements: [], dislikes: [] });
  return (
    <ProfileContext.Provider value={{ profileData, setProfileData, resetProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export {ProfileContext}
export default ProfileProvider;