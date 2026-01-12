---
title: "Pygwalk"
summary: "a brief introduction of using pygwalk"
date: "2024.1.3"
draft: false
tags:
- tutorial
- English
- Python Library
---
Pygwalker is a Python library that can visualize the data and generate the plot automatically. If you are in the beginning stage of data analysis and don't want to pay that much to buy the tableau.
For installing this library. You can refer to the [official repo of pygwalker](https://github.com/Kanaries/pygwalker).
Or pip install:
```
pip install pygwalker
```
conda install:
```
conda install -c conda-forge pygwalker
```
All the tutorials are available at the official repository. And I want to talk about the usage of this library.
This library I was used in DSL 12th data EDA project. It's about dementia in Korea. 

For advantages: This library allows you to create the data plot easily and instantly, which is perfect for knowing how data looks like and get to know the relationship between different attributes. You just need to drag the attribute and select the type of the plot that you wish to use. Also the color of the plot is pretty.

For disasvantages: This library needs you to preprocess data into a very ideal state, and sometimes the plot will not support the Korean and Chinese characters, which is so annoying that either you have to translate the data into English or change the character encoding standard.