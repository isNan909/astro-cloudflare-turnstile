import { useActionState, useRef, useEffect } from 'react';
import { submitFormData } from '@/actions/contact';

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, formAction, isPending] = useActionState(
    submitFormData,
    null
  );

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (formState?.success) {
      formRef.current?.reset();
    }
  }, [formState?.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={isPending}
          className="w-full p-2.5 border border-gray-300 rounded-md text-base disabled:opacity-75 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
          className="w-full p-2.5 border border-gray-300 rounded-md text-base disabled:opacity-75 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={isPending}
          className="w-full p-2.5 border border-gray-300 rounded-md text-base font-sans disabled:opacity-75 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Turnstile */}
      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAACDAp2pSvhjq3_Wm"
        data-size="normal"
      ></div>

      {formState?.error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md">
          {formState?.error}
        </div>
      )}

      {formState?.success && (
        <div className="p-3 bg-green-100 text-green-800 rounded-md">
          {formState?.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={`
          p-3 px-6 bg-blue-600 text-white rounded-md text-base font-semibold transition duration-150 ease-in-out
          hover:bg-blue-700
          ${isPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}