"use client";

import React from "react";
import { FocusCards } from "@/components/ui/focus-cards";
import TypingAnimation from "@/components/ui/typing-animation";
  
export default function PhotoPage() {
  const cards = [
    {
      title: "金锭桥",
      src: "/photos/JinDingQiao.jpg",
    },
    {
        title: "2025江花岛日出,可惜没有看到",
        src: "/photos/JiangHuaDao.jpg",
    },
    {
        title: "这棵树当时就矗立在那里,闪闪发光",
        src: "/photos/YonseiAutumn.jpg",
    },
    {
        title: "和朋友一起约爬天空公园，天气不错^^",
        src: "/photos/TianKongGongYuan.jpg",
    },
    {
        title: "석촌호수的樱花",
        src: "/photos/SeokChonHoSuSakura.jpg",
    },
    {
        title: "人生第一次MT拍到的椅子，好像自己当时也这么孤独",
        src: "/photos/Chair.jpg",
    },
    {
        title: "在20岁的第一天看到了首尔最高的日出，就在北汉山上",
        src: "/photos/BukHanSan.jpg",
    },
    {
        title: "爬到山顶的时候见到了这个大叔，于是记录了下来，后来发现这个大叔在一年里面登顶了100次北汉山，佩服他的毅力",
        src: "/photos/BukHanSanUncle.jpg",
    },
    {
      title: "还在北京的时候拍的角楼，照片如同我记忆里的北京一样清澈",
      src: "/photos/JiaoLou.jpg",
  },
  ];

  return (
    <div className="p-6">
      <div className="text-3xl font-bold mb-6 text-center">
        <TypingAnimation>Photo Gallery</TypingAnimation>
      </div>
      <FocusCards cards={cards} />
    </div>
 
  );
}


