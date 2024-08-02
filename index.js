// Importing necessary modules
require('dotenv').config();
const axios = require('axios');
const colors = require('colors');
const fs = require('fs');
const { AUTH_TOKEN } = process.env;

// Function to log to file
function logToFile(message) {
    const logMessage = `${message}\n`;
    fs.appendFile('farming.log', logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
}

// Function to process the claim request
async function fetchData() {
  try {
    // Configure request with endpoint and header
    const response = await axios.get('https://moon.popp.club/moon/claim/farming', {
      headers: {
        'Authorization': AUTH_TOKEN
      }
    });
    
    // Log the response body
    const message = response.data.msg;
    console.log('Claim Farming:', message.green);
  }catch (error) {
    // Handle error if the request fails
    console.error('Claim Farming:', error);
    logToFile(`Claim Farming Error: ${error.message}`);
  }
}

// Function to fetch farming data
async function fetchFarmingData() {
  try {
    // Configure request with endpoint and header
    const response = await axios.get('https://moon.popp.club/moon/farming', {
      headers: {
        'Authorization': AUTH_TOKEN
      }
    });
    
    // Log the response body
    const message = response.data.msg;
    console.log('Start Farming:', message.green);
  } catch (error) {
    // Handle error if the request fails
    console.error('Start Farming:', error);
    logToFile(`Start Farming Error: ${error.message}`);
  }
}

// Function to fetch asset data
async function fetchAssetData() {
  try {
    // Configure request with endpoint and header
    const response = await axios.get('https://moon.popp.club/moon/asset', {
      headers: {
        'Authorization': AUTH_TOKEN
      }
    });
    
    // Log the response body
    const message = response.data.data.sd;
    console.log('Asset Amount (SD):', message);
    logToFile(`Asset Amount (SD): ${message}`);
  } catch (error) {
    // Handle error if the request fails
    console.error('Fetch Asset Data:', error);
    logToFile(`Fetch Asset Data Error: ${error.message}`);
  }
}

// Function to log the current time
function logCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const currentTime = `Current Time: ${hours}:${minutes}:${seconds}`;
  console.log(currentTime.yellow);
  logToFile(currentTime);
}

// Function to fetch asset data every minute and check conditions
async function fetchAssetPerMinute() {
  try {
    // Configure request with endpoint and header
    const response = await axios.get('https://moon.popp.club/moon/asset', {
      headers: {
        'Authorization': AUTH_TOKEN
      }
    });
    // Check if farming has ended
    if (response.data.data.farmingEndTime === 0) {
        console.log('===================================');
        logToFile('===================================');
        console.log('Farming has ended!'.red);
        logCurrentTime();
        await fetchData();
        await fetchFarmingData();
        await fetchAssetData();
        console.log('=================================== \n');
        logToFile('===================================');
    }
  } catch (error) {
    // Handle error if the request fails
    console.error('Fetch Asset Per Minute:', error);
  }
}

// Function to run the fetchAssetPerMinute function continuously every 5 seconds
function runContinuously() {
  const intervalId = setInterval(fetchAssetPerMinute, 5 * 1000); // Run every 5 seconds

  // Stop the interval after 10 minutes
  setTimeout(() => {
      clearInterval(intervalId);
      console.log('Stopped running after 10 minutes.');
      logToFile('Stopped running after 10 minutes.');
  }, 10 * 60 * 1000); // 10 minutes
}

// Start the continuous run
runContinuously();
