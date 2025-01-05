import React from "react";

import "./styles.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";

const About = () => {
  return (
    <div className="aboutPage">
      <ContentWrapper>
        <div className="pageTitle">About us</div>
        <div className="bodyText">
          Flixxit aims to be a web application with the likeness and basic
          feature set of OTT platforms such as Netflix, Prime Video, and
          AppleTV+. While the actual products are built using a complex web of
          microservices and infrastructure, the objective here is to build the
          core user functionality. Feature Set User Accounts: Sign up and login
          functionality using email and password. User Profile: Display account
          information, consumed content, and suggestions. Enable preference
          updates. Dashboard: Horizontally scrollable carousels by categories
          and genres. Title View: Display synopsis, rating, and other details of
          a chosen title. Search: Search content like movies, web series,
          documentaries, etc., using the The Movie Database API. Watchlist: Add
          programs for later viewing with an "Autoplay" feature. Rating: Upvote
          or downvote programs and display the count. Video Player: Preview or
          play selected content with a "Skip Intro" feature. Support at least
          two video qualities (HD, Auto). Payment and Subscription: Subscribe to
          monthly or yearly plans and display an invoice with a "Pay Now"
          button. Integration with a payment gateway like Stripe is optional.
          About Us: Provide information on features, origin, copyrights, terms
          and conditions, and help desk details.
        </div>
      </ContentWrapper>
    </div>
  );
};

export default About;
