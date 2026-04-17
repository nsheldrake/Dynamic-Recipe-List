//This form to demonstrate
// - Controlled form inputs using useState
// - Real-Time and on-submit validation
// - Event handlers (onChange, onSubmit)
// - Async form submission with Fetch + async/await
// - Loading, success, and error state (better UX experience)

import {useEffect, useRef, useState} from "react";
import {saveFormDraft, loadFormDraft, clearFormDraft} from "../utils/storage";
import FormInput from './form/FormInput';
import FormTextarea from './form/FormTextarea.jsx';
import useRecipeValidation from '../hooks/useRecipeValidation';

function RecipeForm() {

    //Single state object for all form fields (cleaner)
    // Load saved draft immediately during initialization instead of inside useEffect
    const [formData, setFormData] = useState(() => {
        const draft = loadFormDraft(true);
        return Object.keys(draft).length > 0
            ? draft
            : { name: '', email: '', ingredients: '', instructions: '' };
    });

    const {errors, validateForm, validateSingleField, clearErrors} = useRecipeValidation();

    //User-facing message after submission
    const [submitMessage, setSubmitMessage] = useState('');

    //'idle', 'submitting', 'success', 'error'
    const [status, setStatus] = useState('idle');

    const useSession = true;    // Set to true for session-only drafts; false for persistent local drafts

    // Store a failed submission, allowing 'Retry' to resend
    const [lastAttempt, setLastAttempt] = useState(null);

    // Keep a reference to our timeout
    const clearMessageTimeoutId = useRef(null);

    // -----------------------------------------------------
    // CLEANUP TIMERS ON UNMOUNT
    // If we set a timer (setTimeout) and the component unmounts before it fires
    // React warns us with a warning: "Can't perform a React state update on an unmounted component."
    // -----------------------------------------------------
    useEffect(() => {
        return () => {
            if(clearMessageTimeoutId.current){
                clearTimeout(clearMessageTimeoutId.current);
            }
        };
    }, []);



    const handleChange = (e) => {
        const {name, value} = e.target;
        const updateFormData =  {...formData, [name]: value};
        setFormData(updateFormData);
        validateSingleField(name, value);
        saveFormDraft(updateFormData, useSession);
    };

    // ----------------------------------------
    // FORM SUBMISSION
    // ----------------------------------------
    // A help function that returns a Promise that resolves after Xms
    // This is a clean way to simulate delays (network, response time, etc...) in async/await code.
    const delay = (ms) => new Promise (
        (resolve) => {
            setTimeout(resolve, ms);
        });

    // We put submission logic in ONE function so it can be reused for sending
    const submitForm = async (payload) => {
        setStatus('submitting');
        setSubmitMessage('');
        setLastAttempt(payload);    // if we attempted to send a message, save it for retry

        // simulate server processing delay
        await delay(3000);

        const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.status}`);
        }

        return response.json();
    };

    // Event handler to handle form submission
    const handleSubmit = async (e) => {
        //Prevent page reload -- CRUCIAL in React!!
        e.preventDefault();

        if (!validateForm(formData)) {
            return; //Stop if form data is invalid
        }

        // Clear any previous message timeout that might still be active and running
        if(clearMessageTimeoutId.current){
            clearTimeout(clearMessageTimeoutId.current);
            clearMessageTimeoutId.current = null;
        }

        try{
            const data = await submitForm(formData);
            console.log('Submitted successfully: ', data);

            // Clear draft from storage on success
            clearFormDraft(useSession);

            setStatus('success');
            setSubmitMessage('Thank you! Your message has been sent successfully!');

            //Reset from after success
            setFormData( {name: '', email: '', ingredients: '', instructions: ''});
            clearErrors({});

            // Hide success message after 3 seconds
            clearMessageTimeoutId.current = setTimeout(() => {
                setSubmitMessage('');
                setStatus('idle');
            }, 3000);

        }catch(err){
            setStatus('error');
            setSubmitMessage(`Error: ${err.message}`);
        }
    };

    // Retry handler (only appears in error state)
    const handleRetry = async () => {
        if(!lastAttempt) return;

        if (clearMessageTimeoutId.current){
            clearTimeout(clearMessageTimeoutId.current);
            clearMessageTimeoutId.current = null;
        }

        try {
            const data = await submitForm(lastAttempt);
            console.log('Retry submitted successfully: ', data);

            setStatus('success');
            setSubmitMessage('Success! Your message has been sent on retry.');

            clearFormDraft(useSession);
            setFormData( {name: '', email: '', ingredients: '', instructions: ''});
            clearErrors({});

            clearMessageTimeoutId.current = setTimeout(() => {
                setSubmitMessage('');
                setStatus('idle');
            }, 3000);

        }catch(err){
            setStatus('error');
            setSubmitMessage(`Error: ${err.message}`);
        }

    }

    // --------------------------------------------------
    // CONTACT FORM RENDERING
    // --------------------------------------------------
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

            <h2>Submit a Recipe</h2>

            { /* Name field*/ }
            <FormInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
            />

            { /* Email field*/ }
            <FormInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />

            { /* Ingredients field*/ }
            <FormTextarea
                label="Ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                error={errors.ingredients}
            />

            { /* Instructions field*/ }
            <FormTextarea
                label="Instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                error={errors.instructions}
            />


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

            {/* Retry button (only appears in error state)*/}
            {status === 'error' && (
                <button type="button"
                        onClick={handleRetry}
                        style={{
                            marginLeft: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                >
                    Retry
                </button>
            )}


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

