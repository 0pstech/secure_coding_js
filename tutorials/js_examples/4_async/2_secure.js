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

async function main() {
  try {
    // Fetch token asynchronously and wait for completion
    accessToken = await fetchAccessToken();
    console.log("Token has been set:", accessToken);
    
    // Execute sensitive operation only after token is set
    await performSensitiveOperation();
    console.log("Main function execution completed - Safely returned result to user");
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Async functions return a Promise, so proper error handling is added
main().catch(error => {
  console.error("Fatal error:", error);
});
