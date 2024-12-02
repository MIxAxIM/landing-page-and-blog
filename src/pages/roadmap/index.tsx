import React from "react";
import RoadmapEraComponent from "~/ui/roadmap/RoadmapEraComponent";
import MenuBar from "../../ui/landing/MenuBar";
import Footer from "~/ui/landing/Footer";
import { roadmap } from "~/data/roadmap";


const ProductRoadmap = () => {
  return (
    <>
      <MenuBar />
      <main
        className="items-center justify-center"
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        <div className="mx-auto max-w-6xl rounded-lg p-8 shadow-lg md:mt-[150px] md:border md:border-primary">
          <h2>
            Andamio Roadmap
          </h2>
          <div className="">
            {roadmap.map((item, index) => (
              <RoadmapEraComponent key={index} {...item} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductRoadmap;
