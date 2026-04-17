//Responsibilities:
// - store field-level errors
// - validate a single field
// - validate the full form
// - support real-time validation while typing
//
// Reuse validation helper functions from utils/validation.js
import {useState} from "react";
import {validateEmail, validateRequired} from "../utils/validation.js";
import validator from "validator";

function useRecipeValidation() {

    const [errors, setErrors] = useState({});

    // Helper function that validates a SINGLE field based on its name
    const validateField = (name, value) => {
        switch(name) {
            case 'name':
                return validateRequired('name', value);

            case 'email': {
                const requiredError = validateRequired('email', value);
                if(requiredError) return requiredError;

                if(!validator.isEmail(value)) return 'Please enter a valid email address';

                return validateEmail(value);
            }

            case 'ingredients':
                return validateRequired('ingredients', value);

            case 'instructions':
                return validateRequired('instructions', value);

            default:
                return '';
        }
    };

    const validateForm = (formData) => {

        // if (!formData || typeof formData !== 'object') {
        //     console.error('validateForm received invalid data:', formData);
        //     return false;
        // }

        const newErrors = {};

        Object.entries(formData).forEach(([field, value]) => {
            newErrors[field] = validateField(field, value);
        });

        setErrors(newErrors);

        return Object.values(newErrors).every(error => !error);
    };

    const validateSingleField = (name, value) =>{

        const errorMessage = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage
        }));

        return errorMessage;
    };

    const clearErrors = () => {
        setErrors({});
    };

    return {
        errors,
        validateForm,
        validateSingleField,
        clearErrors,
    };
}
export default useRecipeValidation;