import {
  Engine,
  LanguageCode,
  OutputFormat,
  PollyClient,
  SynthesizeSpeechCommand,
  SynthesizeSpeechInput,
  TextType,
  VoiceId,
} from "@aws-sdk/client-polly";
import { writeFile } from "node:fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { Readable } from "stream";

// Initialize Polly client
const pollyClient = new PollyClient({ region: "us-east-1" });

export const convertTextToSpeech = async (text: string) => {
  try {
    const input: SynthesizeSpeechInput = {
      Engine: Engine.STANDARD, // Use "neural" for higher quality
      LanguageCode: LanguageCode.en_US,
      OutputFormat: OutputFormat.MP3,
      Text: TextType.TEXT,
      VoiceId: VoiceId.Joanna, // Change this based on your desired voice
    };

    const command = new SynthesizeSpeechCommand(input);
    const response = await pollyClient.send(command);

    if (response.AudioStream instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of response.AudioStream) {
        chunks.push(Buffer.from(chunk));
      }
      return new Uint8Array(Buffer.concat(chunks));
    }

    console.error("No audio stream returned from Polly.");
    return null;
  } catch (error) {
    console.error("Error converting text to speech:", error);
    return null;
  }
};
