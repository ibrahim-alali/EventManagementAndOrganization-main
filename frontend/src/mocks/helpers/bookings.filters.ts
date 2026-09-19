import type { bookings } from "../data/bookings.mock";

export const applySearchAndOrdering = (
    data: typeof bookings,
    search?: string,
    ordering?: string
) => {
    let result = [...data];

    if (search) {
        result = result.filter(
            (b) =>
                b.venue.name.toLowerCase().includes(search.toLowerCase()) ||
                b.venue.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (ordering) {
        const isDesc = ordering.startsWith("-");
        const field = isDesc ? ordering.slice(1) : ordering;

        result.sort((a: any, b: any) => {
            if (a[field] < b[field]) return isDesc ? 1 : -1;
            if (a[field] > b[field]) return isDesc ? -1 : 1;
            return 0;
        });
    }

    return result;
};