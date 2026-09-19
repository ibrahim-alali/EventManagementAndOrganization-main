import { http, HttpResponse, delay } from "msw";
import { ENV } from "../../config/env";

/* =======================
   Helpers
======================= */
import { registrationsManageHelper } from "../helpers/registrationsManage.helpers";

/* =======================
   Handlers
======================= */
export const registrationsManageHandlers = [
    /* ==================================================
       1. Get Organizer Registrations
    ================================================== */
    http.get(
        `${ENV.API_BASE_URL}/events/registrations/organizer`,
        async () => {
            await delay(500);

            const registrations =
                registrationsManageHelper.getAll();

            return HttpResponse.json(registrations, {
                status: 200,
            });
        }
    ),

    /* ==================================================
       2. Accept Registration
    ================================================== */
    http.post(
        `${ENV.API_BASE_URL}/events/:id/accept`,
        async ({ params }) => {
            const { id } = params as { id: string };

            await delay(400);

            registrationsManageHelper.accept(id);

            return HttpResponse.json(
                { message: "Registration accepted" },
                { status: 200 }
            );
        }
    ),

    /* ==================================================
       3. Reject Registration
    ================================================== */
    http.post(
        `${ENV.API_BASE_URL}/events/:id/reject`,
        async ({ params }) => {
            const { id } = params as { id: string };

            await delay(400);

            registrationsManageHelper.reject(id);

            return HttpResponse.json(
                { message: "Registration rejected" },
                { status: 200 }
            );
        }
    ),

    /* ==================================================
       4. Cancel Registration (by organizer)
    ================================================== */
    http.post(
        `${ENV.API_BASE_URL}/events/:id/cancel-by-organizer`,
        async ({ params }) => {
            const { id } = params as { id: string };

            await delay(400);

            registrationsManageHelper.cancel(id);

            return HttpResponse.json(
                { message: "Registration canceled" },
                { status: 200 }
            );
        }
    ),
];
