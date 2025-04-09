// 1. Type Safety with TypeScript
function tsImplicitTypeConversion(a: number, b: number): number {
    // TypeScript already validates parameter types, so no runtime type check needed
    return a + b;
}
  
// 2. String Comparison Safety with TypeScript
function tsAuthentication(storedToken: string, userToken: string): boolean {
    // TypeScript already validates parameter types, so no runtime type check needed
    
    // Return false immediately if string lengths differ
    if (storedToken.length !== userToken.length) {
        return false;
    }
    
    // Use strict equality operator for comparison
    if (storedToken === userToken) {
        return true; // Authentication successful
    }
    return false;
}

// 3. Array Type Safety with TypeScript
function tsArrayOperation(data: number[]): number[] {
    // TypeScript already validates array type and element types, so no runtime check needed
    return data.filter(item => item > 10);
}

// 4. Object Type Safety with TypeScript
interface UserPreferences {
    theme: string;
}

interface User {
    name: string;
    isAdmin: boolean;
    preferences: UserPreferences;
}

function tsUserDataProcessing(user: User): boolean {
    // TypeScript already validates object structure and types, so most runtime checks are unnecessary
    
    // Safe destructuring assignment
    const { name: userName, preferences: { theme } } = user;

    if (user.isAdmin) {
        console.log(`Admin ${userName} has logged in. Theme: ${theme}`);
        return true;
    } else {
        console.log(`Regular user ${userName} has logged in. Theme: ${theme}`);
        return false;
    }
}

// 5. String Type Safety with TypeScript
function tsCreateFilePath(directory: string, filename: string): string {
    // TypeScript already validates parameter types, so no runtime type check needed
    
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

// 6. Null and Undefined Handling with TypeScript
interface DataWithValue {
    value: string | number; // null and undefined are not allowed
}

function tsNullUndefinedHandling(data: DataWithValue): string | number {
    // TypeScript already validates object structure and types, so most runtime checks are unnecessary
    return data.value;
}

// Test cases
console.log('--------------------------------');
console.log('1. TypeScript Type Safety');
try {
    console.log(tsImplicitTypeConversion(1, 2)); // 3 - Normal case
    // TypeScript will show compile error: console.log(tsImplicitTypeConversion('1', 2));
} catch (error) {
    if (error instanceof Error) {
        console.error('Type error occurred:', error.message);
    } else {
        console.error('Unknown type error occurred:', error);
    }
}
console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('2. TypeScript String Comparison Safety');
// try {
//     console.log(tsAuthentication('token1', 'token1')); // true - Normal case
//     // TypeScript will show compile error: console.log(tsAuthentication(null, undefined));
// } catch (error) {
//     console.error('Authentication error occurred:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('3. TypeScript Array Type Safety');
// try {
//     console.log(tsArrayOperation([1, 10, 20])); // Normal case
//     // TypeScript will show compile error: console.log(tsArrayOperation(['1', 10, 20]));
// } catch (error) {
//     console.error('Array processing error occurred:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('4. TypeScript Object Type Safety');
// try {
//     console.log(tsUserDataProcessing({
//         name: 'John',
//         isAdmin: true,
//         preferences: { theme: 'dark' }
//     })); // true - Normal case
//     // TypeScript will show compile error
//     // console.log(tsUserDataProcessing({
//     //     name: 'John',
//     //     isAdmin: null,
//     //     preferences: { theme: 'dark' }
//     // }));
// } catch (error) {
//     console.error('Object processing error occurred:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('5. TypeScript String Type Safety');
// try {
//     console.log(tsCreateFilePath('user', 'profile.jpg')); // Normal case
//     // TypeScript will show compile error: console.log(tsCreateFilePath('user', null));
//     console.log(tsCreateFilePath('user', '../profile.jpg')); // Error
// } catch (error) {
//     console.error('File path error occurred:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('6. TypeScript Null and Undefined Handling');
// try {
//     console.log(tsNullUndefinedHandling({ value: 'test' })); // Normal case
//     // TypeScript will show compile error: console.log(tsNullUndefinedHandling(null));
//     // TypeScript will show compile error: console.log(tsNullUndefinedHandling({}));
// } catch (error) {
//     console.error('Null/undefined handling error occurred:', error.message);
// }
// console.log('--------------------------------'); 