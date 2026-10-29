# Basket Icon Detector

In this project, I've built a Computer Vision model to help a client to detect e-commerces websites.

### Problem

* The client had a solution to detect if a website is an e-commerce or not and would like to improve the accuracy of detection.
    

### Task

* Improve the current solution to detect, based on the main website page, if it is an e-commerce or not.
    

### Solution

* The client takes a screenshot of the main page of the website.
    
* I've built an **object detection** model using Tensorflow to find basket icons on the screenshot image.
    
* The model was trained with ~ 3000 images with a diverse set of basket icons.
    
* The model accuracy was 95.5%
    
* I've built a web app so the client could test the solution.
    

![basket.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1649437312086/spsbl03N4.png align="left")

### Results

* I've created a REST API to serve the model in production and package it all in a Docker container to easily deploy and scale it.
    
* The client integrates the API in his solution and improves the e-commerces detection.
    

![Untitled.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1649437321582/LuO9Utv7Z.png align="left")

* Here is the [client's feedback](https://www.upwork.com/freelancers/~014bbc069859636ded) about the project:
    

![feedback.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1649681006988/e7NTevt6v.png align="left")

---

## Source code

![no-github.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1649436375682/I4qdP8_Dt.png align="left")

As this is a **private** project, the source code is not available.

You can check the tools I've used and try them by yourself or just [send me a message](/contact) so we can work together.

### Built With

* [Python](https://www.python.org/) - Programming Language.
    
* [Tensorflow](https://www.tensorflow.org) - An end-to-end open-source platform for machine learning.
    
* [FastAPI](https://fastapi.tiangolo.com/) - A web framework for building APIs with Python.
    
* [Docker](https://www.docker.com/) - Industry standard for containers.
