// import { updateVectorDB } from "@/util/vector-db-util";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { NextRequest, NextResponse } from "next/server";
// import path from "path";

// export const POST = async (req: NextRequest) => {
//   const { indexname, namespace } = await req.json();
//   return await handleUpload(indexname, namespace);
// };

// async function handleUpload(indexname: string, namespace: string) {
//   try {
//     const loader = new DirectoryLoader("./documents", {
//       ".pdf": (path: string) =>
//         new PDFLoader(path, {
//           splitPages: false,
//         }),
//       ".txt": (path: string) => new TextLoader(path),
//     });
//     const docs = await loader.load();
//     const client = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY!,
//     });

//     const responseStream = new ReadableStream({
//       async start(controller) {
//         await updateVectorDB(
//           client,
//           indexname,
//           namespace,
//           docs,
//           (filename, totalChunks, chunksUpserted, isComplete) => {
//             const data = JSON.stringify({
//               filename,
//               totalChunks,
//               chunksUpserted,
//               isComplete,
//             });
//             controller.enqueue(new TextEncoder().encode(data));
//             if (isComplete) {
//               controller.close();
//             }
//           }
//         );
//       },
//     });

//     return new NextResponse(responseStream, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error: any) {
//     return new NextResponse(
//       JSON.stringify({ error: error.message || "An error occurred" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }
