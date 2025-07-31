export enum MessageTypeEnum {
  TRANSCRIPT = "transcript",                 // User speech-to-text
  FUNCTION_CALL = "tool-calls",           // When a function is invoked by the assistant
  FUNCTION_CALL_RESULT = "function_all_result", // When the function returns
  ADD_MESSAGE = "add-message",               // Used to add new messages manually
}


export enum MessageRoleEnum {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

export enum TranscriptMessageTypeEnum {
  PARTIAL = "partial",
  FINAL = "final",
}

export interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT;
  role: MessageRoleEnum;
  transcriptType: TranscriptMessageTypeEnum;
  transcript: string;
}

export interface FunctionCallMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL;
  functionCall: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters: any;
  };
}

export interface FunctionCallResultMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL_RESULT;
  functionCallResult: {
    forwardToClientEnabled?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [a: string]: any;
  };
}

export interface BaseMessage {
  type: MessageTypeEnum;
}

export type Message =
  | TranscriptMessage
  | FunctionCallMessage
  | FunctionCallResultMessage;
