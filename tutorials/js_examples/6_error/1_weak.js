// Example of security issues caused by incorrect error handling and exception handling

// 1. Exposure of sensitive information in error messages
function connectToDatabase(username, password) {
  try {
    // Attempt to connect to database (assume it fails)
    throw new Error(`Database connection failed: Attempted connection with username ${username}, password ${password}`);
  } catch (error) {
    // Problem: Error message contains sensitive information
    console.error(error.message);
    return { success: false, error: error.message }; // Sensitive information sent to client
  }
}

// 2. Internal structure exposure through stack trace
function processUserData(userData) {
  try {
    // Intentionally cause error
    const result = userData.nonExistentMethod();
    return result;
  } catch (error) {
    // Problem: Full stack trace is exposed
    console.error("Error occurred:", error.stack);
    return { success: false, error: error.stack }; // Internal code structure exposed to client
  }
}

// 3. Service disruption vulnerability due to lack of exception handling
function validateUserInput(input) {
  // No exception handling - application may crash with invalid input
  const parsedData = JSON.parse(input); // Exception thrown for invalid JSON format
  return parsedData.isValid;
}


// controller -> service -> repository
// 4. Exception handling issues in nested calls
function innerFunction(data) {
  // Throw exception but don't handle it
  if (!data || !data.id) {
    throw new Error("Invalid data");
  }
  
  // Error containing sensitive information
  if (data.id < 0) {
    throw new Error(`System path: C:/users/admin/secure_app/${data.id}, access denied`);
  }
  
  return data.id;
}

function middleFunction(userId) {
  // Don't handle exception, propagate to parent function
  const id = innerFunction({ id: userId });
  return id * 2;
}

function outerFunction(userId) {
  try {
    return middleFunction(userId);
  } catch (error) {
    // Problem: Error containing sensitive information from inner function
    // propagates through multiple layers and is exposed here
    console.error("Error during processing:", error.message);
    return { error: error.message }; // Sensitive information included in response
  }
}

// Execution examples
// console.log("--------------------------------");
// console.log("1. Exposure of sensitive information in error messages");
// console.log(connectToDatabase("admin", "supersecret123"));

// console.log("\n--------------------------------");
// console.log("2. Internal structure exposure through stack trace");
// console.log(processUserData({}));

// console.log("\n--------------------------------");
// console.log("3. Service disruption vulnerability due to lack of exception handling");
// try {
//   console.log(validateUserInput("Invalid JSON"));
// } catch (e) {
//   console.log("validateUserInput function lacks exception handling, which may cause application crash.");
// }

console.log("\n--------------------------------");
console.log("4. Exception handling issues in nested calls");
console.log(outerFunction(-5)); // Sensitive system path information exposed
