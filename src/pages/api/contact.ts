import { getSecret } from 'astro:env/server';
import { validateContactForm, verifyTurnstileToken } from '@/utils/index';
import type { ContactFormData, FormState } from '@/types/contact';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const TURNSTILE_SECRET_KEY = getSecret('TURNSTILE_SECRET_KEY');

  try {
    const formData = await request.formData();

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      'cf-turnstile-response': formData.get('cf-turnstile-response'),
    };

    const validationResult = validateContactForm(data);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: validationResult.error,
        } as FormState),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = validationResult.data!;

    const turnstileResult = await verifyTurnstileToken(
      validatedData['cf-turnstile-response'],
      TURNSTILE_SECRET_KEY as string
    );

    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: turnstileResult.error || 'Turnstile verification failed',
        } as FormState),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await handleContactFormSubmission(validatedData);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      } as FormState),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred. Please try again later.',
      } as FormState),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

async function handleContactFormSubmission(data: ContactFormData): Promise<void> {
  console.log('Form submission data:', {
    name: data.name,
    email: data.email,
    message: data.message,
    timestamp: new Date().toISOString(),
  });
}