/********************************
 * FormTextarea Component
 * ----------------------
 * A reusable, controlled, textarea component for a multi-line user input field
 * with built-in validation and error handling.
 *
 * This component prevents duplication and ensures all text-areas
 * in our application behave consistently. If we should need to update styling
 * or validation display, we only change it in this one file.
 *
 * */
function FormTextarea({label, name, value, onChange, row = 5, error}) {
    return(
        <div style={{marginBottom: '1rem'}}>
            <label htmlFor={name}>{label}</label>

            <textarea
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              rows={row}
              style={{
                  width: '100%',
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                  border: error ? "1px solid red" : "1px solid #ccc",
                  borderRadius: "4px",
              }}
            />

            {error && (
                <span style={{color: "red", fontSize: "0.9rem"}}>
                    {error}
                </span>
            )}

        </div>
    );
}

export default FormTextarea;