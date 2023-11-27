import { cookies } from "next/headers";

export function getInstance() {
  const instance = cookies().get("iv-instance")?.value;

  if (instance) {
    return instance;
  }

  if (!process.env.NEXT_APP_INVIDIOUS_INSTANCE) {
    throw new Error("NEXT_APP_INVIDIOUS_INSTANCE not set");
  }

  return process.env.NEXT_APP_INVIDIOUS_INSTANCE;
}
