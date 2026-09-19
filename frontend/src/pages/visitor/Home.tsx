import React from "react";
import { Hero } from "../../components/home/Hero";
import { WhyListEMO } from "../../components/home/WhyListEMO";
import { CoreFeatures } from "../../components/home/CoreFeatures";
import { ForWho } from "../../components/home/ForWho";
import { CallToAction } from "../../components/home/CallToAction";

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <WhyListEMO />
      <CoreFeatures />
      <ForWho />
      <CallToAction />
    </>
  );
};
