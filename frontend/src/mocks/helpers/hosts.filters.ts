import type { Host } from "../../api/hosts";

interface FilterResult<T> {
    results: T[];
    total: number;
    page: number;
    page_size: number;
}

export function filterHosts(
    data: Host[],
    request: Request,
    role: "organizer" | "provider"
): FilterResult<Host> {
    const url = new URL(request.url);

    const search = url.searchParams.get("search");
    const minScore = Number(url.searchParams.get("min_score"));
    const minVotes = Number(url.searchParams.get("min_votes"));
    const ordering = url.searchParams.get("ordering");
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("page_size") || 10);

    // Filter by role
    let filtered = data.filter((h) => h.role === role);

    // Search
    if (search) {
        filtered = filtered.filter(
            (h) =>
                h.full_name.toLowerCase().includes(search.toLowerCase()) ||
                h.email.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Minimum score
    if (!isNaN(minScore)) {
        filtered = filtered.filter((h) => h.votes_score >= minScore);
    }

    // Minimum votes
    if (!isNaN(minVotes)) {
        filtered = filtered.filter((h) => h.votes_count >= minVotes);
    }

    // Ordering
    if (ordering === "-votes_score") filtered.sort((a, b) => b.votes_score - a.votes_score);
    if (ordering === "-votes_count") filtered.sort((a, b) => b.votes_count - a.votes_count);
    if (ordering === "-created_at")
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    return { results, total, page, page_size: pageSize };
}
