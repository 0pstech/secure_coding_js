// 1. Implicit Type Conversion Issues
function implicitTypeConversion(a, b) {
    // No type checking, leading to unexpected results
    return a + b;
}

// 2. Authentication Vulnerability with Loose Equality
function vulnerableAuthentication(storedToken, userToken) {
    // Using loose equality (==) which can lead to type coercion
    return storedToken == userToken;
}

// 3. Array Operation Vulnerability
function vulnerableArrayOperation(data) {
    // No type checking for array operations
    return data.filter(item => item > 10);
}

// 4. Object Property Access Vulnerability
function vulnerableUserDataProcessing(user) {
    // No validation of object properties
    return {
        name: user.name,
        isAdmin: user.isAdmin,
        preferences: user.preferences
    };
}

// 5. String Validation Vulnerability
function vulnerableCreateFilePath(directory, filename) {
    // No validation of string inputs
    return directory + '/' + filename;
}

// 6. Null/Undefined Handling Vulnerability
function vulnerableNullUndefinedHandling(data) {
    // No null/undefined checks
    return data.value;
}

// Test cases
console.log('--------------------------------');
console.log('1. Implicit Type Conversion');
try {
    console.log(implicitTypeConversion(1, 2)); // 3
    console.log(implicitTypeConversion('1', 2)); // '12' - Unexpected string concatenation
    console.log(implicitTypeConversion(null, 2)); // 2 - null converted to 0
} catch (error) {
    console.error('Error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('2. Authentication Vulnerability');
try {
    console.log(vulnerableAuthentication('123', 123)); // true - Type coercion
    console.log(vulnerableAuthentication(null, undefined)); // true - Type coercion
} catch (error) {
    console.error('Error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('3. Array Operation Vulnerability');
try {
    console.log(vulnerableArrayOperation([1, 10, 20])); // [20]
    console.log(vulnerableArrayOperation('not an array')); // TypeError
} catch (error) {
    console.error('Error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('4. Object Property Access Vulnerability');
try {
    console.log(vulnerableUserDataProcessing({
        name: 'John',
        isAdmin: true
    })); // Missing preferences property
    console.log(vulnerableUserDataProcessing(null)); // TypeError
} catch (error) {
    console.error('Error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('5. String Validation Vulnerability');
try {
    console.log(vulnerableCreateFilePath('user', 'profile.jpg')); // 'user/profile.jpg'
    console.log(vulnerableCreateFilePath(null, 'profile.jpg')); // 'null/profile.jpg'
} catch (error) {
    console.error('Error occurred:', error.message);
}
console.log('--------------------------------');

console.log('--------------------------------');
console.log('6. Null/Undefined Handling Vulnerability');
try {
    console.log(vulnerableNullUndefinedHandling({ value: 'test' })); // 'test'
    console.log(vulnerableNullUndefinedHandling(null)); // TypeError
} catch (error) {
    console.error('Error occurred:', error.message);
}
console.log('--------------------------------');