import { RealtimeTranscriber, RealtimeTranscript } from "assemblyai";
import { getAssemblyToken } from "./getAssemblyToken";




export async function createTranscriber( )  { 
    const token = await getAssemblyToken(); 
    if (!token) { console.error('No token found'); 
        return; 

    } 
    const transcriber = new RealtimeTranscriber({ sampleRate: 16_000, token: token, endUtteranceSilenceThreshold: 1000, }); 
    transcriber.on('transcript', (transcript: RealtimeTranscript) => { 
        if (!transcript.text) { 
            return; 
        } 
        if (transcript.message_type === 'PartialTranscript') { 
            //setTranscribedText(transcript.text);
            console.log(transcript.text);
         } 
        else { 
            //setTranscribedText(transcript.text);  
             console.log(transcript.text); 
             if (transcript.text.toLowerCase().indexOf('llama') > 0) {
            // processPrompt(transcript.text);
             console.log (transcript.text);
             }       
        } 
    }); 

   
    return transcriber; 
}