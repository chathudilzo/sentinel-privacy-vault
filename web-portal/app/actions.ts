"use server"; // This magic line tells Next.js: NEVER send this code to the browser!

import { revalidatePath } from "next/cache";

const JAVA_API_URL = process.env.JAVA_API_URL;
const API_KEY = process.env.SENTINEL_API_KEY || "";

export async function addRule(formData: FormData) {
  const ruleValue = formData.get("ruleValue")?.toString();
  if (!ruleValue) return;

  await fetch(`${JAVA_API_URL}/rules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
    body: JSON.stringify({
      ruleType: "BLOCKED_KEYWORD",
      ruleValue: ruleValue.trim(),
    }),
  });

  revalidatePath("/");
}

export async function deleteRule(id: number) {
  await fetch(`${JAVA_API_URL}/rules/${id}`, {
    method: "DELETE",
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  revalidatePath("/");
}
