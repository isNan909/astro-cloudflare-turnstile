import { useRef, useEffect, useActionState } from "react";
import type { FormState } from "@/types/contact";
import { submitAction } from "@/actions/contact";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction, isPending] = useActionState<FormState>(
    submitAction as any,
    { message: "" }
  );

  // Load Turnstile script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const s = document.querySelector(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );
      if (s) document.head.removeChild(s);
    };
  }, []);

  useEffect(() => {
    if (formState?.success) {
      formRef.current?.reset();
    }
  }, [formState?.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
          Name
        </label>
        <input
          name="name"
          id="name"
          required
          disabled={isPending}
          className="w-full p-2.5 border border-gray-300 rounded-md disabled:opacity-75 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          disabled={isPending}
          className="w-full p-2.5 border border-gray-300 rounded-md disabled:opacity-75 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block mb-2 font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          required
          disabled={isPending}
          className="w-full p-2.5 border border-gray-300 rounded-md disabled:opacity-75 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Turnstile */}
      <div
        className="cf-turnstile w-full"
        data-sitekey="0x4AAAAAACDAp2pSvhjq3_Wm"
        data-size="normal"
      />

      {/* Error */}
      {formState?.error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md">
          {formState.error}
        </div>
      )}

      {/* Success */}
      {formState?.success && (
        <div className="p-3 bg-green-100 text-green-800 rounded-md">
          {formState.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={`p-3 px-6 bg-blue-600 text-white rounded-md text-base font-semibold 
          hover:bg-blue-700 transition 
          ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {isPending ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
