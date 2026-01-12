"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        I am studying Applied Information Engineering at Yonsei University. I decided to pursue my passion for programming.{" "}
        <span className="italic">My favorite part of programming and AI is that </span> 
        I <span className="underline">love</span> the feeling of building a model that learns from data. It's like taking care of a child and watching them grow, which gives me a great sense of accomplishment. My core skills are{" "}
        <span className="font-medium">
          Python, PyTorch, and Computer Vision 
        </span>
        . I am currently looking for an{" "}
        <span className="font-medium">internship</span> as a Data Scientist or AI Engineer.
      </p>

      <p>
        <span className="italic">When I'm not coding</span>, I enjoy playing
        video games, watching movies, and playing football. I also enjoy{" "}
        <span className="font-medium">photography</span>. You can check the "Photos"
        section to see more of my photos. I hope you enjoy them!
      </p>
    </motion.section>
  );
}
