# Simpleblur  

Micro script that generates a blurred version of an image using a simple averaging algorithm. Once the blur is complete the image is cached in local storage (if it is available), to reduce page load on subsequent requests.
The script works by using a temporary canvas where the image data is altered and then the resulting data uri replaces the src of the target image.
If the image is loaded before trying to apply the blur, the script tries 3 more times after an increasing interval

### Version
0.9


# Usage

simpleblur('.classname',{options}); //or #id + options if required


$('.classname').simpleblur({options}); // + options if required


## Options
blurring_average - Reduces the size of the temporary canvas, thus the size of the data uri output and image and increases the blurring. DEFAULT 0.1

blurring_iterations - Adds additional runs to the blurring algorithm. Default 4

scaledown_percentage - The blur works by setting the pixel to the average of a surrounding grid of pixels. This increases the size of the grid. Default is a grid of 3x3

License
----
MIT
