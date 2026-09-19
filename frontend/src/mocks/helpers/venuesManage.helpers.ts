import type { VenueImage } from "../../api/venues";
import type {
  Venue,
  CreateVenuePayload,
  UpdateVenuePayload,
  LocalVenueImage,
  UploadVenueImagesResponse,
} from "../../api/venuesManage";

import { archivedVenuesDB, venueImagesDB, venueManageDB } from "../data/venuesManage.mock";

/* =======================
   Query Helpers
======================= */

export const filterVenues = (
  venues: Venue[],
  search?: string,
  ordering?: string
): Venue[] => {
  let result = [...venues];

  if (search) {
    result = result.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (ordering) {
    switch (ordering) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "-name":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price_per_hour":
        result.sort((a, b) => a.price_per_hour - b.price_per_hour);
        break;
      case "-price_per_hour":
        result.sort((a, b) => b.price_per_hour - a.price_per_hour);
        break;
      case "-created_at":
        result.sort(
          (a, b) => {
            const aDate = a.last_time_archived ? new Date(a.last_time_archived).getTime() : new Date(a.created_at).getTime();
            const bDate = b.last_time_archived ? new Date(b.last_time_archived).getTime() : new Date(b.created_at).getTime();
            return bDate - aDate;
          }
        );
        break;
      case "created_at":
        result.sort(
          (a, b) => {
            const aDate = a.last_time_archived ? new Date(a.last_time_archived).getTime() : new Date(a.created_at).getTime();
            const bDate = b.last_time_archived ? new Date(b.last_time_archived).getTime() : new Date(b.created_at).getTime();
            return aDate - bDate;
          }
        );
        break;
    }
  }

  return result;
};


/* =======================
   CRUD Helpers
======================= */

export const createVenue = (
  payload: CreateVenuePayload
): Venue => {
  const newVenue: Venue = {
    id: `venue-${Date.now()}`,
    status: "active",
    created_at: new Date().toISOString(),
    average_rating: {
      average_rating: 0,
      count: 0,
    },
    ...payload,
  };

  venueManageDB.unshift(newVenue);
  return newVenue;
};

export const updateVenue = (
  id: string,
  payload: UpdateVenuePayload
): Venue | null => {
  const venue = venueManageDB.find((v) => v.id === id);
  if (!venue) return null;

  Object.assign(venue, payload);
  return venue;
};

export const archiveVenue = (id: string): boolean => {
  const index = venueManageDB.findIndex((v) => v.id === id);
  if (index === -1) return false;

  const [venue] = venueManageDB.splice(index, 1); 
  venue.status = "archived";
  venue.last_time_archived = new Date(Date.now()).toISOString().split("T")[0];
  archivedVenuesDB.push(venue);

  return true;
};

export const unArchiveVenue = (id: string): boolean => {
  const index = archivedVenuesDB.findIndex((v) => v.id === id);
  if (index === -1) return false;

  const [venue] = archivedVenuesDB.splice(index, 1); 
  venue.status = "active";
  venueManageDB.push(venue);

  return true;
};


export const deleteVenue = (id: string): void => {
  const index = venueManageDB.findIndex((v) => v.id === id);
  if (index !== -1) {
    venueManageDB.splice(index, 1);
  }
};

export const uploadVenueImages = (venueId: string, images: LocalVenueImage[]): UploadVenueImagesResponse => {
  const uploadedImages: VenueImage[] = images.map((img) => ({
    id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    image_url: URL.createObjectURL(img.file), 
    image_size: img.file.size,
    alt_text: img.alt_text,
    is_cover: img.is_cover,
  }));

  if (!venueImagesDB[venueId]) venueImagesDB[venueId] = [];
  venueImagesDB[venueId].push(...uploadedImages);

  return {
    message: "Images uploaded successfully",
    images: uploadedImages,
  };
};

export const deleteVenueImage = (venueId: string, imageId: string): boolean => {
  const venueImages = venueImagesDB[venueId];
  if (!venueImages) return false;

  const index = venueImages.findIndex((img) => img.id === imageId);
  if (index === -1) return false;

  venueImages.splice(index, 1);
  return true;
};