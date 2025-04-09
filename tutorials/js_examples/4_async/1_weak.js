let accessToken = null;

async function fetchAccessToken() {
  // Assume token is fetched asynchronously (e.g., calling external auth server)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("valid_token");
    }, 1000); // Increased time to simulate longer token issuance
  });
}

async function performSensitiveOperation() {
  // Check token refresh status and perform sensitive operation
  if (!accessToken) {
    console.error("Access denied: Token not available.");
    return;
  }
  console.log("Performing sensitive operation with token:", accessToken);
}

function main() {
  // Start async token refresh - Not waiting for Promise
  fetchAccessToken().then(token => {
    accessToken = token;
    console.log("Token has been set:", token);
  });
  
  // Execute sensitive operation immediately without await - Race condition occurs
  performSensitiveOperation();
  console.log("Main function execution completed - Already returned result to user");
}

main();


