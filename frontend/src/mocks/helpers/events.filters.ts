import type { EventItem } from "../../api/events";

interface FilterResult<T> {
    results: T[];
    total: number;
    page: number;
    page_size: number;
}

export function filterPublicEvents(
    request: Request,
    data: { results: EventItem[] }
): FilterResult<EventItem> {
    const url = new URL(request.url);

    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const min_date = url.searchParams.get("min_date");
    const max_date = url.searchParams.get("max_date");
    const ordering = url.searchParams.get("ordering");
    const page = Number(url.searchParams.get("page") || 1);
    const page_size = Number(url.searchParams.get("page_size") || 12);
    const organizerId = url.searchParams.get("organizer");

    let filtered = [...data.results];

    if (search) {
        filtered = filtered.filter(
            (e) =>
                e.title.toLowerCase().includes(search) ||
                e.description.toLowerCase().includes(search)
        );
    }

    if (min_date) {
        filtered = filtered.filter((e) => e.date >= min_date);
    }

    if (max_date) {
        filtered = filtered.filter((e) => e.date <= max_date);
    }

    if (organizerId) {
        const idNum = Number(organizerId);
        filtered = filtered.filter((e) => e.organizer.id === idNum);
    }

    if (ordering === "date")
        filtered.sort((a, b) => (a.date > b.date ? 1 : -1));
    else if (ordering === "-date")
        filtered.sort((a, b) => (a.date < b.date ? 1 : -1));

    const start = (page - 1) * page_size;
    const paginated = filtered.slice(start, start + page_size);

    return {
        results: paginated,
        total: filtered.length,
        page,
        page_size,
    };
}
