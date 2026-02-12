import * as Yup from "yup";

const profileSchema = Yup.object({
    height: Yup.number().required("Height required").min(50, "Min 50 cm").max(300, "Max 300 cm"),
    weight: Yup.number().required("Weight required").min(20, "Min 20 kg").max(500, "Max 500 kg"),
    activity: Yup.number().required("Activity level required").min(1, "Select activity level").max(2, "Select activity level"),
    goal: Yup.string().required("Goal required").oneOf(['Lose weight', 'Maintain weight', 'Gain weight'], "Select a valid goal"),
    gender: Yup.string().required("Gender required").oneOf(['Male', 'Female'], "Select a valid gender"),
});




export { profileSchema };