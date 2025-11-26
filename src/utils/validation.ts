import {
    object,
    string,
    minLength,
    email,
    pipe,
    safeParse
} from 'valibot';
import type { ContactFormData } from '@/types/contact';

const contactFormSchema = object({
    name: pipe(string(), minLength(1, 'Name is required')),
    email: pipe(
        string(),
        minLength(1, 'Email is required'),
        email('Invalid email address')
    ),
    message: pipe(string(), minLength(1, 'Message is required')),
    'cf-turnstile-response': pipe(
        string(),
        minLength(1, 'Turnstile verification failed')
    ),
});

export function validateContactForm(data: unknown): {
    success: boolean;
    data?: ContactFormData;
    error?: string;
} {
    const result = safeParse(contactFormSchema, data);

    if (result.success) {
        return {
            success: true,
            data: result.output as ContactFormData,
        };
    } else {
        return {
            success: false,
            error: result.issues[0]?.message || 'Validation failed',
        };
    }
}