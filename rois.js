

function createLine(viewer,overlay, data) {
    console.log(data);
    var svgNS = 'http://www.w3.org/2000/svg';

    var p1 = viewer.viewport.imageToViewportCoordinates(data.x1, data.y1);
    var p2 = viewer.viewport.imageToViewportCoordinates(data.x2, data.y2);
    var line = document.createElementNS(svgNS, 'line');

    line.setAttribute('x1', p1.x);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('y2', p2.y);

    w = 7
    s1_x = 15 - w*(p2.y - p1.y)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2)
    s1_y = 15 + w*(p2.x - p1.x)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2)

    s2_x = 15 + w*(p2.y - p1.y)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2)
    s2_y = 15 - w*(p2.x - p1.x)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2)

    var line2 = document.createElementNS(svgNS, 'line');

    line2.setAttribute('x1', s1_x);
    line2.setAttribute('x2', s2_x);
    line2.setAttribute('y1', s1_y);
    line2.setAttribute('y2', s2_y);
    line2.setAttribute('stroke', 'rgb(0,0,0)')
    line2.setAttribute('stroke-width', '5')


    /* s3_x = p2.x + w*(p2.y - p1.y)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2)
    s3_y = p2.y - w*(p2.x - p1.x)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2)

    s4_x = p2.x - w*(p2.y - p1.y)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2)
    s4_y = p2.x + w*(p2.x - p1.x)/(Math.sqrt(p2.x - p1.x)**2 + (p2.y - p1.y)**2) */

    var line3 = document.createElementNS(svgNS, 'line');

    line3.setAttribute('x1', s1_x);
    line3.setAttribute('x2', s2_x);
    line3.setAttribute('y1', s1_y);
    line3.setAttribute('y2', s2_y);
    line3.setAttribute('stroke', 'rgb(0,0,0)')
    line3.setAttribute('stroke-width', '5')

    console.log(line2)
    console.log(line2.getAttribute('x1'))

    createPopup(line, data.text);

    svg_container = document.createElementNS(svgNS, 'svg');
    svg_container.setAttribute("width", 30);
    svg_container.setAttribute("height", 30);
    svg_container.setAttribute("class", "tick");

    svg_container2 = document.createElementNS(svgNS, 'svg');
    svg_container2.setAttribute("width", 30);
    svg_container2.setAttribute("height", 30);
    svg_container2.setAttribute("class", "tick");
    

   /*  rect = document.createElementNS(svgNS,"rect");
    rect.setAttribute("height", 20);
    rect.setAttribute("width", 20);
    rect.setAttribute("fill", "red"); */

    //svg_container.appendChild(rect);

    svg_container.appendChild(line2);


    document.getElementById("tickdiv").appendChild(svg_container);


    viewer.addOverlay({
        element: svg_container,
        location: p1,
        placement: 'CENTER'
    });

    svg_container2.appendChild(line3);
    document.getElementById("tickdiv").appendChild(svg_container2);


    viewer.addOverlay({
        element: svg_container2,
        location: p2,
        placement: 'CENTER'
    });

    overlay.node().appendChild(line);
    //overlay.node().appendChild(line2);
    //overlay.node().appendChild(line3);


}
    

function createArrow(viewer, data){
    var arrowdiv = document.getElementById('arrowdiv')
    console.log(data);
    var arrowimg = document.createElement('img')
    arrowimg.setAttribute('src', "Red_Arrow_Down.svg")
    arrowimg.setAttribute('width', '20')
    arrowimg.setAttribute('class', 'arrow')
    arrowdiv.appendChild(arrowimg);
    
    viewer.addOverlay({
        element: arrowimg,
        location: viewer.viewport.imageToViewportCoordinates(data.x,data.y),
        placement: 'BOTTOM',
        checkResize: true});

    new OpenSeadragon.MouseTracker({
        element: arrowimg,
        clickHandler: (evt) => {
            viewer.viewport.panTo(viewer.viewport.imageToViewportCoordinates(data.x,data.y));
            viewer.viewport.zoomTo(9)},
        }).setTracking(true);

       createPopup(arrowimg, data.text);
};

function createBox(viewer, overlay, data){
    var svgNS = 'http://www.w3.org/2000/svg';

    var p1 = viewer.viewport.imageToViewportCoordinates(data.x1, data.y1);
    var p2 = viewer.viewport.imageToViewportCoordinates(data.x2, data.y2);
    
    var box = document.createElementNS(svgNS, 'rect');
    box.setAttribute('x', p1.x);
    box.setAttribute('y', p1.y);
    box.setAttribute('height', p2.x-p1.x);
    box.setAttribute('width', p2.y-p1.y);
    box.setAttribute('fill', 'none');

    createPopup(box, data.text);
   
    overlay.node().appendChild(box);
}

function createPopup(roi, text){
    roi.addEventListener('mouseenter', showPopup);
    roi.addEventListener('mouseleave', hidePopup);

    var popupbox = document.createElement('div');
    popupbox.setAttribute('class', 'popup')
    var newContent = document.createTextNode(text); 
    popupbox.appendChild(newContent);


    function showPopup(evt) {
        console.log(evt.clientX);
        popupbox.style.left = evt.pageX + 'px';
        popupbox.style.top = evt.pageY + 'px';
        //boxdesc.style.zIndex = 10
        popupbox.style.display = "block";
}

    function hidePopup(evt) {
        popupbox.style.display = "none";
    }

    var cdiv = document.getElementById('annotations'); 
    cdiv.append(popupbox);
}

function fetchRois(url){
    fetch(url)
    .then(res => res.json())
    .then(data => {

        document.getElementById("description").textContent = data.description;
        data.rois.forEach(element => {
            switch (element.type){
                case "box":
                    createBox(viewer,overlay,element);
                    break;
                case "arrow":
                    console.log(element);
                    createArrow(viewer,element);
                    break;
                case "line":
                createLine(viewer, overlay, element);
            }
        });
    })
};

function changeImage(name, rois) {
    //clear overlays and popups
    while(overlay.node().firstChild){ overlay.node().removeChild(overlay.node().firstChild)}
    viewer.clearOverlays();
    currentroi = rois;
    viewer.open("/dzis/" + name)
}
