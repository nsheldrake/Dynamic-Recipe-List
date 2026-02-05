import validator from 'validator';

// Check if field is required
export const validateRequired = (field, value) => {
    if(!value.trim()) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    return '';
}

// Validate email using validator package (instead of regex)
export const validateEmail = (email) => {
    if(!validator.isEmail(email)){
        return 'Please enter a valid email address';
    }
    return '';
}

// Get formatted error messages from errors object
export const getErrorMessages = (errors) => {
    const messages = Object.entries(errors)
        .filter(([, msg]) =>msg)                                       // Destructuring in filter
        .map(([field, msg]) => `${field}: ${msg}`);   // Template/String Literal = map

    return messages.join('\n');     // Simple join/concatenation for display
}