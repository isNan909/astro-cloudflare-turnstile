import type { FormState } from "@/types/contact";

export async function submitAction(
    _prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
  
      return await res.json();
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: "An error occurred. Please try again later.",
      };
    }
  }