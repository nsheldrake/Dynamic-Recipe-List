
/****************************************
 * FormInput Component
 * -------------------
 * A reusable controlled text field inout used to standardize form fields
 * across the application.
 *
 * Instead of re-writing inout fields in every form, we centralize
 * the logic into a single component. This makes the codebase easier
 * to maintain, scale, and update.
 ***************************************/
function FormInput({label, name, type= "text", value, onChange, error}) {
    return (
      <div style={{marginBottom: '1rem'}}>
          <label htmlFor={name}>{label}</label>

          <input
            type={type}
            id={name}
            name={name}
            onChange={onChange}
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
export default FormInput;