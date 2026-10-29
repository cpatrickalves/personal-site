# Scraping products from etsy.com

This project was built using [Scrapy](https://scrapy.org/) (Scraping and Web Crawling Framework).

It contains a set of Spiders to gather product data from [Etsy Website](https://www.etsy.com).

### Problem

The client needs data from thousands of products of etsy.com to perform data analysis.

### Task

Create an automated and fast solution to navigate the website, find the products by a search text, extract all the data, and save it in a user-friendly format (CSV and XLSX).

### Solution

I've used the Scrapy Web Crawling Framework to build a Python script to search and scrape (extract) the data of products found in Etsy. Data collected: 
*product_id, URL, price, rating, number_of_reviews, product_options, count_of_images, images_urls, favorited_by, store_name*, and *description*. 

### Results

The client was able to quickly download the data in CSV and Excel format of more than 100,000 products from etsy.com.

<img width="1650" alt="output-example" src="https://user-images.githubusercontent.com/22003608/128253964-9d472e5f-5540-413c-b3a2-fe3787b71e43.png">


**The data was used for data analysis and add great value to the client business.**

---
# Source code

The solution is available at Github.

[![github](https://user-images.githubusercontent.com/22003608/127739408-c499e7b2-5a1d-4f44-a028-dc46eb8e900d.jpg)](https://github.com/cpatrickalves/scraping-etsy)

### How to use

You will need Python 3.6+ to run the scripts. Python can be downloaded [here](https://www.python.org/downloads/).

You have to install the Scrapy framework and other required packages:
* In command prompt/Terminal: `pip install -r requirments.txt`

Once you have installed the Scrapy framework, just clone/download this project:

`git clone https://github.com/cpatrickalves/scraping-etsy`

### Usage

#### Spider: search_products.py

This Spider access the Etsy website and search for products based on a given search string.

Supported parameters:
* *search* - set the search string
* *count_max* - limit the number of items/products to be scraped
* *reviews_option* - set the method to get the product's reviews

For example, to search for '3d printed' products go to the project's folder and run:
```
scrapy crawl search_products -a search='3d printed' 
```
To save the results, use -o parameter:
```
scrapy crawl search_products -a search='3d printed' -o products.csv
```
The Spider will create CSV and Excel files.

To limit the number of products scraped, use the *count_max* parameter:
```
scrapy crawl search_products -a search='3d printed' -a count_max=10 -o products.csv
```

The *product reviews* data can be obtained in three ways:
* 1 - Spider will get only the reviews on the product's page, that is, 4 reviews. This is the default and fastest option for scraping.
* 2 - Spider will produce an Ajax request to get all reviews on the product's page (simulate the click in the *+More* button to load more reviews). In this option, the Spider will usually get 10 reviews.
* 3 - Spider will visit the page with all store reviews (click in the *Read All Reviews* button) and get all the reviews for this specific product. As the spider will visit several pages to get the reviews, this is the slower scraping option and there is a chance to get temporarily blocked by Etsy because of the high number of requests.

To choose the option to scraping the reviews use the *-a reviews_option* parameter:
```
scrapy crawl search_products -a search='3d printed' -a reviews_option=3 -o products.csv
```

## Scraping speed

You can change the number of concurrent requests performed by Scrapy in the *setting.py* file.
```
CONCURRENT_REQUESTS = 10
```
Change this if you want to decrease the number of requests to avoid get blocking by Etsy.

If you only need the products URLs, the scraping can be faster, just use the `urls_only` flag:

```
scrapy crawl search_products -a search='xbox controller elite' -o products.csv -a urls_only=true
```

