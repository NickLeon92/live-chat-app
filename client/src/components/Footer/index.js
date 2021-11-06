import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const history = useHistory();
  return (
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        <Link className="btn btn-lg btn-info m-2" to="/">
          Home
        </Link>
        <h4>
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          by Nick Leon.
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
