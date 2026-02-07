//This form to demonstrate
// - Controlled form inputs using useState
// - Real-Time and on-submit validation
// - Event handlers (onChange, onSubmit)
// - Async form submission with Fetch + async/await
// - Loading, success, and error state (better UX experience)

import {useEffect, useState} from "react";
import {validateRequired, validateEmail} from '../utils/validation.js'
import {saveFormDraft, loadFormDraft, clearFormDraft} from "../utils/storage";

function RecipeForm() {

    //Single state object for all form fields (cleaner)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ingredients: '',
        instructions: '',
    });

    //Error object: helps disable button (on errors), values for error messages
    const [errors, setErrors] = useState({});

    //User-facing message after submission
    const [submitMessage, setSubmitMessage] = useState('');

    //'idle', 'submitting', 'success', 'error'
    const [status, setStatus] = useState('idle');

    const useSession = true;    // Set to true for session-only drafts; false for persistent local drafts

    // Load saved draft from localStorage
    useEffect(() => {
        const draft = loadFormDraft(useSession);
        if(Object.keys(draft).length > 0) {
            setFormData(draft);
        }
    }, []);

    // Validation function - return true if valid, false otherwise
    // Called on submit
    const validateForm = () => {

        const newErrors = {};

        newErrors.name = validateRequired('name', formData.name);
        newErrors.email = validateRequired('email', formData.email) || validateEmail(formData.email);
        newErrors.ingredients = validateRequired('ingredients', formData.ingredients);
        newErrors.instructions = validateRequired('instructions', formData.instructions);

        setErrors(newErrors);

        //Form is valid only if no errors
        // Object.keys(newErrors) get all field names (name, email, ingredients, instructions)
        // filter(...) keeps only the fields that actually contain an error
        // If the number of remaining errors is 0, the form is valid
        return Object.keys(newErrors).filter(key => newErrors[key]).length === 0;
    }


    const handleChange = (e) => {

        const {name, value} = e.target;     // ES6 destructing

        //Update the correct field in formData
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        //Optional: clear error for this field as user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Save draft to localStorage on every change
        saveFormDraft({...formData, [name]: value}, useSession); // Use import ESM function

    };

    // Event handler to handle form submission
    const handleSubmit = async (e) => {

        //Prevent page reload -- CRUCIAL in React!!
        e.preventDefault();

        if (!validateForm()) {
            return; //Stop if form data is invalid
        }

        setStatus('submitting');
        setSubmitMessage('');

        try{
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(!response.ok){
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            console.log('Submitted successfully: ', data);

            setStatus('success');
            setSubmitMessage('Thank you! Your message has been sent successfully!');

            // Clear draft form from localStorage after successful submission
            clearFormDraft();

            //Reset from after success
            setFormData( {name: '', email: '', ingredients: '', instructions: ''});
            setErrors({});

        }catch(err){
            setStatus('error');
            setSubmitMessage(`Error: ${err.message}`);
        }
    };

    return (

        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: '500px',
                margin: '2rem auto',
                padding: '1.5rem',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
        >

            <h2>Submission Form</h2>

            { /* Name field*/ }
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem'}}
                />
                {errors.name && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.name}</span>}
            </div>

            { /* Email field*/ }
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem'}}
                />
                {errors.email && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.email}</span>}
            </div>

            { /* Ingredients field*/ }
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="ingredients">Ingredients:</label>
                <textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem'}}
                />
                {errors.ingredients && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.ingredients}</span>}
            </div>

            { /* Instruction field*/ }
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="instructions">Instructions:</label>
                <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem'}}
                />
                {errors.instructions && <span style={{color: 'red', fontSize: '0.9rem'}}>{errors.instructions}</span>}
            </div>

            { /*Submit button*/ }
            <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: status === 'submitting' ? '#aaa' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                }}
            >
                {status === 'submitting' ? 'Sending...' : 'Submit Recipe'}

            </button>

            { /* Submission Feedback */ }
            {submitMessage && (
                <p style={{
                    marginTop: '1rem',
                    color: status === 'success' ? 'green' : 'red',
                    fontWeight: 'bold',
                }}>
                    {submitMessage}
                </p>
            )}
        </form>
    );

}
export default RecipeForm;

