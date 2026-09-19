import type { registrations } from "../data/registrations.mock";

export const applySearchAndOrdering = (
    data: typeof registrations,
    search?: string,
    ordering?: string
) => {
    let result = [...data];

    if (search) {
        result = result.filter(
            (r) =>
                r.event_data.title.toLowerCase().includes(search.toLowerCase()) ||
                r.event_data.description.toLowerCase().includes(search.toLowerCase())
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