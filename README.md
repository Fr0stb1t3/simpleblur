# Simpleblur  

Micro script that generates a blurred version of an image using a simple averaging algorithm. Once the blur is complete the image is cached in local storage (if it is available), to reduce page load on subsequent requests.
The script works by using a temporary canvas where the image data is altered and then the resulting data uri replaces the src of the target image.
If the image is loaded before trying to apply the blur, the script tries 3 more times after an increasing interval

### Version
0.8


# Usage

simpleblur('.classname'); //or #id
	
	
License
----
MIT