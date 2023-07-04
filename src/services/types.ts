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

export enum ProgressStep {
    None = 0,
    Cleanup = 1,
    Summary = 2,
    Vizhelp = 3,
}

export type Message = {
    text: string;
    role: string;
    type: string;
};

export type DataFile = {
    id: number;
    name: string;
    progress_step: number;
}

// export type UploaedFile = {
//     message: Message;
//     file: File;
// }

export type Conversation = {
    id: number;
    name: string;
}
