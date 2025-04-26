export enum QueryType {
    PR,
    RELEASE,
    BRANCH
}

export function getQueryType(query: string): QueryType {
    if (query.match(/^#?\d+$/)) {
        return QueryType.PR
    } else if (query.match(/^v?[0-9]+\.[0-9]+\.[0-9]+$/)) {
        return QueryType.RELEASE
    } else {
        return QueryType.BRANCH
    }
}

export function getReleaseTag(query: string): string {
    if (query.startsWith("v")) {
        return query
    }
    return "v" + query
}

export function getPRNumber(query: string): number {
    const match = query.match(/#?(\d+)/)
    if (match) {
        return parseInt(match[1])
    }
    throw new Error("Invalid PR number: " + query)
}