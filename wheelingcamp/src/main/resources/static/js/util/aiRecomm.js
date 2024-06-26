const origin = document.getElementById('origin');
const destination = document.getElementById('destination');
const letsChabak = document.getElementById('letsChabak');
const respChat = document.getElementById('respChat');
const search = document.getElementById('search');
const recommInfoList = document.getElementById('recommInfoList');
const script = document.createElement('script');

const typeList = [
  { name: 'star', check: document.querySelector('#starBtn') },
  { name: 'night', check: document.querySelector('#nightBtn') },
  { name: 'nature', check: document.querySelector('#natureBtn') },
  { name: 'food', check: document.querySelector('#foodBtn') },
];

var originPoint = { x: '', y: '' }; // 출발지 좌표
var destinationPoint = { x: '', y: '' }; // 도착지 좌표
var waypointList = [];
var recommFlag = false;

//#region Chat GPT

// 사용하는 것은 Chat GPT 의 function calling:
// 기본적인 문자로 반환하는 것도 가능하지만 성공 확률이 100%가 아니다!
// function calling을 통해서 정확도(json 반환) 답변 형식을 정해줘 원하는 형태로 반환 가능
// 답변 예측 가능!

// 발급받은 API키
var apiKey = '';
// OpenAI API 엔드포인트 주소
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
// GPT 입력용 파라미터
const param = {
  type: 'object',
  properties: {
    recommList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description:
              '추천 장소 유형: [카페, 휴게소, 음식점, 관광지, 캠핑지]',
            enum: ['cafe', 'restStop', 'restaurant', 'tourSpot', 'camping'],
          },
          name: {
            type: 'string',
            description: '추천 장소 장소명',
          },
          address: {
            type: 'string',
            description: '추천 장소 도로명주소',
          },
          link: {
            type: 'string',
            description:
              '추천 장소의 홈페이지 주소. 홈페이지가 존재하지 않는다면 해당 장소에 대한 리뷰 사이트 주소, 해당 장소에 대한 간접적인 정보가 담긴 웹 주소',
          },
          info: {
            type: 'string',
            description:
              '추천 장소에 대한 리뷰나 이곳에서만 느낄 수 있는 특별한 경험을 조합하여 해당 장소를 추천한 이유, 혹은 리뷰를 작성해주세요. 마지막 목적지인 캠핑장/차박 장소에 대한 정보는 다른 정보보다 조금 더 상세하게 답변해주세요.',
          },
          x: {
            type: 'number',
            description: '추천 장소의 x 좌표',
          },
          y: {
            type: 'number',
            description: '추천 장소 의 y 좌표',
          },
        },
        required: ['type', 'name', 'address', 'link', 'info', 'x', 'y'],
      },
    },
    reason: {
      type: 'string',
      description:
        '해당 여행 루트에 대한 소개. 추천지들을 관광 루트에 포함시킨 이유들과 여행을 통해 얻을 수 있는 특별한 경험들을 종합하여 150자 이상으로 요약해줘',
    },
  },
  required: ['recommList', 'reason'],
};

// ChatGPT API 요청
async function fetchAIResponse() {
  // 사용자가 입력한 취향 버튼을 바탕으로 파라미터 수정
  let typeStr = '';

  for (let index = 0; index < typeList.length; index++) {
    if (typeList[index].check.checked) {
      typeStr += typeList[index].check.value + ', ';
    }
  }
  if (typeStr != '') {
    typeStr += ' 위주로 추천해주고, ';
  }

  // Chat GPT Key 반환
  await fetch('/returnKey/chatGPTKey')
    .then((resp) => resp.text())
    .then((result) => {
      apiKey = result; // Chat GPT API Key 반환
    });

  // API 요청에 사용할 옵션
  const requestOptions = {
    method: 'POST',
    // API 요청의 헤더를 설정
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    // API 요청 파라미터
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'presume you are a guide recommending places for car camping',
        },
        {
          role: 'user',
          content: `${origin.value}부터 ${destination.value}까지 캠핑 여행 루트를 세워줘. ${typeStr} 목적지는 반드시 차박 가능 장소, 혹은 캠핑장이여야 하며 목적지까지 가는 동안 방문할 수 있는 카페, 음식점, 휴게소, 관광명소를 최소 5개 이상 경로상에 추가해줘(유형 중복 가능)`,
        },
      ],
      // 생성할 함수 스키마
      functions: [
        {
          name: 'trip_assistance',
          description: `recommend me travel spots that i can visit during roadtrip starting from ${origin.value} to ${destination.value}. final destination must be a camping spot and rest of recommended places must be inbetween origin and destination route`,
          // 함수 파라미터
          parameters: param,
        },
      ],
      function_call: { name: 'trip_assistance' },
    }),
  };

  // API 요청후 응답 처리
  try {
    const response = await fetch(apiEndpoint, requestOptions);
    const data = await response.json();
    const answ = data.choices[0].message.function_call.arguments;

    return answ;

    // 오류 발생 시
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error);
    showalERTSDAS();
    location.reload(true);
    return 'OpenAI API 호출 중 오류 발생';
  }
}

