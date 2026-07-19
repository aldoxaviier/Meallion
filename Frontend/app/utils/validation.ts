import * as Yup from "yup";

const profileSchema = Yup.object({
    height: Yup.number().required("Height required").min(50, "Min 50 cm").max(300, "Max 300 cm"),
    weight: Yup.number().required("Weight required").min(20, "Min 20 kg").max(500, "Max 500 kg"),
    activity: Yup.number().required("Activity level required").min(1, "Select activity level").max(2, "Select activity level"),
    goal: Yup.string().required("Goal required").oneOf(['Lose weight', 'Maintain weight', 'Gain weight'], "Select a valid goal"),
    gender: Yup.string().required("Gender required").oneOf(['Male', 'Female'], "Select a valid gender"),
});

const recipeSchema = Yup.object({
    name: Yup.string().required("Recipe name is required").min(3, "Recipe name must be at least 3 characters"),
    cookTime: Yup.number().required("Cook time is required").min(1, "Cook time must be at least 1 minute").max(1440, "Cook time cannot exceed 24 hours"),
    serving: Yup.number().required("Serving size is required").min(1, "Serving size must be at least 1").max(20, "Serving size cannot exceed 20"),
    prepTime: Yup.number().required("Prep time is required").min(1, "Prep time must be at least 1 minute").max(1440, "Prep time cannot exceed 24 hours"),
    description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
    image: Yup.object({
        uri: Yup.string().required("Image is required"),
        name: Yup.string().required("Image name is required"),
        type: Yup.string().required("Image type is required"),
    }).required("Image is required"),
});

const editProfileSchema = Yup.object({
    name: Yup.string().required().min(3, "Profile name must be at least 3 characters"),
    weight: Yup.number().required().min(1, "Weight must be at least 1").max(500, "Weight cannot exceed 500"),
    height: Yup.number().required().min(1, "Height must be at least 1").max(300, "Height cannot exceed 300"),
});

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/, { message: "Email must contain '@' and end with '.com'", excludeEmptyString: true }),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

export { profileSchema, recipeSchema, registerSchema, editProfileSchema };