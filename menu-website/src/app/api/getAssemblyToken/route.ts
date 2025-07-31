import { AssemblyAI } from "assemblyai";

export async function POST() {
  const apiKey = "4ccb2b5ddf904ce3a8dcfcbda3ad42c5";
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API key" }), {
      status: 500,
    });
  }

  try {
    const assemblyClient = new AssemblyAI({ apiKey });

    const token = await assemblyClient.streaming.createTemporaryToken({
      expires_in_seconds: 60,
    });
    
    console.log ("token - " + token);

    return Response.json({ token });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating AssemblyAI token:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
