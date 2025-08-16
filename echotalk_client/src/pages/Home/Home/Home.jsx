import React, { useEffect } from 'react';
import AllPosts from '../../../pages/Home/AllPosts/AllPosts'
import Banner from '../Banner/Banner';
import TagsSection from '../TagsSection/TagsSection';
import Announcement from '../Announcement/Announcement';
import { useLocation } from "react-router";
const Home = () => {
    const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 300); // ছোট delay যাতে DOM render হয়
      }
    }
  }, [location.state]);
    return (
        <div>
            <Banner></Banner>
            <TagsSection></TagsSection>
            <section id='announcements'><Announcement></Announcement></section>
            <section id='all-posts'><AllPosts ></AllPosts></section>
        </div>
    );
};



export default Home;