import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/" className="logo">
            <img className="logo-small" src="/ok.png" alt="logo" />
        </Link>
    );
}
