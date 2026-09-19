import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { delay } from "msw";
import {
  filterVenues,
  createVenue,
  updateVenue,
  archiveVenue,
  unArchiveVenue,
  deleteVenue,
  uploadVenueImages,
  deleteVenueImage,
} from "../helpers/venuesManage.helpers";

import { archivedVenuesDB, venueManageDB } from "../data/venuesManage.mock";
import type { CreateVenuePayload, UpdateVenuePayload } from "../../api/venuesManage";

/* =======================
   Handlers
======================= */

export const venuesManageHandlers = [
  /* -------- GET -------- */
  http.get(`${ENV.API_BASE_URL}/venues/`, ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search") ?? undefined;
    const ordering = url.searchParams.get("ordering") ?? undefined;

    const data = filterVenues(venueManageDB, search, ordering);

    return HttpResponse.json(data, { status: 200 });
  }),

  /* -------- GET -------- */
  http.get(`${ENV.API_BASE_URL}/venues/archived`, ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search") ?? undefined;
    const ordering = url.searchParams.get("ordering") ?? undefined;

    const data = filterVenues(archivedVenuesDB, search, ordering);

    return HttpResponse.json(data, { status: 200 });
  }),

  /* -------- CREATE -------- */
  http.post(`${ENV.API_BASE_URL}/venues/create`, async ({ request }) => {
    const payload = await request.json();
    const venue = createVenue(payload as CreateVenuePayload);
    await delay(600);
    return HttpResponse.json(venue, { status: 201 });
  }),

  /* -------- UPDATE -------- */
  http.put(`${ENV.API_BASE_URL}/venues/:id`, async ({ params, request }) => {
    const payload = await request.json();
    const venue = updateVenue(params.id as string, payload as UpdateVenuePayload);

    if (!venue) {
      return HttpResponse.json({ message: "Venue not found" }, { status: 404 });
    }
    await delay(600);
    return HttpResponse.json(venue, { status: 200 });
  }),

  /* -------- ARCHIVE -------- */
  http.post(`${ENV.API_BASE_URL}/venues/archive/:id`, ({ params }) => {
    const ok = archiveVenue(params.id as string);

    if (!ok) {
      return HttpResponse.json({ message: "Venue not found" }, { status: 404 });
    }

    return HttpResponse.json(null, { status: 200 });
  }),

  /* -------- UNARCHIVE -------- */
  http.post(`${ENV.API_BASE_URL}/venues/unarchive/:id`, ({ params }) => {
    const ok = unArchiveVenue(params.id as string);

    if (!ok) {
      return HttpResponse.json({ message: "Venue not found" }, { status: 404 });
    }

    return HttpResponse.json(null, { status: 200 });
  }),

  /* -------- DELETE -------- */
  http.delete(`${ENV.API_BASE_URL}/venues/:id`, ({ params }) => {
    deleteVenue(params.id as string);
    return HttpResponse.json(null, { status: 204 });
  }),

  /* -------- UPLOAD IMG -------- */
  http.post(`${ENV.API_BASE_URL}/venues/:venueId/images`, async ({ params, request }) => {
    const venueId = params.venueId as string;

    // read formData
    const formData = await request.formData();
    const files: File[] = formData.getAll("images") as File[];

    const metadataRaw = formData.getAll("metadata") as string[];
    const images = files.map((file, index) => {
      const meta = metadataRaw[index]
        ? JSON.parse(metadataRaw[index])
        : { alt_text: file.name, is_cover: false };
      return {
        file,
        alt_text: meta.alt_text,
        is_cover: meta.is_cover,
      };
    });

    const res = uploadVenueImages(venueId, images);
    await delay(1000);
    return HttpResponse.json(res, { status: 201 });
  }),

  /* -------- DELETE IMG -------- */
  http.delete(`${ENV.API_BASE_URL}/venues/:venueId/images/:imageId`, async ({ params }) => {
    const venueId = params.venueId as string;
    const imageId = params.imageId as string;

    const ok = deleteVenueImage(venueId, imageId);

    if (!ok) {
      return HttpResponse.json({ message: "Image not found" }, { status: 404 });
    }
    await delay(600);
    return HttpResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  }),
];
