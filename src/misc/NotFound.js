import React from "react";

export default function NotFound() {
    return <div
        style={{color: "var(--highlight-color)"}}
        className="p-4 text-3xl 2xl:text-5xl font-semibold self-end">
        No route matched given location.
    </div>
}
