export type User = {
    openai_key: string;
    logined: boolean;
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

}
