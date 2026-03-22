// Validate Employee ID - must be between 100000 and 3000000
export const validateEmpId = (value) => {
  if (!value) return "*Please enter a value";
  if (Number(value) < 100000 || Number(value) > 3000000)
    return "*Employee ID is expected between 100000 and 3000000";
  return "";
};

// Validate Employee Name - only alphabets and spaces, min 3 chars
export const validateEmpName = (value) => {
  if (!value) return "*Please enter a value";
  if (!/^[a-zA-Z ]+$/.test(value))
    return "Employee name can have only alphabets and spaces";
  if (value.length < 3) return "Employee Name should have atleast 3 letters";
  return "";
};

// Validate Experience - must not be empty
export const validateExperience = (value) => {
  if (value === "" || value === undefined || value === null)
    return "*Please enter a value";
  return "";
};
