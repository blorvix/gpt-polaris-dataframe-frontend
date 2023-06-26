export type User = {
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

export type File = {
    id: number;
    name: string;
}

// export type UploaedFile = {
//     message: Message;
//     file: File;
// }

export type Conversation = {
    id: number;
    name: string;
}
