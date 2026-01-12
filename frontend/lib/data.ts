import React from "react";
import { LuGraduationCap } from "react-icons/lu";
import YoloDetectionImg from "@/public/YoloDetection.jpg";
import SochiWinterOlympicsImg from "@/public/SochiWinterOlympics.png";
import GLCAIChatbotImg from "@/public/GLCAIChatbot.png";
import SCOPEProjectImg from "@/public/SCOPEProject.jpg"
export const links = [
  {
    name: "Home",
    hash: "/",
  },
  {
    name: "About",
    hash: "/#about",
  },
  {
    name: "Projects",
    hash: "/#projects",
  },
  {
    name: "Skills",
    hash: "/#skills",
  },
  {
    name: "Experience",
    hash: "/#experience",
  },
  {
    name: "Photos",
    hash: "/photo",
  },
  {
    name: "Blogs",
    hash: "https://glistening-cloche-173.notion.site/Jiucai-s-BLOG-22e5db4ddc1780daa138dce70b441d26?pvs=74"
  },
] as const;

export const experiencesData = [
  {
    title: "Yonsei University",
    location: "Seoul, South Korea",
    description:
      "Global Leaders College, Applied Information Engineering major",
    icon: React.createElement(LuGraduationCap),
    date: "2022-2027",
  },
] as const;

export const projectsData = [
  {
    title: "Object Detection with YOLO",
    description:
      "I used YOLO to detect objects in the image and video. And experienced the whole process of model finetuning, training and inference.",
    tags: ["Pytorch", "YOLO", "Computer Vision"],
    imageUrl:YoloDetectionImg,
    link: "https://glistening-cloche-173.notion.site/22e5db4ddc1780ebb8a6d3167576859f?v=22e5db4ddc1780829490000c97eadf18&p=22e5db4ddc1780f5b447ee55b0b6df4f&pm=s",
  },
  {
    title: "SCOPE: Fast PET Reconstruction via BBDM",
    description:
      "Accelerated Alzheimer's PET scans by 5x (20m → 4m) using Brownian Bridge Diffusion Models.",
    tags: ["Diffusion Model", "Medical Image"],
    imageUrl: SCOPEProjectImg,
    link: "https://glistening-cloche-173.notion.site/SCOPE-Slice-COnsistent-PET-Reconstruction-with-2D-BBDM-2b65db4ddc1780cab36cf012b41bd976",
  },
  {
    title: "2014 Sochi Winter Olympics analysis",
    description:
      "I analyzed the data of the 2014 Sochi Winter Olympics. I crawled the data from the website and visualized the data.",
    tags: ["Pandas", "Data Analysis", "Sentiment Analysis","Web Crawling"],
    imageUrl: SochiWinterOlympicsImg,
    link: "/",
  },
] as const;

export const skillsData = [
  "Git",
  "Machine Learning",
  "Data Analysis",
  "Python",
  "Deep Learning",
  "Transformer",
  "3D Image processing",
  "LLM finetuning",
  "Computer Vision",
  "Natural Language Processing",
  "RAG",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Notion",
  "Multilingual"
] as const;
