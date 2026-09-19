import type { VenueItem } from "../../api/venues";

interface FilterResult<T> {
    results: T[];
    total: number;
    page: number;
    page_size: number;
}

export function filterPublicVenues(
    request: Request,
    data: VenueItem[]
): FilterResult<VenueItem> {
    const url = new URL(request.url);

    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const min_capacity = Number(url.searchParams.get("min_capacity") || 0);
    const max_capacity = Number(url.searchParams.get("max_capacity") || Infinity);
    const min_price = Number(url.searchParams.get("min_price") || 0);
    const max_price = Number(url.searchParams.get("max_price") || Infinity);
    const ordering = url.searchParams.get("ordering");
    const page = Number(url.searchParams.get("page") || 1);
    const page_size = Number(url.searchParams.get("page_size") || 12);
    const providerId = url.searchParams.get("provider");

    let filtered = [...data];

    // search filter
    if (search) {
        filtered = filtered.filter(
            (v) =>
                v.name.toLowerCase().includes(search) ||
                v.description.toLowerCase().includes(search)
        );
    }

    // capacity & price filter
    filtered = filtered.filter(
        (v) =>
            v.capacity >= min_capacity &&
            v.capacity <= max_capacity &&
            Number(v.price_per_hour) >= min_price &&
            Number(v.price_per_hour) <= max_price
    );

    // provider filter
    if (providerId) {
        const idNum = Number(providerId);
        filtered = filtered.filter((v) => v.provider.id === idNum);
    }

    // ordering
    if (ordering === "capacity") filtered.sort((a, b) => a.capacity - b.capacity);
    else if (ordering === "-capacity") filtered.sort((a, b) => b.capacity - a.capacity);
    else if (ordering === "price_per_hour")
        filtered.sort((a, b) => Number(a.price_per_hour) - Number(b.price_per_hour));
    else if (ordering === "-price_per_hour")
        filtered.sort((a, b) => Number(b.price_per_hour) - Number(a.price_per_hour));

    // pagination
    const start = (page - 1) * page_size;
    const paginated = filtered.slice(start, start + page_size);

    return {
        results: paginated,
        total: filtered.length,
        page,
        page_size,
    };
}
