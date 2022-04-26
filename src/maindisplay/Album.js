import React from "react";
import { useParams } from "react-router-dom";

function Album() {
    let { id } = useParams();

    return (
        <div>
            <h3>{id}</h3>
        </div>
    );
}

export default Album;