//#endregion

//#region Kakao Map

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();
// 마커를 담을 배열입니다
var markers = [];
// 출발, 도착지를 담을 마커
var startMarker = null;
var endMarker = null;

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드 검색을 요청하는 함수입니다
function searchPlaces(keyword) {
  var keyword = document.getElementById('keyword').value;

  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    showalERTSDASFDS();
    return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    showalERTSDAFDFDFSFDS();
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    showalERTSDAFDFDFSFDSFDFDF();
    return;
  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
  var listEl = document.getElementById('placesList'),
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, title) {
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };

      itemEl.onmouseout = function () {
        infowindow.close();
      };
    })(marker, places[i].place_name);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement('li'),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      '<div class="placesName">' +
      places.place_name +
      '</div>';

  if (places.road_address_name) {
    itemStr +=
      '<span class="address">도로명 주소: ' +
      places.road_address_name +
      '</span>' +
      '<span class="address">지번 주소: ' +
      places.address_name +
      '</span>';
  } else {
    itemStr += '<span class="address">' + places.address_name + '</span>';
  }

  itemStr += '<span class="tel">' + places.phone + '</span>';
  itemStr +=
    '<div><button class="originBtn aiBtn">출발지 설정</button><button class="destinationBtn aiBtn">목적지 설정</button></div>' +
    '</div>';

  el.innerHTML = itemStr;
  el.className = 'item';

  // 출발지 도착지 버튼 클릭시 origin destination 값 재설정
  el.querySelector('.originBtn').addEventListener('click', () => {
    document.querySelector('.origin').innerText = places.address_name;
    origin.value = places.address_name;

    startMarker?.setMap(null);
    startMarker = new kakao.maps.Marker({
      position: markers[index].getPosition(),
    });
    startMarker.setMap(map);

    originPoint.x = places.x;
    originPoint.y = places.y;
  });
  el.querySelector('.destinationBtn').addEventListener('click', () => {
    document.querySelector('.destination').innerText = places.address_name;
    destination.value = places.address_name;

    endMarker?.setMap(null);
    endMarker = new kakao.maps.Marker({
      position: markers[index].getPosition(),
    });
    endMarker.setMap(map);

    destinationPoint.x = places.x;
    destinationPoint.y = places.y;
  });

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, type) {
  var imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    };

  // 마커 유형에 따라 이미지 변경
  switch (type) {
    case 'tourSpot':
      var imageSrc = '/images/marker/tourSpot.svg',
        imageSize = new kakao.maps.Size(50, 46),
        imgOptions = {
          spriteSize: new kakao.maps.Size(50, 50),
        };
      break;
    case 'cafe':
      var imageSrc = '/images/marker/cafe.svg',
        imageSize = new kakao.maps.Size(50, 46),
        imgOptions = {
          spriteSize: new kakao.maps.Size(50, 50),
        };
      break;
    case 'restStop':
      var imageSrc = '/images/marker/restStop.svg',
        imageSize = new kakao.maps.Size(50, 46),
        imgOptions = {
          spriteSize: new kakao.maps.Size(50, 50),
        };
      break;
    case 'restaurant':
      var imageSrc = '/images/marker/restaurant.svg',
        imageSize = new kakao.maps.Size(50, 46),
        imgOptions = {
          spriteSize: new kakao.maps.Size(50, 50),
        };
      break;
    case 'camping':
      var imageSrc = '/images/marker/destination.svg',
        imageSize = new kakao.maps.Size(58, 54),
        imgOptions = {
          spriteSize: new kakao.maps.Size(58, 58),
        };
      break;
    default:
      break;
  }

  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById('pagination'),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement('a');
    el.href = '#';
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = 'on';
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

//#endregion

//#region Kakao Mobility

var polyArray = [];
var distanceArray = [];

const strokeColorArray = [
  '#9FDF17',
  '#08C9FF',
  '#A85EF2',
  '#FF77E9',
  '#FE5C5C',
  '#FB975F',
  '#9FDF17',
  '#08C9FF',
  '#A85EF2',
  '#FF77E9',
  '#FE5C5C',
  '#FB975F',
];

const REST_API_KEY = '3f21cdd2349ce2b74e66b6016de75dcc';

// 호출방식의 URL을 입력
const url = 'https://apis-navi.kakaomobility.com/v1/waypoints/directions';

