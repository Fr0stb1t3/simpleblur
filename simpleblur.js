(function(window) {
    "use strict";
    var GLOB = {};
    /**
	Overview of functionality. The script works by using a temporary canvas where the image data is altered and then the resulting data uri replaces the src of the target image.
	Make sure that the image is loaded before trying to blur blurring
	@params:
		#target query
		Scaledown percentage ->   Reduces the size of the temporary canvas, thus the size of the data uri output and image and increases the blurring. DEFAULT 0.05
		Blurring iterations  ->   Adds additional runs to the blurring algorithm. Default 1
		Blurring average scope -> The blur works by setting the pixel to the average of a surrounding grid of pixels. This increases the size of the grid. Default is a grid of 3x3
		
	Output data uri that replaces the source of the image
	 
	*/
    window.simpleblur = function(target, options) {
        if (typeof(Storage) !== "undefined") {
            GLOB.storageAvailable = true;
        } else {
            GLOB.storageAvailable = false;
        }
        var start = +new Date();
        var target = target || '#simpleBlurTarget';
        var elements = document.querySelectorAll(target);
        for (var j = 0; j < elements.length; j++) {
            loadFilter(elements[j]);
        }
        var end = +new Date(); // log end timestamp
        var diff = end - start;
        console.log('------');
        console.log('Set for' + target);
        console.log(diff);
    }

    function main(element) {
        var img = element;
        var dataUri;
        if (GLOB.storageAvailable) {
            var stored = localStorage.getItem("blurImage");
            if (typeof stored !== 'undefined' && stored !== null) {
                //dataUri = stored
            }
        }
        if (typeof dataUri === 'undefined') {
            var size = 4;
            var iterations = 3;
            var c = document.createElement('canvas');
            var w = img.offsetWidth;
            var h = img.offsetHeight;
            c.setAttribute("width", w * 0.1 + "px");
            c.setAttribute("height", h * 0.1 + "px");
            c.crossOrigin = "Anonymous";
            var ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0, c.width, c.height);
            var imgData = ctx.getImageData(0, 0, c.width, c.height);
            blurAlg(imgData.data, c.width, iterations, size);
            ctx.putImageData(imgData, 0, 0);
            dataUri = c.toDataURL("image/png");
            if (GLOB.storageAvailable) {
                localStorage.setItem("blurImage", dataUri);
            }
        }
        img.src = dataUri;
    }

    function blurAlg(imgData, w, iterations, size) {
        var data = imgData;
        for (var j = 0; j < iterations; j++) {
            for (var i = 0; i < imgData.length; i += 4) {
                imgData[i] = averageChannelSum(i, data, w, size);
                imgData[i + 1] = averageChannelSum(i + 1, data, w, size);
                imgData[i + 2] = averageChannelSum(i + 2, data, w, size);
            }
        }
        imgData = data;
    }

    function averageChannelSum(i, data, w, size) {
        var start = -Math.floor(size / 2);
        var sum = 0;
        for (var j = start; j < size + start; j++) {
            for (var k = start; k < size + start; k++) {
                sum = sum + (data[(i + (j * 4 * w) + (4 * k))] || data[i]);
            }
        }
        return sum / (size * size);
    }

    function loadFilter(element) {
        if (isImageOk(element)) {
            main(element);
        } else {
            var runCount = 0;
            var timerId = setInterval(function() {
                if (isImageOk(element)) {
                    clearInterval(timerId);
                    main(element);
                } else {
                    runCount++;
                    if (runCount > 3) clearInterval(timerId);
                }
            }, 50 * runCount);
        }
    }

    function isImageOk(img) {
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
            return false;
        }
        return true;
    }
})(window);