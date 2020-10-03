var data = {};
var recommendSorted = [];
var currentDong;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('slider').value = 50;
    var container = document.getElementById('map');
    var options = {
        center: new daum.maps.LatLng(37.551798, 126.986899),
        level: 8
    };
    
    var map = new daum.maps.Map(container, options);

    var infoOverlay = new daum.maps.CustomOverlay({
        xAnchor: 0.5,
        yAnchor: 1
    });

    /* new daum.maps.Marker({
        position: new daum.maps.LatLng(37.564033, 126.984956)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.524141, 127.022394)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.559167, 126.977644)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.562407, 126.978199)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.523827, 126.924771)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.568065, 127.008491)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.571608, 126.976757)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.569170, 126.987996)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.511232, 127.098028)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.575241, 127.012784)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.563555, 126.941994)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.538198, 126.991602)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.498093, 127.028306)
    }).setMap(map);

    new daum.maps.Marker({
        position: new daum.maps.LatLng(37.553039, 126.921573)
    }).setMap(map); */

    axios.get('/adm_dongs').then(function(response) {
        let resultSize = response.data.length;
        for(let key in response.data) {
            let dongData = {
                info: response.data[key],
                color: {r: 0, g: 0, b: 0},
                center: {latitude: 0, longtitude: 0}
            };
    
            axios.get('/borders/' + dongData.info.code).then(function(response) {
                let polygonPath = [];
        
                let latSum = 0;
                let longSum = 0;
                for(let key in response.data) {
                    let item = response.data[key];
                    polygonPath.push(new daum.maps.LatLng(item.latitude, item.longtitude));
                    latSum += item.latitude;
                    longSum += item.longtitude;
                }

                let area = 0;
                for(let i = 0; i < response.data.length; i++) {
                    let v1 = response.data[i];
                    let v2 = response.data[(i + 1) % response.data.length];

                    area += v1.latitude * v2.longtitude - v2.latitude * v1.longtitude;
                }
                area /= 2;

                for(let i = 0; i < response.data.length; i++) {
                    let v1 = response.data[i];
                    let v2 = response.data[(i + 1) % response.data.length];

                    dongData.center.latitude += (v1.latitude + v2.latitude)
                                                * (v1.latitude * v2.longtitude - v2.latitude * v1.longtitude);
                    dongData.center.longtitude += (v1.longtitude + v2.longtitude)
                                                * (v1.latitude * v2.longtitude - v2.latitude * v1.longtitude);
                }

                dongData.center.latitude /= area * 6;
                dongData.center.longtitude /= area * 6;

                //dongData.center.latitude = latSum / response.data.length;
                //dongData.center.longtitude = longSum / response.data.length;
        
                let polygon = new daum.maps.Polygon({
                    path: polygonPath, // 그려질 다각형의 좌표 배열입니다
                    strokeWeight: 3, // 선의 두께입니다
                    strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'longdash', // 선의 스타일입니다
                    fillOpacity: 0.7 // 채우기 불투명도 입니다
                });

                dongData.polygon = polygon;
                data[dongData.info.code] = dongData;

                recolor('t1', dongData);
        
                polygon.setMap(map);
                recommendSorted.push(dongData);
                if(recommendSorted.length == resultSize) {
                    recommendSorted.sort(compareRecommend);
                    for(let i = 1; i <= recommendSorted.length; i++) {
                        let item = document.createElement("li");
                        let slices = recommendSorted[i - 1].info.address.split(" ");
                        item.appendChild(document.createTextNode(slices[slices.length - 1]));
                        document.getElementById("rank").appendChild(item);

                        if(i == 10)
                            break;
                    }
                }

                daum.maps.event.addListener(polygon, 'mouseover', function() {
                    polygon.setOptions({
                        fillOpacity: 0.8,
                        fillColor: rgbToHex(Math.min(dongData.color.r + 100, 255), Math.min(dongData.color.g + 100, 255), Math.min(dongData.color.b + 100, 255))
                    });
                });

                daum.maps.event.addListener(polygon, 'mouseout', function() {
                    polygon.setOptions({
                        fillOpacity: 0.7,
                        fillColor: rgbToHex(dongData.color.r, dongData.color.g, dongData.color.b)
                    });
                });

                let slices = dongData.info.address.split(' ');

                daum.maps.event.addListener(polygon, 'click', function() {
                    if(infoOverlay.getMap() == map && currentDong == dongData.info.code) {
                        infoOverlay.setMap(null);
                        return;
                    }

                    var infoContent = '<div id="info">' +
                        '<div class="body">' +
                        '<h1>' + slices.slice(-1)[0] + '</h1>' +
                        '<table>' +
                        '<tr id="land_price"><th>공시지가</th><td>' + parseInt(dongData.info.t1_raw).toLocaleString() + '원/km²</td></tr>' +
                        '<tr id="life_pop"><th>생활인구-주거인구</th><td>' + parseInt(dongData.info.t2_raw).toLocaleString() + '명/일</td></tr>' +
                        '<tr id="foreigner"><th>단기체류 외국인</th><td>' + parseInt(dongData.info.f1_raw / 820).toLocaleString() + '명/일</td></tr>' +
                        '<tr id="hotels"><th>숙박업소</th><td>' + parseInt(dongData.info.t3_raw).toLocaleString() + '개실</td></tr>' +
                        '</table>' +
                        '</div>' +
                        '<div class="anchor"></div>' +
                        '</div>';

                    infoOverlay.setPosition(new daum.maps.LatLng(dongData.center.latitude, dongData.center.longtitude));
                    infoOverlay.setContent(infoContent);
                    infoOverlay.setMap(map);
                    currentDong = dongData.info.code;
                });
            });
        }
    });
});

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var currentMap = 't1';
function onRadioClick(radio) {
    document.querySelectorAll('#selector li').forEach(function(item) {
        item.classList.remove('selected');
        let parent = radio;
        while(parent = parent.parentNode) {
            if(parent == item) {
                item.classList.add('selected');
                break;
            }
        }
    });

    document.getElementById('slider').value = 50;

    currentMap = radio.value;
    recolorAll(radio.value);
}

function recolorAll(mapType) {
    for(let key in data) {
        recolor(mapType, data[key]);
    }
}

function recolor(mapType, data) {
    let value = data.info[mapType];
    let multiply = 0;
    if(mapType == 'r')
        multiply = 10;
    else if(mapType == 't1')
        multiply = 3;
    else if(mapType == 't2')
        multiply = 1.5;
    else if(mapType == 't3')
        multiply = 10;
    else if(mapType == 'f1')
        multiply = 20
    
    if(mapType == 'r')
        multiply /= Math.pow((document.getElementById('slider').value / 50), 2);
    else
        multiply *= Math.pow((document.getElementById('slider').value / 50), 2);
    value *= multiply;

    data.color.r = Math.max(Math.min(parseInt(510 * value), 255), 0);
    data.color.g = Math.max(Math.min(510 - parseInt(510 * value), 255), 0);
    if(mapType == 'r') {
        let temp = data.color.r;
        data.color.r = data.color.g;
        data.color.g = temp;
    }
    let color = rgbToHex(data.color.r, data.color.g, data.color.b);
    data.polygon.setOptions({
        strokeColor: color,
        fillColor: color
    });
}

function compareRecommend(a, b) {
    if(a.info.r > b.info.r)
        return -1;
    else if(a.info.r < b.info.r)
        return 1;
    return 0;
}