async function getCarDirection(originParam, waypointsParam, destinationParam) {
  // 요청 헤더를 추가합니다.
  const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const requestUrl = `${url}`; // 파라미터까지 포함된 전체 URL

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        origin: originParam,
        destination: destinationParam,
        waypoints: waypointsParam,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 반환 데이터
    const data = await response.json();

    // 기존 폴리라인 존재시 초기화
    for (let index = 0; index < polyArray.length; index++) {
      if (polyArray[index] != undefined) {
        polyArray[index].setMap(null);
      }
    }

    // 기존 거리/소요시간 리스트 존재시 제거
    polyArray = [];
    distanceArray = [];

    // 카카오 맵에서의 경로 좌표 linePath에 추가
    for (
      let index = 0;
      index < Object.keys(data.routes[0].sections).length;
      index++
    ) {
      // 경로 표시를 위한 좌표 저장용 Array
      var linePath = [];

      // 경로 좌표 얻어서 linePath에 추가
      data.routes[0].sections[index].roads.forEach((router) => {
        router.vertexes.forEach((vertex, index) => {
          if (index % 2 === 0) {
            linePath.push(
              new kakao.maps.LatLng(
                router.vertexes[index + 1],
                router.vertexes[index]
              )
            );
          }
        });
      });

      // 거리, 소요시간 정보 추가
      distanceArray.push({
        distance: data.routes[0].sections[index].distance,
        duration: data.routes[0].sections[index].duration,
      });

      // 경로좌표 polyline
      polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: strokeColorArray[index],
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });

      // 새로운 polyline 배열에 삽입
      polyArray.push(polyline);
      polyArray[index].setMap(map);
    }
  } catch (error) {
    showalERCDSFDFDF();
    console.error('Error:', error); // 에러 발생
  }

  for (let index = 0; index < distanceArray.length - 1; index++) {
    let dist = document.createElement('div');
    let distanceStr = distanceArray[index].distance / 1000 + 'km';
    let durationStr = secondsToHms(distanceArray[index].duration);

    dist.innerHTML =
      '<div class="recommDist">' +
      `<div class="distStroke" style="background-color:${strokeColorArray[index]}"></div>` +
      '<div><div class="duration">예상 소요시간: ' +
      durationStr +
      '</div>' +
      '<div class="distance">' +
      distanceStr +
      '</div></div>' +
      '</div>';

    document.querySelector(`.recommPlace${index}`).appendChild(dist);
  }
}

//#endregion

//#region Run

// 채팅 버튼 입력 시
letsChabak.addEventListener('click', () => {
  // 로딩 시작
  startLoading();

  fetchAIResponse()
    .then((resp) => JSON.parse(resp))
    .then((result) => {
      // 기존 마커와 경유지 지우기
      removeMarker();
      markers = [];
      waypointList = [];

      recommInfoList.innerHTML = '';

      console.log(result);
      document.getElementById('recommReview').innerText = result.reason;

      // AI 추천지 목록에 담기
      const recommList = result.recommList;

      // 지도 표시할 새로운 영역 설정
      let bounds = new kakao.maps.LatLngBounds();

      var sel = document.createElement('li');
      var startStr =
        `<div class="recommPlace0">` +
        '<div class="recommInfo">' +
        '<div class="recommName" style="width:100%;text-align:center"> 출발지: ' +
        origin.value +
        '</div>' +
        '</div>' +
        '</div>';
      sel.innerHTML = startStr;
      sel.onmouseover = function () {
        displayInfowindow(marker, '출발지');
      };
      sel.onmouseout = function () {
        infowindow.close();
      };
      recommInfoList.appendChild(sel);

      recommList.forEach((recomm, index) => {
        var el = document.createElement('li'),
          itemStr =
            `<div class="recommPlace${index + 1}">` +
            '<div class="recommInfo">' +
            (index + 1) +
            '. <a href="' +
            recomm.link +
            '" class= "recommName">' +
            recomm.name +
            '</a><span class="recommAddress">' +
            recomm.address +
            '</span>' +
            '<p class="recommDetail">' +
            recomm.info +
            '</p>' +
            '</div>' +
            '</div>';
        el.innerHTML = itemStr;

        // 조회된 결과로 좌표(마커) 만들고 표시
        var placePosition = new kakao.maps.LatLng(recomm.y, recomm.x);
        marker = addMarker(placePosition, index, recomm.type);

        // 마커와 추천지 정보에 마우스 호버 이벤트 추가
        (function (marker, title) {
          kakao.maps.event.addListener(marker, 'mouseover', function () {
            displayInfowindow(marker, title);
          });

          kakao.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
          });

          el.onmouseover = function () {
            displayInfowindow(marker, title);
          };
          el.onmouseout = function () {
            infowindow.close();
          };
        })(marker, recomm.name);

        // 추천지 정보 리스트에 추가
        recommInfoList.appendChild(el);

        // 경유지에 추천지 추가
        waypointList.push({ x: recomm.x, y: recomm.y });

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);
      });

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);

      // 목적지 마커를 추천 목적지로 변경
      endMarker.setMap(null);

      // 차량 경로 설정
      getCarDirection(
        originPoint,
        waypointList,
        waypointList[waypointList.length - 1]
      );

      // 로딩 끝
      endLoading();
    });
});

const startLoading = () => {
  document.querySelector('.loading').style.display = 'flex';
};

const endLoading = () => {
  document.querySelector('.loading').style.display = 'none';
};

// 초를 시간으로 변경
function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + '시간' : '';
  var mDisplay = m > 0 ? m + '분' : '';
  return hDisplay + mDisplay;
}

//#endregion
