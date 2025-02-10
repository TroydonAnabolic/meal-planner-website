import AWS from "aws-sdk";
import { StartTranscriptionJobRequest } from "aws-sdk/clients/transcribeservice";
import fs from "fs";
import path from "path";

AWS.config.update({
  region: process.env.AWS_REGION,
});

const transcribeService = new AWS.TranscribeService();
const s3 = new AWS.S3();

export const transcribeAudio = async (
  audioFilePath: string
): Promise<string | undefined> => {
  try {
    const fileStream = fs.createReadStream(audioFilePath);
    const fileName = path.basename(audioFilePath);
    const s3Bucket = process.env.S3_BUCKET_NAME!;
    const prefix = process.env.S3_BUCKET_KEYPATH_AUDIO!;
    const s3Params = {
      Bucket: s3Bucket,
      Key: `${prefix}/${fileName}`,
      Body: fileStream,
      ContentType: "audio/mpeg",
    };

    const s3UploadResult = await s3.upload(s3Params).promise();
    const audioFileUrl = s3UploadResult.Location;

    const transcribeParams: StartTranscriptionJobRequest = {
      TranscriptionJobName: `transcription-job-${Date.now()}`,
      LanguageCode: "en-US",
      Media: {
        MediaFileUri: audioFileUrl,
      },
      OutputBucketName: s3Bucket!,
      OutputKey: `${prefix}/output`,
    };

    await transcribeService.startTranscriptionJob(transcribeParams).promise();

    // Polling with a retry limit
    let transcriptionJob;
    const maxRetries = 10;
    let retries = 0;

    do {
      if (retries >= maxRetries) {
        throw new Error("Exceeded maximum retries for transcription job");
      }

      transcriptionJob = await transcribeService
        .getTranscriptionJob({
          TranscriptionJobName: transcribeParams.TranscriptionJobName,
        })
        .promise();

      if (
        transcriptionJob?.TranscriptionJob?.TranscriptionJobStatus ===
        "COMPLETED"
      ) {
        break;
      }

      if (
        transcriptionJob?.TranscriptionJob?.TranscriptionJobStatus === "FAILED"
      ) {
        throw new Error("Transcription job failed");
      }

      retries++;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } while (true);

    const transcriptUrl =
      transcriptionJob?.TranscriptionJob?.Transcript?.TranscriptFileUri;
    if (transcriptUrl) {
      const transcriptData = await fetch(transcriptUrl).then((res) =>
        res.json()
      );
      return transcriptData.results.transcripts[0].transcript;
    }
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Transcription failed");
  }
};
