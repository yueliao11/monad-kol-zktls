import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk"

/**
 * Example implementation based on Primus documentation
 * Application: X Web3 KOL
 * App ID: 0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b
 * Secret: 0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4
 */

// Initialize parameters, the init function is recommended to be called when the page is initialized.
const primusZKTLS = new PrimusZKTLS();
const appId = "0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b";
// Note: appSecret cannot be written in the front-end code in production
const appSecret = "0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4"; 

export async function initializePrimus() {
  const initAttestationResult = await primusZKTLS.init(appId, appSecret);
  console.log("primusProof initAttestationResult=", initAttestationResult);
  return initAttestationResult;
}

export async function primusProof(templateId: string, userAddress: string) {
  // Set TemplateID and user address
  const attTemplateID = templateId;
  
  // Generate attestation request
  const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

  // Set zkTLS mode, default is proxy model (This is optional)
  const workMode = "proxytls";
  request.setAttMode({
    algorithmType: workMode,
  });

  // Set attestation conditions (These are optional)
  // 1. Hashed result example:
  // const attConditions = [
  //   [
  //     { 
  //       field:'YOUR_CUSTOM_DATA_FIELD',
  //       op:'SHA256',
  //     },
  //   ],
  // ];
  
  // 2. Conditions result example:
  // const attConditions = [
  //   [
  //     {
  //       field: "YOUR_CUSTOM_DATA_FIELD",
  //       op: ">",
  //       value: "YOUR_CUSTOM_TARGET_DATA_VALUE",
  //     },
  //   ],
  // ];
  // request.setAttConditions(attConditions);

  // Transfer request object to string
  const requestStr = request.toJsonString();

  // Sign request
  const signedRequestStr = await primusZKTLS.sign(requestStr);

  // Start attestation process
  const attestation = await primusZKTLS.startAttestation(signedRequestStr);
  console.log("attestation=", attestation);

  // Verify signature
  const verifyResult = await primusZKTLS.verifyAttestation(attestation);
  console.log("verifyResult=", verifyResult);

  if (verifyResult === true) {
    // Business logic checks, such as attestation content and timestamp checks
    // Do your own business logic
    return {
      success: true,
      attestation,
      data: attestation.data
    };
  } else {
    // If failed, define your own logic
    return {
      success: false,
      error: "Attestation verification failed"
    };
  }
}

/**
 * Production-safe version that uses backend for signing
 */
export async function primusProofProduction(templateId: string, userAddress: string) {
  // Initialize Primus SDK (frontend only - no secret)
  const primusZKTLS = new PrimusZKTLS();
  await primusZKTLS.init(appId); // Only appId for frontend

  // Generate attestation request
  const request = primusZKTLS.generateRequestParams(templateId, userAddress);

  // Set zkTLS mode to proxy TLS (recommended)
  request.setAttMode({
    algorithmType: "proxytls",
  });

  // Add additional parameters for tracking
  const additionParams = JSON.stringify({
    platform: templateId,
    timestamp: Date.now(),
    userAgent: navigator.userAgent.substring(0, 100) // Truncate for privacy
  });
  request.setAdditionParams(additionParams);

  // Convert request to string
  const requestStr = request.toJsonString();

  // Get signed request from backend
  const signResponse = await fetch(`/api/zktls/sign?signParams=${encodeURIComponent(requestStr)}`);
  const signResult = await signResponse.json();

  if (!signResult.signResult) {
    throw new Error('Failed to sign request');
  }

  // Start attestation process
  const attestation = await primusZKTLS.startAttestation(signResult.signResult);

  // Verify attestation
  const verifyResult = await primusZKTLS.verifyAttestation(attestation);

  if (verifyResult === true) {
    return {
      success: true,
      attestation,
      data: attestation.data
    };
  } else {
    throw new Error('Attestation verification failed');
  }
}