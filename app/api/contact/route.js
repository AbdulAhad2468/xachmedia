import { handleContactRequest } from "../../../lib/contact.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  return handleContactRequest(request);
}
