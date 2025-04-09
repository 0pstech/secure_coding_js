// Example of secure error handling and exception handling

// 1. Error messages without sensitive information
function connectToDatabase(username, password) {
  try {
    // Attempt to connect to database (assume it fails)
    throw new TypeError(`Database connection failed`);
  } catch (error) {
    // Improvement: No sensitive information in logs or responses
    console.error("Database connection error occurred");
    // Return only generic error message to user
    return { success: false, error: "A temporary service issue has occurred. Please try again later." };
  }
}

// 2. Protected stack trace
function processUserData(userData) {
  try {
    // Intentionally cause error
    const result = userData.nonExistentMethod();
    return result;
  } catch (error) {
    // Improvement: Log stack trace only in development environment, hide in production
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    
    if (isDevEnvironment) {
      console.error("Development environment debugging info:", error.stack);
    } else {
      console.error("User data processing error");
    }
    
    // Provide minimal information to client
    return { success: false, error: "Unable to process request." };
  }
}

// 3. Service stability through proper exception handling
function validateUserInput(input) {
  try {
    const parsedData = JSON.parse(input);
    return parsedData.isValid;
  } catch (error) {
    // Improvement: Proper exception handling to prevent service disruption
    console.error("Input parsing error:", error.name);
    return false; // Safely handle with default value
  }
}

// 4. Secure exception handling in nested calls
function innerFunction(data) {
  // Data validation
  if (!data || !data.id) {
    throw new SyntaxError("INVALID_DATA");
  }
  
  // Use standardized error codes without sensitive information
  if (data.id < 0) {
    throw new RangeError("ACCESS_DENIED");
  }
  
  return data.id;
}

function middleFunction(userId) {
  try {
    const id = innerFunction({ id: userId });
    return id * 2;
  } catch (error) {
    // Error handling and transformation in middle layer
    if (error.message === "INVALID_DATA") {
      throw new TypeError("VALIDATION_ERROR");
    }
    throw error; // Propagate other errors to parent
  }
}

function outerFunction(userId) {
  try {
    return middleFunction(userId);
  } catch (error) {
    // Improvement: Convert standardized error codes to user-friendly messages
    let userMessage = "An error occurred while processing your request.";
    
    if (error.message === "VALIDATION_ERROR") {
      userMessage = "Invalid user ID.";
    } else if (error.message === "ACCESS_DENIED") {
      userMessage = "You do not have permission to access this resource.";
    }
    
    console.error("Error occurred:", error.message);
    return { error: userMessage };
  }
}

// Execution examples
// console.log("--------------------------------");
// console.log("1. Secure error message handling");
// console.log(connectToDatabase("admin", "supersecret123"));

// console.log("\n--------------------------------");
// console.log("2. Protected stack trace");
// console.log(processUserData({}));

// console.log("\n--------------------------------");
// console.log("3. Service stability through proper exception handling");
// console.log(validateUserInput("Invalid JSON"));

console.log("\n--------------------------------");
console.log("4. Secure exception handling in nested calls");
console.log(outerFunction(-5)); // No sensitive information exposure