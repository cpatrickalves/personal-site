# Real-time face detection

In this project, I've to use OpenCV and Viola-Jones Algorithm to build a simple face detection system that works in real-time.

#### Problem

I need to detect faces on images and from a webcam in real-time.

#### Task

Build an algorithm or machine learning model to detect faces on images.

#### Solution

I've used Python, OpenCV, and the [Viola-Jones Algorithm](https://en.wikipedia.org/wiki/Viola%E2%80%93Jones_object_detection_framework) to build a solution to detect faces fast.

### Results

The solution has good accuracy and can detect faces really fast.

---

# How to use it

To detect the face the software uses the Haar-like features with the help of the *haarcascade_eye.xml* and *haarcascade_frontalface_default.xml* files.

### Prerequisites

To run this code, download Python 3 from [Python.org](https://www.python.org/). 

After installing Python, add the required package using pip installer:

```
pip install -r requirements.txt
```

Then, clone the GitHub repository:

```
git clone https://github.com/cpatrickalves/cv-realtime-face-detection
```


### Usage

To run the detection in real-time using the webcam, run:

```
python face_recognition.py
```

To perform the face detection on an image, just add the file name as an argument:

```
python face_recognition.py -f image.jpg
```

The script will create an output with a similar name. It with add the *_output* in the file name (ex: image_output.jpg)

Add the `-s` flag to perform smile detection.

#### Example

<img src="https://user-images.githubusercontent.com/22003608/82897863-b27bef00-9f2e-11ea-983e-cec5fff8bc15.jpg" width=500>

---

## Web application

You can also run this script as an [Streamlit](https://www.streamlit.io/) application:
```
streamlit run app.py
```
It will automatically open the browser and show the app.

![webapp.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1628343649977/iACQevF5E.png)

## Built With
* [Python](https://www.python.org/) - Programming Language.
* [OpenCV](https://opencv.org/) - Open Computer Vision Library.
* [Streamlit](https://www.streamlit.io/) - Open-source app framework for Machine Learning and Data Science teams.

---

# Source code

The source code is available at Github.

[![github](https://user-images.githubusercontent.com/22003608/127739408-c499e7b2-5a1d-4f44-a028-dc46eb8e900d.jpg)](https://github.com/cpatrickalves/cv-realtime-face-detection)


