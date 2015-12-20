(function(window) {
    "use strict";
    var GLOB = {};
    /**
	@params:
		#target query
		Scaledown percentage ->   Reduces the size of the temporary canvas, thus the size of the data uri output and image and increases the blurring. DEFAULT 0.05
		blurring_iterations  ->   Adds additional runs to the blurring algorithm. Default 1
		blurring_average scope -> The blur works by setting the pixel to the average of a surrounding grid of pixels. This increases the size of the grid. Default is a grid of 3x3

        Output data uri that replaces the source of the image
	*/
    window.simpleblur = function(target, options) {
        if (typeof(Storage) !== "undefined") {
            GLOB.storageAvailable = true;
        } else {
            GLOB.storageAvailable = false;
        }
        // var start = + new Date();
        var target = target || '#simpleBlurTarget';
        var elements = document.querySelectorAll(target);
        for (var j = 0; j < elements.length; j++) {
            loadFilter(elements[j] , options);
        }
        //var end = +new Date(); // log end timestamp
        //var diff = end - start;
        //console.log('------');
        //console.log('Set for' + target);
        //console.log(diff);
    }
    if ( typeof jQuery !== 'undefined' ){
        jQuery.fn.simpleblur = function(options) {
            if (typeof(Storage) !== "undefined") {
                GLOB.storageAvailable = true;
            } else {
                GLOB.storageAvailable = false;
            }
            return this.each(function(i) {
                loadFilter(this,options);
            });
        }
    }

    function main(img,options) {
        console.log(options);
        var size = options.blurring_average || 4;
        var iterations = options.blurring_iterations || 3;
        var scaledown = options.scaledown_percentage || 0.1;
        var dataUri;
        var key = 'blurImage'+img.src+img.offsetWidth+size+iterations+scaledown;
        if (GLOB.storageAvailable) {
            var stored = localStorage.getItem(key);
            if (typeof stored !== 'undefined' && stored !== null) {
                dataUri = stored
            }
        }
        if (typeof dataUri === 'undefined') {
            var c = document.createElement('canvas');
            var w = img.offsetWidth;
            var h = img.offsetHeight;
            c.setAttribute("width", w * scaledown + "px");
            c.setAttribute("height", h * scaledown + "px");
            c.crossOrigin = "Anonymous";
            var ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0, c.width, c.height);
            var imgData = ctx.getImageData(0, 0, c.width, c.height);
            blurAlg(imgData.data, c.width, iterations, size);
            ctx.putImageData(imgData, 0, 0);
            dataUri = c.toDataURL("image/png");
            if (GLOB.storageAvailable) {
                localStorage.setItem(key, dataUri);
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

    function loadFilter(element,options) {
        if (isImageOk(element)) {
            main(element,options);
        } else {
            var runCount = 0;
            var timerId = setInterval(function() {
                if (isImageOk(element)) {
                    clearInterval(timerId);
                    main(element,options);
                } else {
                    runCount++;
                    if (runCount > 3) clearInterval(timerId);
                }
            }, 25 * runCount);
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