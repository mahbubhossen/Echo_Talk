import React from "react";
import { Link } from "react-router";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-base-content py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-4 grid-cols-2">
        {/* Logo + About */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <Link to="/" className="text-2xl font-bold text-primary">
            EchoTalk
          </Link>
          <p className="text-sm text-gray-500">
            EchoTalk is a community where voices matter. Share ideas, raise discussions, and be heard.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/membership">Membership</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
          <p className="text-sm">Email: support@echotalk.com</p>
          <p className="text-sm">Phone: +880 1234-567890</p>
        </div>

        {/* Column 3: Social */}
        <div>
          <h3 className="text-md font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EchoTalk. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
