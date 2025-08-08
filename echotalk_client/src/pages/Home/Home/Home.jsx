import React from 'react';
import AllPosts from '../../../pages/Home/AllPosts/AllPosts'
import Banner from '../Banner/Banner';
import TagsSection from '../TagsSection/TagsSection';
import Announcement from '../Announcement/Announcement';
const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <TagsSection></TagsSection>
            <Announcement></Announcement>
            <AllPosts></AllPosts>
        </div>
    );
};



export default Home;