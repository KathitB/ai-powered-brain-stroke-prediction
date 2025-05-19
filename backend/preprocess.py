import cv2
import numpy as np
import pandas as pd

def preprocess_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (128, 128))
    img = img / 255.0
    img = np.expand_dims(img, axis=(0, -1))
    return img

def preprocess_stats(data):
    df = pd.DataFrame([data])
    df = df.drop(columns=["id"], errors="ignore")  # Remove ID if present
    return df
