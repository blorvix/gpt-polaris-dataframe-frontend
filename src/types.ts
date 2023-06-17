export type User = {
    logined: boolean;
    openai_key: string;
    openai_model: string;
};

export enum WaitingStates {
    GeneratingResponse = "Generating response",
    GeneratingCode = "Generating code",
    RunningCode = "Running code",
    UploadingFiles = "Uploading file(s)",
    Idle = "Idle",
}

export type Message = {
    text: string;
    role: string;
    type: string;
};

export type Conversation = {
    id: number;
    name: string;
}
