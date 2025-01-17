// [axiosConfig.ts](axiosConfig.ts)
import axios from "axios";
import https from "https";
import { CertificateClient } from "@azure/keyvault-certificates";
import { DefaultAzureCredential } from "@azure/identity";

// Initialize Azure Key Vault client
const keyVaultName = process.env.AZURE_KEY_VAULT_NAME;
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
const credential = new DefaultAzureCredential();
const certificateClient = new CertificateClient(keyVaultUrl, credential, {
  retryOptions: {
    maxRetries: 5,
    maxRetryDelayInMs: 16000,
    retryDelayInMs: 2000,
  },
});

// Function to fetch certificate from Azure Key Vault
async function getCertificate() {
  const certificateName = process.env.AZURE_APIM_CERTIFICATE_NAME;
  if (!certificateName) {
    throw new Error("AZURE_APIM_CERTIFICATE_NAME is not defined");
  }
  try {
    const certificateWithPolicy = await certificateClient.getCertificate(
      certificateName
    );
    const certificate = certificateWithPolicy.cer;
    if (!certificate) {
      throw new Error("Certificate is undefined");
    }
    return Buffer.from(certificate).toString("base64");
  } catch (error) {
    console.error("Error fetching certificate from Key Vault:", error);
    throw error;
  }
}

// Immediately Invoked Function to set Axios defaults
(async () => {
  try {
    const base64Cert = await getCertificate();
    const caCert = Buffer.from(base64Cert, "base64");
    const isProd = process.env.NODE_ENV === "production";
    // !allowSelfSignedCerts Ensure certificate verification is enabled
    const httpsAgent = new https.Agent({
      ca: isProd ? caCert : undefined, // Trust only the specified certificate
      rejectUnauthorized: isProd ? true : false, //
    });

    // Set Axios global defaults
    axios.defaults.httpsAgent = httpsAgent;
  } catch (error) {
    console.error("Failed to set Axios HTTPS agent:", error);
    // Handle error as needed, possibly exit the process or fallback
  }
})();

// Export Axios instance

export default axios;
