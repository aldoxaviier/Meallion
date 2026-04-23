import { createContext, useContext, useState, ReactNode } from "react"

interface UserInfo {
  name: string
  email: string
}

interface ProfileData {
  user_id: string
  height: number
  weight: number
  activity_level: number | null
  bio: string
  goal_plan: string
  allergies: string[]
  diet_preferences: string[]
  updated_at: string
  target_calories: number | null
  target_proteins: number | null
  target_carbs: number | null
  target_fats: number | null
  profile_image: string | null
  cloudinary_id: string | null
  followers: number
  followings: number
  recipes_count: number
  breakfast_time: string | null
  lunch_time: string | null
  snack_time: string | null
  dinner_time: string | null
  users: UserInfo
}

interface ProfileDataContextType {
  profileData: ProfileData | null
  setProfileData: (data: ProfileData) => void
  updateProfile: (partial: Partial<ProfileData>) => void
  resetProfileData: () => void
}

const ProfileDataContext = createContext<ProfileDataContextType | undefined>(undefined)

const ProfileDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileData, setProfileDataState] = useState<ProfileData | null>(null)

  const setProfileData = (data: ProfileData) => {
    setProfileDataState(data)
  }

  const updateProfile = (partial: Partial<ProfileData>) => {
    setProfileDataState(prev =>
      prev ? { ...prev, ...partial } : prev
    )
  }

  const resetProfileData = () => setProfileDataState(null)

  return (
    <ProfileDataContext.Provider
      value={{ profileData, setProfileData, updateProfile, resetProfileData }}
    >
      {children}
    </ProfileDataContext.Provider>
  )
}

export {ProfileDataContext}
export default ProfileDataProvider