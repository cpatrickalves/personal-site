# Scraping and Analyzing data from Yelp

[Yelp](https://www.yelp.com) is a web application created to connect people with great local businesses.
It is useful for finding restaurants, bars, and various types of services.
The site features reviews of an active and well-informed local community.

In this post, I'll describe a scraping script that extracts information about the restaurants in San Francisco from Yelp.

Also, I present a data cleaning process and data analysis of restaurants by location.

### Scraping data from yelp.com using requests and BeautifulSoup

In this scraping script, I will take the following information for each San Francisco's restaurant:

* name
* neighborhood
* address
* phone
* reviews

Below you see the script used to scrape the data from Yelp. 
Check the comments in each line to get an understanding of how it works.

```python
# Import packages
import requests
from bs4 import BeautifulSoup

# Request header
headers = {"User-Agent": "Chrome/68.0.3440.106"}

# Request parameters
parameters = {
    'find_desc': 'Restaurants',
    'find_loc':'San Francisco CA',
    'start':'0'}

# Yelp search URL
url='https://www.yelp.com/search'

# Get the number of pages return by request (Ex: 'Page 1 of 34') 
# Each page shows 30 items
response = requests.get(url, params=parameters)
# Create BeautifulSoup Object
soup = BeautifulSoup(response.text, 'html.parser')
# Extract the number of pages
string_pages = soup.findAll('div', attrs={'class':'page-of-pages arrange_unit arrange_unit--fill'})[0].text
number_of_pages = int(string_pages.split('of ')[1])

# Variable that stores the data
data = []

# Start page
pagination = 0

# For each pagination extract the items
for i in range(number_of_pages):

    # Produces the request and saves the response
    response=requests.get(url, params=parameters)
    # Create a Soup object
    soup = BeautifulSoup(response.text, 'html.parser')

    # count 30 pages
    #count = 1

    print('Extract data ... page {} from {}'.format(int(pagination/30)+1, number_of_pages))

    # Extract the info
    for a in soup.findAll('div', attrs={'class':'media-story'}):

        # Validate if the info exists
        try:
            address = a.find('address').text.strip()
        except:
            address = ''

        try:
            name = a.find('a', attrs={'class':'biz-name js-analytics-click'}).text
        except:
            name = ''

        try:
            reviews = a.find('span', attrs={'class':'review-count rating-qualifier'}).text.strip().split()[0]
        except:
            reviews = ''

        try:
            phone = a.find('span', attrs={'class':'biz-phone'}).text.strip()
        except:
            phone = ''

        try: 
            neighborhood = a.find('span', attrs={'class':'neighborhood-str-list'}).text.strip()
        except:
            neighborhood = ''

        # Saves info in a dictionary
        info = {
        'name' : name,
        'reviews' : reviews,
        'phone' : phone,
        'address' : address,
        'neighborhood' : neighborhood
        }
        # saves dictionary in the data variable
        data.append(info)

        # Each page shows 30 items, but the Soup Object find more (garbage)
        # To avoid some errors in processing, This code guarantees that only 30 items will be scraped
        #count += 1
        #if count == 30: break

    # Increment the start item ID (pagination)
    pagination+=30
    parameters['start'] = pagination
```

    Extract data ... page 1 from 34
    Extract data ... page 2 from 34
    Extract data ... page 3 from 34
    Extract data ... page 4 from 34
    Extract data ... page 5 from 34
    Extract data ... page 6 from 34
    Extract data ... page 7 from 34
    Extract data ... page 8 from 34
    Extract data ... page 9 from 34
    Extract data ... page 10 from 34
    Extract data ... page 11 from 34
    Extract data ... page 12 from 34
    Extract data ... page 13 from 34
    Extract data ... page 14 from 34
    Extract data ... page 15 from 34
    Extract data ... page 16 from 34
    Extract data ... page 17 from 34
    Extract data ... page 18 from 34
    Extract data ... page 19 from 34
    Extract data ... page 20 from 34
    Extract data ... page 21 from 34
    Extract data ... page 22 from 34
    Extract data ... page 23 from 34
    Extract data ... page 24 from 34
    Extract data ... page 25 from 34
    Extract data ... page 26 from 34
    Extract data ... page 27 from 34
    Extract data ... page 28 from 34
    Extract data ... page 29 from 34
    Extract data ... page 30 from 34
    Extract data ... page 31 from 34
    Extract data ... page 32 from 34
    Extract data ... page 33 from 34
    Extract data ... page 34 from 34


Here is some part of the data extract:


```python
data[:5]
```




    [{'name': 'Little Baobab',
      'reviews': '544',
      'phone': '(415) 643-3558',
      'address': '3380 19th St',
      'neighborhood': 'Mission'},
     {'name': 'The House',
      'reviews': '4354',
      'phone': '(415) 986-8612',
      'address': '1230 Grant Ave',
      'neighborhood': 'North Beach/Telegraph Hill'},
     {'name': 'Fog Harbor Fish House',
      'reviews': '4517',
      'phone': '(415) 421-2442',
      'address': 'Pier 39',
      'neighborhood': "Fisherman's Wharf"},
     {'name': 'Gary Danko',
      'reviews': '4874',
      'phone': '(415) 749-2060',
      'address': '800 N Point St',
      'neighborhood': 'Russian Hill'},
     {'name': 'Marlowe',
      'reviews': '2485',
      'phone': '(415) 777-1413',
      'address': '500 Brannan St',
      'neighborhood': 'Mission Bay'}]



Now let's convert the data to a DataFrame object:


```python
from pandas import DataFrame

restaurants = DataFrame(data)
```

The results are:


```python
# Show the ten firsts items
restaurants.head(10)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>address</th>
      <th>name</th>
      <th>neighborhood</th>
      <th>phone</th>
      <th>reviews</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1230 Grant Ave</td>
      <td>The House</td>
      <td>North Beach/Telegraph Hill</td>
      <td>(415) 986-8612</td>
      <td>4354</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Pier 39</td>
      <td>Fog Harbor Fish House</td>
      <td>Fisherman's Wharf</td>
      <td>(415) 421-2442</td>
      <td>4517</td>
    </tr>
    <tr>
      <th>3</th>
      <td>800 N Point St</td>
      <td>Gary Danko</td>
      <td>Russian Hill</td>
      <td>(415) 749-2060</td>
      <td>4874</td>
    </tr>
    <tr>
      <th>4</th>
      <td>500 Brannan St</td>
      <td>Marlowe</td>
      <td>Mission Bay</td>
      <td>(415) 777-1413</td>
      <td>2485</td>
    </tr>
    <tr>
      <th>5</th>
      <td>3870 17th St</td>
      <td>Frances</td>
      <td>Castro</td>
      <td>(415) 621-3870</td>
      <td>1416</td>
    </tr>
    <tr>
      <th>6</th>
      <td>974 Valencia St</td>
      <td>Loló</td>
      <td>Mission</td>
      <td>(415) 643-5656</td>
      <td>1868</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1382 9th Ave</td>
      <td>Ushi Taro</td>
      <td>Inner Sunset</td>
      <td>(415) 702-6014</td>
      <td>39</td>
    </tr>
    <tr>
      <th>8</th>
      <td>652 Polk St</td>
      <td>Brenda’s French Soul Food</td>
      <td>Tenderloin</td>
      <td>(415) 345-8100</td>
      <td>9545</td>
    </tr>
    <tr>
      <th>9</th>
      <td>1782 Haight St</td>
      <td>What The Cluck SF</td>
      <td>The Haight</td>
      <td>(415) 702-6777</td>
      <td>53</td>
    </tr>
  </tbody>
</table>
</div>



### Data Cleaning

Before saves the data into a file, let's check if there is any null, empty or duplicate value:


```python
# Check if there is any null value in DataFrame
restaurants.isnull().any().any()
```




    False




```python
# Check if there is any empty value in DataFrame
no_address = len(restaurants[restaurants['address'] == ''])
no_name = len(restaurants[restaurants['name'] == ''])
no_neighborhood = len(restaurants[restaurants['neighborhood'] == ''])
no_phone = len(restaurants[restaurants['phone'] == ''])
no_reviews = len(restaurants[restaurants['reviews'] == ''])

print('Column \t\t empty values')
print('address \t ', no_address)
print('name \t\t ', no_name)
print('neighborhood \t ', no_neighborhood)
print('phone \t\t ', no_phone)
print('reviews \t ', no_reviews)
```

    Column 		 empty values
    address 	  122
    name 		  99
    neighborhood 	  106
    phone 		  119
    reviews 	  99


As presented above, there is a lot of empty values in the data. This happens because the Yelp site does not have all the information for some restaurants.

Let's remove these items:


```python
restaurants = restaurants[restaurants['address'] != '']
restaurants = restaurants[restaurants['name'] != '']
restaurants = restaurants[restaurants['neighborhood'] != '']
restaurants = restaurants[restaurants['phone'] != '']
restaurants = restaurants[restaurants['reviews'] != '']
```


```python
# Check if there is any duplicate value in DataFrame
restaurants[restaurants.duplicated()]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>address</th>
      <th>name</th>
      <th>neighborhood</th>
      <th>phone</th>
      <th>reviews</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>34</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>68</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>102</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>136</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>170</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>204</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>238</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>272</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>273</th>
      <td>600 Guerrero St</td>
      <td>Tartine Bakery &amp; Cafe</td>
      <td>Mission</td>
      <td>(415) 487-2600</td>
      <td>7295</td>
    </tr>
    <tr>
      <th>306</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>340</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>374</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>408</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>409</th>
      <td>903 Cortland Ave</td>
      <td>Nute’s</td>
      <td>Bernal Heights</td>
      <td>(415) 260-0192</td>
      <td>127</td>
    </tr>
    <tr>
      <th>442</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>476</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>510</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>544</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>578</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>579</th>
      <td>3673 Sacramento St</td>
      <td>Magic Flute Ristorante</td>
      <td>Presidio Heights</td>
      <td>(415) 922-1225</td>
      <td>510</td>
    </tr>
    <tr>
      <th>612</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>646</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>680</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>681</th>
      <td>3435 Mission St</td>
      <td>El Buen Comer</td>
      <td>Bernal Heights</td>
      <td>(415) 817-1542</td>
      <td>232</td>
    </tr>
    <tr>
      <th>714</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>748</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>782</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>816</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>850</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>884</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>918</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>952</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>986</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>1020</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>1054</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>1088</th>
      <td>3380 19th St</td>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
  </tbody>
</table>
</div>



So there are various duplicated items. Most of them are about the *Little Baobab* restaurant, this happens because Yelp can promote some restaurants (Advertisement), so these promoted restaurants are shown on all pages,  and the scraping script captures them several times.

Let's remove duplicate items:


```python
restaurants.drop_duplicates(inplace=True)
```

For a better presentation, let's change the order of the columns in our dataset.


```python
restaurants = restaurants[['name', 'neighborhood', 'address', 'phone', 'reviews']]
restaurants.head(5)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>name</th>
      <th>neighborhood</th>
      <th>address</th>
      <th>phone</th>
      <th>reviews</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Little Baobab</td>
      <td>Mission</td>
      <td>3380 19th St</td>
      <td>(415) 643-3558</td>
      <td>544</td>
    </tr>
    <tr>
      <th>1</th>
      <td>The House</td>
      <td>North Beach/Telegraph Hill</td>
      <td>1230 Grant Ave</td>
      <td>(415) 986-8612</td>
      <td>4354</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Fog Harbor Fish House</td>
      <td>Fisherman's Wharf</td>
      <td>Pier 39</td>
      <td>(415) 421-2442</td>
      <td>4517</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Gary Danko</td>
      <td>Russian Hill</td>
      <td>800 N Point St</td>
      <td>(415) 749-2060</td>
      <td>4874</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Marlowe</td>
      <td>Mission Bay</td>
      <td>500 Brannan St</td>
      <td>(415) 777-1413</td>
      <td>2485</td>
    </tr>
  </tbody>
</table>
</div>



In the end, we have 949 restaurants in our dataset.

The last step is to convert the columns to the correct type.


```python
restaurants.dtypes
```




    name            object
    neighborhood    object
    address         object
    phone           object
    reviews         object
    dtype: object



We can see that the ***reviews*** column is treated as a string type (object), let's convert it to a numeric type (int):


```python
restaurants['reviews'] = restaurants['reviews'].astype(int)
restaurants.dtypes
```




    name            object
    neighborhood    object
    address         object
    phone           object
    reviews          int32
    dtype: object



Finally, let's save the data into a CSV file:


```python
restaurants.to_csv('datasets/yelp_restaurants_sanFranscisco.csv', index=False)
```

# Data Analysis

Now I present a simple analysis of the restaurant's data.

### Top 10 reviewed restaurants

Let's see the ten restaurants with more reviews:


```python
import matplotlib.pyplot as plt
import numpy as np
% matplotlib inline

# Get top 10 restaurants
top10 = restaurants[['name', 'reviews']].sort_values('reviews',ascending=False).head(10).sort_values('reviews')

# Plot 
top10.plot.barh(legend=False)
plt.yticks(np.arange(10), top10.name.values)
plt.ylabel('RESTAURANT')
plt.xlabel('REVIEWS')
plt.show()
```


![output_26_0](https://user-images.githubusercontent.com/22003608/127739346-465fbddd-b6cf-42ad-9478-ee58cb4096fb.png)


*Brenda's French Soul Food* is the restaurant with more reviews.

### Neighborhood with more restaurants

Let's take the 10 neighborhoods with more restaurants in San Francisco.


```python
top_neighbor = restaurants['neighborhood'].value_counts().head(10)
top_neighbor.plot.barh(figsize=(7,5))
plt.xlabel('NUMBER OF RESTAURANTS')
plt.ylabel('NEIGHBORHOOD')
plt.show()
```


![output_29_0](https://user-images.githubusercontent.com/22003608/127739343-810b5fdf-56b3-4954-8321-cd3ede6f09e0.png)


The *Mission* is a neighborhood with more restaurants. 

But if we consider all restaurants, the proportion (%) is:


```python
(restaurants['neighborhood'].value_counts(normalize=True).head(10)*100).plot.barh(figsize=(7,5))
plt.xlabel('PROPORTION (%)')
plt.ylabel('NEIGHBORHOOD')
plt.show()
```


![output_31_0](https://user-images.githubusercontent.com/22003608/127739345-f310c46f-3187-4940-a6e9-4e77b0e0b388.png)


# Conclusions

In this post, I've described a scraping script for yelp.com, followed by data cleaning and analysis procedures.

These tasks could be done for any other type of information from Yelp.

### Source code

The source code is available at Github.

[![github](https://user-images.githubusercontent.com/22003608/127739408-c499e7b2-5a1d-4f44-a028-dc46eb8e900d.jpg)](https://github.com/cpatrickalves/scraping-examples/blob/master/yelp.ipynb)
