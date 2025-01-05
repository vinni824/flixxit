import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.scss";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const showFooter = !location.pathname.includes("/videoplayer");
  return (
    <>
      {showFooter && (
        <footer className="footer">
          <ContentWrapper>
            <ul className="menuItems">
              <li className="menuItem">
                <a href="/terms-of-use">Terms of Use</a>
              </li>
              <li className="menuItem">
                <a href="/privacy">Privacy-Policy</a>
              </li>
              <li className="menuItem">
                <a href="/about-us">About</a>
              </li>
              <li className="menuItem">Blog</li>
              <li className="menuItem">FAQ</li>
            </ul>
            <div className="infoText">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </div>
            <div className="socialIcons">
              <span className="icon">
                <FaFacebookF />
              </span>
              <span className="icon">
                <FaInstagram />
              </span>
              <span className="icon">
                <FaGithub />
              </span>
              <span className="icon">
                <FaLinkedin />
              </span>
            </div>
          </ContentWrapper>
        </footer>
      )}
    </>
  );
};

export default Footer;
