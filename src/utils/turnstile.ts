const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY is not configured');
      return {
        success: false,
        error: 'Server configuration error',
      };
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Turnstile service unavailable',
      };
    }

    const result = await response.json();

    if (!result.success) {
      console.error('Turnstile verification failed:', result.error_codes);
      return {
        success: false,
        error: 'Verification failed. Please try again.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      error: 'Failed to verify token',
    };
  }
}