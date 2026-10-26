import React from "react";
import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-12 space-y-4">
        <div className="w-24 h-24 rounded-full bg-green-50 text-green-600 text-5xl flex items-center justify-center font-black shadow-xs">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Page Not Found</h1>
        <p className="text-base text-gray-600 max-w-md">
          The page or product category you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4 flex gap-3">
          <Link to="/">
            <Button variant="primary" size="md">
              Return to Homepage
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" size="md">
              Browse Search
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default NotFound;