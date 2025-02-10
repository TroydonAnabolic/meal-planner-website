import {
  PollyClient,
  SynthesizeSpeechCommand,
  SynthesizeSpeechInput,
  Engine,
  LanguageCode,
  OutputFormat,
  VoiceId,
  TextType,
} from "@aws-sdk/client-polly";
import { Readable } from "stream";

const pollyClient = new PollyClient({ region: "us-east-1" });

export const convertTextToSpeech: (
  text: string
) => Promise<Uint8Array | null> = async (
  text: string
): Promise<Uint8Array | null> => {
  try {
    const input: SynthesizeSpeechInput = {
      Engine: Engine.STANDARD, // "NEURAL" for higher quality if needed
      LanguageCode: LanguageCode.en_US,
      OutputFormat: OutputFormat.MP3,
      Text: text,
      TextType: TextType.TEXT,
      VoiceId: VoiceId.Joanna, // Change based on your desired voice
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
