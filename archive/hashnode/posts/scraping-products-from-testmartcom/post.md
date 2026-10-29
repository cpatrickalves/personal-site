# Scraping products from testmart.com


In this project, I've built a Scraper/Bot to get equipment data from [testmart.com](testmart.com) using [Scrapy Web Crawling Framework](https://scrapy.org/).

### The Problem

The client needs data from thousands of equipment of National Instruments corporation type from testmart.com to perform data analysis.

### Task

Create an automated and fast solution to navigate the website, extract all the data of the National Instruments corporation type, and save it in a user-friendly format (CSV, JSON, and XML).

### Solution

I've used the Scrapy Web Crawling Framework to build a bot to scrape (extract) the data of all equipment found in the National Instruments corporation type.

### Results

The client was able to quickly download the data of almost 50,000 different types of equipment from testmart.com.

<img width="1046" alt="testmart-example" src="https://user-images.githubusercontent.com/22003608/127740936-39ff0d19-3b15-44cf-937e-f7934ba9bde5.png">

**The data was used for data analysis and add great value to the client business.**

---
# Source code

The solution is available at Github.

[![github](https://user-images.githubusercontent.com/22003608/127739408-c499e7b2-5a1d-4f44-a028-dc46eb8e900d.jpg)](https://github.com/cpatrickalves/scraping-gsamart)

### How to use

* You will need Python 3.5+ to run the scripts. Python can be downloaded [here](https://www.python.org/downloads/).

* You have to install the Scrapy framework and other required packages:
* In command prompt/Terminal: `pip install -r requirements.txt`

* Once you have installed the Scrapy framework, just clone/download this project:

```git clone https://github.com/cpatrickalves/scraping-gsamart.git```

Access the folder in command prompt/Terminal and run the following command:

```scrapy crawl gsamart_nic -o equipaments.csv```

You can change the output format to JSON or XML by change the output file extension (ex: equipaments.json).
