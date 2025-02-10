// Imports the Google Cloud client library
import { protos, TextToSpeechClient } from "@google-cloud/text-to-speech";
// Import other required libraries
const { writeFile } = require("node:fs/promises");

// Creates a client
const client = new TextToSpeechClient();

export const convertTextToSpeech = async (text: string) => {
  // Construct the request
  try {
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text },
        voice: {
          languageCode: "en-US",
          ssmlGender:
            protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
        },
        audioConfig: {
          audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        },
      };

    // Construct the request
    // const request = {
    //   input: { text: text },
    //   // Select the language and SSML voice gender (optional)
    //   voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    //   // select the type of audio encoding
    //   audioConfig: { audioEncoding: "MP3" },
    // };

    const [response] = await client.synthesizeSpeech(request as any);
    return response.audioContent;
  } catch (error) {
    console.log(error);
  }
};
// ("Error: The file at C:\\Users\\troyi\\.google does not exist, or it is not a file. \n    at GoogleAuth._getApplicationCredentialsFromFilePath (webpack-internal:///(rsc)/./node_modules/google-auth-library/build/src/auth/googleauth.js:377:23)\n    at GoogleAuth._tryGetApplicationCredentialsFromEnvironmentVariable (webpack-internal:///(rsc)/./node_modules/google-auth-library/build/src/auth/googleauth.js:316:25)\n    at GoogleAuth.getApplicationDefaultAsync (webpack-internal:///(rsc)/./node_modules/google-auth-library/build/src/auth/googleauth.js:260:24)\n    at GoogleAuth._GoogleAuth_determineClient (webpack-internal:///(rsc)/./node_modules/google-auth-library/build/src/auth/googleauth.js:834:43)\n    at GoogleAuth.getClient (webpack-internal:///(rsc)/./node_modules/google-auth-library/build/src/auth/googleauth.js:696:223)\n    at GrpcClient._getCredentials (webpack-internal:///(rsc)/./node_modules/google-gax/build/src/grpc.js:145:40)\n    at GrpcClient.createStub (webpack-internal:///(rsc)/./node_modules/google-gax/build/src/grpc.js:318:34)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)");
