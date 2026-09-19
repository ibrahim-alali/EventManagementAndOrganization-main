import { v4 as uuid } from "uuid";
import type {
    OrganizerRegistration as Registration,
} from "../../api/registrationsManage";

import {
    registrations as mockRegistrations,
    mockEvents,
} from "../data/registrations.mock";

/* =======================
   In-memory DB
======================= */

let registrationsDB: Registration[] = mockRegistrations.map(
    (reg) => ({
        ...reg,
        event_data:
            mockEvents.find((e) => e.id === reg.event) ?? mockEvents[0],

        attendee: {
            id: uuid(),
            full_name: randomFullName(),
            email: randomEmail(),
        },
    })
);

/* =======================
   Helpers
======================= */

function randomFullName() {
    const first = ["John", "Sarah", "Alex", "Lina", "Omar", "Maya"];
    const last = ["Smith", "Johnson", "Brown", "Khalil", "Haddad"];

    return `${first[Math.floor(Math.random() * first.length)]} ${
        last[Math.floor(Math.random() * last.length)]
    }`;
}

function randomEmail() {
    const domains = ["gmail.com", "outlook.com", "company.com"];
    const name = Math.random().toString(36).substring(2, 8);

    return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

/* =======================
   Public API (used by MSW)
======================= */

export const registrationsManageHelper = {
    /* ---------- Queries ---------- */
    getAll(): Registration[] {
        return registrationsDB;
    },

    /* ---------- Mutations ---------- */
    accept(id: string): void {
        registrationsDB = registrationsDB.map((r) =>
            r.id === id ? { ...r, status: "approved" } : r
        );
    },

    reject(id: string): void {
        registrationsDB = registrationsDB.map((r) =>
            r.id === id ? { ...r, status: "rejected" } : r
        );
    },

    cancel(id: string): void {
        registrationsDB = registrationsDB.map((r) =>
            r.id === id ? { ...r, status: "canceled" } : r
        );
    },

    /* ---------- Utils ---------- */
    reset(): void {
        registrationsDB = [...registrationsDB];
    },
};
