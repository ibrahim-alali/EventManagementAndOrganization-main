import { delay, http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { getMockMe } from "../data/users.mock";
import { generateRandomToken, randomDelay } from "../helpers/random.helpers";

export const authHandlers = [
  // Login Handler
  http.post(`${ENV.API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
    };

    // Fake validation
    if (body.email === "client@example.com" && body.password === "123456") {
      await delay(randomDelay());
      return HttpResponse.json({
        access: `fake-client-access-token-${generateRandomToken()}`,
        role: "client",
      });
    } else if (
      body.email === "provider@example.com" &&
      body.password === "123456"
    ) {
      await delay(randomDelay());
      return HttpResponse.json({
        access: `fake-provider-access-token-${generateRandomToken()}`,
        role: "provider",
      });
    } else if (
      body.email === "organizer@example.com" &&
      body.password === "123456"
    ) {
      await delay(randomDelay());
      return HttpResponse.json({
        access: `fake-organizer-access-token-${generateRandomToken()}`,
        role: "organizer",
      });
    }

    await delay(randomDelay());
    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  // Register Handler
  http.post(`${ENV.API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      full_name: string;
      email: string;
      password: string;
      phone: string;
      role: string;
    };

    // Always success for testing
    await delay(randomDelay());
    return HttpResponse.json({
      access: `registered-token-${generateRandomToken()}`,
      role: body.role,
    });
  }),

  // Me Handler
  http.get(`${ENV.API_BASE_URL}/auth/me`, async ({ request }) => {
    const authHeader = request.headers.get("authorization");

    // ⛔️ simulate unauthorized
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      await delay(randomDelay());
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    // ✅ authenticated
    await delay(randomDelay());
    const mockMe = getMockMe();
    return HttpResponse.json(mockMe, { status: 200 });
  }),
];
