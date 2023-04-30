'use strict';

let customRatio = true;

// aspect       0      1      2      3       4
let ratios = ['0:0', '4:3', '16:9', '1:1', '1:2'];
let aspect = 2;

let ratio = getAspectRatio();

function getAspectRatio() {
    customRatio = aspect == 0 ? true : false;
    var ratio = ratios[aspect].split(':');
    return ratio[1] / ratio[0];
}

function setAspectRatio(i) {
    aspect = i;
    ratio = getAspectRatio();
    resizeVideoMedia();
}

function Area(Increment, Count, Width, Height, Margin = 10) {
    ratio = customRatio ? 0.75 : ratio;
    let i = 0;
    let w = 0;
    let h = Increment * ratio + Margin * 2;
    while (i < Count) {
        if (w + Increment > Width) {
            w = 0;
            h = h + Increment * ratio + Margin * 2;
        }
        w = w + Increment + Margin * 2;
        i++;
    }
    if (h > Height) return false;
    else return Increment;
}

function resizeVideoMedia() {
    let Margin = 5;
    let videoMediaContainer = document.getElementById('videoMediaContainer');
    let Cameras = document.getElementsByClassName('Camera');
    let Width = videoMediaContainer.offsetWidth - Margin * 2;
    let Height = videoMediaContainer.offsetHeight - Margin * 2;
    let max = 0;
    let optional = isHideMeActive ? 1 : 0;
    let isOneVideoElement = videoMediaContainer.childElementCount - optional == 1 ? true : false;
    let isTwoVideoElement = videoMediaContainer.childElementCount - optional == 2 ? true : false;
    //console.log('videoMediaContainer.childElementCount: ', videoMediaContainer.childElementCount - optional);

    // full screen mode
    let bigWidth = Width * 4;
    if (videoMediaContainer.childElementCount - optional == 1) {
        Width = Width - bigWidth;
    }

    // loop (i recommend you optimize this)
    let i = 1;
    while (i < 5000) {
        let w = Area(i, Cameras.length, Width, Height, Margin);
        if (w === false) {
            max = i - 1;
            break;
        }
        i++;
    }

    max = max - Margin * 2;
    let max2Height = null;
    if (isTwoVideoElement) max2Height = Height * 0.68;
    setWidth(Cameras, max, bigWidth, Margin, Height, isOneVideoElement, max2Height + 'px');
    document.documentElement.style.setProperty('--vmi-wh', max / 3 + 'px');
}

function setWidth(Cameras, width, bigWidth, margin, maxHeight, isOneVideoElement, max2Height) {
    ratio = customRatio ? 0.68 : ratio;
    console.log(width, ratio, customRatio);
    for (const element of Cameras) {
        element.style.width = width + 'px';
        element.style.margin = margin + 'px';
        element.style.height = max2Height > 0 ? max2Height : width * ratio + 'px';
        if (isOneVideoElement) {
            element.style.width = bigWidth + 'px';
            element.style.height = bigWidth * ratio + 'px';
            let camHeigh = element.style.height.substring(0, element.style.height.length - 2);
            if (camHeigh >= maxHeight) element.style.height = maxHeight - 2 + 'px';
        }
    }
}

window.addEventListener(
    'load',
    function (event) {
        resizeVideoMedia();
        window.onresize = resizeVideoMedia;
    },
    false,
);
