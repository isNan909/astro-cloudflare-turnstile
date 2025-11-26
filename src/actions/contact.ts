import { validateContactForm, verifyTurnstileToken } from '@/utils/index';
import type { ContactFormData } from '@/types/contact';

export async function submitFormData(_currentState: any, formData: FormData){
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      'cf-turnstile-response': formData.get("cf-turnstile-response") as string
    };

    const validationResult = validateContactForm(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error,
      };
    }

    const validatedData = validationResult.data!;

    const turnstileResult = await verifyTurnstileToken(
      validatedData['cf-turnstile-response']
    );

    if (!turnstileResult.success) {
      return {
        success: false,
        error: turnstileResult.error || 'Turnstile verification failed',
      };
    }

    await handleContactFormSubmission(validatedData);

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      error: 'An error occurred. Please try again later.',
    };
  }
}

async function handleContactFormSubmission(data: ContactFormData): Promise<void> {
  console.log('Form submission data:', {
    name: data.name,
    email: data.email,
    message: data.message,
    timestamp: new Date().toISOString(),
  });
}