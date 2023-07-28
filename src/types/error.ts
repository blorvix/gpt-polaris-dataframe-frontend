/**
 * Custom error class for OpenAI API errors.
 */
export class OpenAIError extends Error {
    type: string;
    param: string;
    code: string;

    /**
     * Creates an instance of OpenAIError.
     * @param message The error message.
     * @param type The error type.
     * @param param The parameter that caused the error.
     * @param code The error code.
     */
    constructor(message: string, type: string, param: string, code: string) {
        super(message);
        this.name = 'OpenAIError';
        this.type = type;
        this.param = param;
        this.code = code;
    }
}
