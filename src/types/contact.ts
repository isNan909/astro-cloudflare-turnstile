export interface TurnstileResponse {
    success: boolean;
    "error-codes"?: string[];
    challenge_ts?: string;
    hostname?: string;
    action?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
    'cf-turnstile-response': string;
}