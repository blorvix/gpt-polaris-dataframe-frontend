// src/
//  └── types/
//      └── chat.ts
// import { Message } from '@/utils/services/openai/openai-stream';

// export interface Chat extends Record<string, any> {
//     id: string
//     title: string
//     messages: Message[]
// }

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
    Cleanup = 0,
    Summary = 1,
    Vizhelp = 2,
    Completed = 3,
}

export type Message = {
    text: string;
    role: string;
    type: string;
};

export type DataSet = {
    id: number;
    name: string;
    progress_step: ProgressStep;
}

export type UploadedFile = {
    id: number;
    datafile: {
        id: number;
        name: string;
    };
    same_dataset: {
        id: number;
        name: string;
    } | null;
    same_file_name: boolean;
}

export type UploadedFileHowto = {
    id: number;
    howto: string;
}

// export type UploaedFile = {
//     message: Message;
//     file: File;
// }

export type Conversation = {
    id: number;
    name: string;
}

export type Question = {
    question: string;
    options: {
        text: string;
        action: () => void;
    }[]
}

