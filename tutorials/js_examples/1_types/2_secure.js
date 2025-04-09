// 1. Implicit Type Conversion Issues
function secureImplicitTypeConversion(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Both parameters must be numbers');
    }
    return a + b;
}
  
// 2. Authentication Vulnerability with Loose Equality
function secureAuthentication(storedToken, userToken) {
    // Using strict equality (===) to compare both type and value
    if (typeof storedToken !== 'string' || typeof userToken !== 'string') {
        throw new TypeError('Tokens must be strings');
    }
    
    // Return false immediately if lengths don't match
    if (storedToken.length !== userToken.length) {
        return false;
    }
    
    // Compare using strict equality operator
    if (storedToken === userToken) {
        return true; // Authentication successful
    }
    return false;
}

// 3. Array Operation Vulnerability
function secureArrayOperation(data) {
    // Validate array type
    if (!Array.isArray(data)) {
        throw new TypeError('Data must be an array');
    }
    
    // Validate array element types
    if (!data.every(item => typeof item === 'number')) {
        throw new TypeError('All array elements must be numbers');
    }
    
    return data.filter(item => item > 10);
}

// 4. Object Property Access Vulnerability
function secureUserDataProcessing(user) {
    // Validate object type
    if (!user || typeof user !== 'object') {
        throw new TypeError('User data must be an object');
    }
    
    // Check for required properties
    if (!('name' in user)) {
        throw new TypeError('User name is required');
    }
    
    // Validate isAdmin is explicitly boolean
    if (typeof user.isAdmin !== 'boolean') {
        throw new TypeError('isAdmin must be a boolean');
    }
    
    // Validate preferences object and set defaults
    if (!user.preferences || typeof user.preferences !== 'object') {
        throw new TypeError('Preferences object is required');
    }
    
    if (!('theme' in user.preferences)) {
        throw new TypeError('Theme property is required');
    }
    
    // Safe destructuring
    const userName = user.name;
    const theme = user.preferences.theme;

    if (user.isAdmin === true) {
        console.log(`Admin ${userName} has logged in. Theme: ${theme}`);
        return true;
    } else {
        console.log(`Regular user ${userName} has logged in. Theme: ${theme}`);
        return false;
    }
}

// 5. String Validation Vulnerability
function secureCreateFilePath(directory, filename) {
    // Validate both directory and filename are strings
    if (typeof directory !== 'string' || typeof filename !== 'string') {
        throw new TypeError('Directory and filename must be strings');
    }
    
    // Handle empty strings
    if (!directory || !filename) {
        throw new Error('Directory and filename cannot be empty');
    }
    
    // Prevent path traversal
    if (directory.includes('..') || filename.includes('..')) {
        throw new Error('Path traversal is not allowed');
    }
    
    // Use template literals for safe string concatenation
    return `${directory}/${filename}`;
}

// 6. Null/Undefined Handling Vulnerability
function secureNullUndefinedHandling(data) {
    // Validate data is an object
    if (!data || typeof data !== 'object') {
        throw new TypeError('Data must be an object');
    }

    // Check if value property exists
    if (!('value' in data)) {
        throw new Error('Data object must have a value property');
    }
    
    // Validate value property type
    if (data.value === null || data.value === undefined) {
        throw new Error('Value property cannot be null or undefined');
    }
    
    return data.value;
}

// Test cases
console.log('--------------------------------');
console.log('1. Implicit Type Conversion');
try {
    console.log(secureImplicitTypeConversion(1, 2)); // 3 - Valid case
    console.log(secureImplicitTypeConversion('1', 2)); // TypeError
} catch (error) {
    console.error('Type error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('2. Authentication Vulnerability');
try {
    console.log(secureAuthentication('token1', 'token1')); // true - Valid case
    console.log(secureAuthentication(null, undefined)); // TypeError
} catch (error) {
    console.error('Authentication error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('3. Array Operation Vulnerability');
try {
    console.log(secureArrayOperation([1, 10, 20])); // Valid case
    console.log(secureArrayOperation(['1', 10, 20])); // TypeError
} catch (error) {
    console.error('Array processing error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('4. Object Property Access Vulnerability');
try {
    console.log(secureUserDataProcessing({
        name: 'John',
        isAdmin: true,
        preferences: { theme: 'dark' }
    })); // true - Valid case
    console.log(secureUserDataProcessing({
        name: 'John',
        isAdmin: null,
        preferences: { theme: 'dark' }
    })); // TypeError
} catch (error) {
    console.error('Object processing error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('5. String Validation Vulnerability');
try {
    console.log(secureCreateFilePath('user', 'profile.jpg')); // Valid case
    console.log(secureCreateFilePath('user', '../profile.jpg')); // Error
} catch (error) {
    console.error('File path error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('6. Null/Undefined Handling Vulnerability');
try {
    console.log(secureNullUndefinedHandling({ value: 'test' })); // Valid case
    console.log(secureNullUndefinedHandling({})); // Error
} catch (error) {
    console.error('Null/undefined handling error occurred:', error.message);
}
console.log('--------------------------------'); 