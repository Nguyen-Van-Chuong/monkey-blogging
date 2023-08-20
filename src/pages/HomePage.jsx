import Header from "components/layout/Header";
import Layout from "components/layout/Layout";
import { auth } from "firebase-app/firebase-config";
import { signOut } from "firebase/auth";
import HomeBanner from "module/home/HomeBanner";
import HomeFeature from "module/home/HomeFeature";
import HomeNewest from "module/home/HomeNewest";
import React from "react";
import styled from "styled-components";
const HomePageStyles = styled.div``;
const HomePage = () => {
  // const handleSignOut = () => {
  //   signOut(auth);
  // };
  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner></HomeBanner>
        <HomeFeature />
        <HomeNewest></HomeNewest>
      </Layout>
      {/* <button>Sign out</button> */}
    </HomePageStyles>
  );
};

export default HomePage;
