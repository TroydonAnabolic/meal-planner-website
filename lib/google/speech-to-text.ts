// Imports the Google Cloud client library
import { protos, TextToSpeechClient } from "@google-cloud/text-to-speech";
// Import other required libraries
const { writeFile } = require("node:fs/promises");

// Creates a client
const client = new TextToSpeechClient();

export const convertTextToSpeech = async (text: string) => {
  // Construct the request
  // Construct the request
  try {
    // const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
    //   {
    //     input: { text },
    //     voice: {
    //       languageCode: "en-US",
    //       ssmlGender:
    //         protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
    //     },
    //     audioConfig: {
    //       audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
    //     },
    //   };

    // Construct the request
    const request = {
      input: { text: text },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      // select the type of audio encoding
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request as any);
    return response.audioContent;
  } catch (error) {
    console.log(error);
  }
};
