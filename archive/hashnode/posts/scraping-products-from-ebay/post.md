# Scraping products from eBay

This project contains a set of scripts used to scrape [Ebay's](https://www.ebay.com/) products data using [Scrapy Web Crawling Framework](https://scrapy.org/).

### Problem

The client needs data (name, status, price, stars, ratings) from thousands of products of ebay.com to perform data analysis.

### Task

Create an automated and fast solution to navigate the website, find the products by a search text, extract all the data, and save it in a user-friendly format (CSV or JSON).

### Solution

I've used the Scrapy Web Crawling Framework to build a Python script to search and scrape (extract) the data of products found in Etsy.

### Results

The client was able to quickly (in minutes) download the data in CSV and JSON format of more than 100,000 products from ebay.com and used this data to perform data-driven decisions.

---
# Source code

The solution is available at Github.

[![github](https://user-images.githubusercontent.com/22003608/127739408-c499e7b2-5a1d-4f44-a028-dc46eb8e900d.jpg)](https://github.com/cpatrickalves/scraping-ebay)


### How to use

In the current stage, the list of products scraped is defined by a search string (the same used on the eBay web page).

An example of the scraped data can be found in the ***data/*** folder.

The image below shows a scraped data for the *"iPhone X 256GB"* search string in ebay.com

![ebay_iphone_x_256gb_products_sample](https://user-images.githubusercontent.com/22003608/45721730-a6e3fc80-bb7f-11e8-8e8f-50103bf7c842.jpg)


You will need Python 3.x to run the scripts.
Python can be downloaded [here](https://www.python.org/downloads/).

You have to install ***scrapy*** framework:
* In command prompt/Terminal: `pip install scrapy`
* If you are using [Anaconda Python distribution](https://anaconda.org/anaconda/python): `conda install -c conda-forge scrapy`

Once you have installed *Scrapy* framework, just clone/download this project, access the folder in command prompt/Terminal and run the following command:

```
scrapy crawl ebay -o products.csv
```

You can change the output format to JSON or XML by change the output file extension (ex: *products.json*).

### Search string

The default search string is *Nintendo switch console* and it can be changed in the command line with the *-a* flag.
For example, to search to *Xbox one X* you can use:

```
scrapy crawl ebay -o products.csv -a search="Xbox one X"
```


