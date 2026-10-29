# Classifying the floor surface to help robots on different surfaces

This project was part of a Kaggle competition promoted by [Data Science Academy](https://www.datascienceacademy.com.br/) in September of 2019.

The goal of the competition was to create a Machine Learning model to help a robot to classify the floor surface on which it is using data collected by Inertial Measurement Units (IMU) sensors.

**About the project** 

> *The data used in this competition was collected by the **Tampere University Signal Processing Department** in Finland. Data collection was performed with a small **mobile robot** equipped with IMU sensors on different floor surfaces at the university premises. The task is to predict which of the nine floor types (carpet, tiles, concrete, etc.) the robot is using sensor data such as acceleration and velocity. The success of this competition will help improve the navigation of autonomous robots on many different surfaces.*

Competition page: https://www.kaggle.com/c/competicao-dsa-machine-learning-sep-2019


### Problem

A small **mobile robot** equipped with IMU sensors needs to know the current floor surface it is to improve the navigation.

### Task

Predict which of the nine-floor types (carpet, tiles, concrete, etc.) the robot is using sensor data such as acceleration and velocity.

### Solution

Build a Machine Learning model that based on the data send by IMU sensors can classify the current floor surface.

I've used Python to perform an **Exploratory Data Analysis (EDA)** using visual and quantitative methods to understand and summarize the data. Then I've performed Data Cleaning and built several **Machine Learning** models to classify the current floor surface based on sensor data. 

### Results

The final model was a Stacking of LightGBM, Random Forest, and Extra Trees with the Logistic Regression model as a meta classifier. The evaluation metric for this competition was the *Multiclass Accuracy*, which is simply the average rating number with the correct label.

In this competition, my best score was **62.2%** and I've got **position 26** on the [leaderboard](https://www.kaggle.com/c/competicao-dsa-machine-learning-sep-2019/leaderboard).

> The University that promote this competition may use these results to improve the navigation of autonomous robots on many different surfaces.


### Project details and source code

I've written a  [blog post with details](https://cpatrickalves.com/classifying-the-floor-surface-to-help-a-robot) about this project.

The solution is also available at Github.

[![github](https://user-images.githubusercontent.com/22003608/127739408-c499e7b2-5a1d-4f44-a028-dc46eb8e900d.jpg)](https://github.com/cpatrickalves/kaggle-floor-surface-classification)

