export const validateUser = (data) => {
  const errors = {};
  if (!data.name) errors.name = "Name is required";
  if (!data.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email is invalid";
  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 6) errors.password = "Password must be at least 6 characters";
  return { errors, isValid: Object.keys(errors).length === 0 };
};

export const validateTask = (data) => {
  const errors = {};
  if (!data.title) errors.title = "Title is required";
  if (!data.description) errors.description = "Description is required";
  return { errors, isValid: Object.keys(errors).length === 0 };
};
