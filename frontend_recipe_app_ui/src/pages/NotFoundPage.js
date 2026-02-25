import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function NotFoundPage() {
  /** 404 page. */
  return (
    <section className="page">
      <h1 className="page__title">Page not found</h1>
      <p className="page__description">
        The page you requested doesn’t exist.
      </p>
      <Link className="link" to="/">
        Go back to Feed
      </Link>
    </section>
  );
}
