// 화면 새로고침 함수
const redirect = () => {
  fetch("/interest/interestList", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ memberNo: memberNo }),
  })
    .then((resp) => resp.json())
    .then((result) => {
      // 차 대여 목록
      const rentalCarList = document.querySelector(".rentalCarList");
      rentalCarList.innerHTML = "";

      // 상품 대여 목록
      const rentalItemList = document.querySelector(".rentalItemList");
      rentalItemList.innerHTML = "";

      // 구매 목록
      const shoppingItemList = document.querySelector(".shoppingItemList");
      shoppingItemList.innerHTML = "";

      // 렌탈 차량이 비어 있을 때

      if (result.rentalCarList.length == 0) {
        const emptyHtml = `
          <div class="interest-none">
            <i class="fa-solid fa-heart"></i>
            <span>관심 대여 차량이 비었습니다.</span>
          </div>
        `;
        rentalCarList.innerHTML = emptyHtml;
      } else {
        // 렌탈 목록이 있을 때
        result.rentalCarList.forEach((rental) => {
          const rentalCarHtml = `
            <div class="rental-div-item">
              <div class="rental-div-item-checkbox">
                <input type="checkbox" checked class="rental-car-check" value="${rental.itemNo}" />
              </div>
              <div class="rental-div-item-img">
                <div class="rental-div-item-img-div">
                  <img src="/images/sample/profileImg.png" class="cart-img" />
                  <i class="fa-regular fa-heart"></i>
                </div>
              </div>
              <div class="rental-div-item-info">
                <div class="rental-div-item-name">
                  <div class="rental-div-item-name-div">
                    <span class="item-name">${rental.itemName}</span>
                    <span class="item-price rental-item-price">${rental.price}원</span>
                  </div>
                </div>
                <div class="rental-div-item-count">
                  <div class="rental-div-item-count-div">
                    <button class="rentalCarAppendBtn appendBtn">
                        장바구니 담기
                    </button>
                  </div>
                </div>
                <button class="rental-div-item-close rental-car-close">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          `;
          rentalCarList.innerHTML += rentalCarHtml;
        });
      }

      // 대여 상품 목록이 비어 있을 때
      if (result.rentalItemList.length == 0) {
        const emptyHtml = `
      <div class="interest-none">
        <i class="fa-solid fa-heart"></i>
        <span>관심 대여 차량이 비었습니다.</span>
      </div>
    `;
        rentalItemList.innerHTML = emptyHtml;
      } else {
        // 렌탈 목록이 있을 때
        result.rentalItemList.forEach((rental) => {
          const rentalItemHtml = `
        <div class="rental-div-item">
          <div class="rental-div-item-checkbox">
            <input type="checkbox" checked class="rental-item-check" value="${rental.itemNo}" />
          </div>
          <div class="rental-div-item-img">
            <div class="rental-div-item-img-div">
              <img src="/images/sample/profileImg.png" class="cart-img" />
              <i class="fa-regular fa-heart"></i>
            </div>
          </div>
          <div class="rental-div-item-info">
            <div class="rental-div-item-name">
              <div class="rental-div-item-name-div">
                <span class="item-name">${rental.itemName}</span>
                <span class="item-price rental-item-price">${rental.price}원</span>
              </div>
            </div>
            <div class="rental-div-item-count">
              <div class="rental-div-item-count-div">
                <button class="rentalItemAppendBtn appendBtn">
                    장바구니 담기
                </button>
              </div>
            </div>
            <button class="rental-div-item-close rental-item-close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      `;
          rentalItemList.innerHTML += rentalItemHtml;
        });
      }

      // 쇼핑 목록이 비어 있을 때
      if (result.shoppingItemList.length == 0) {
        const emptyHtml = `
          <div class="interest-none">
            <i class="fa-solid fa-heart"></i>
            <span>관심 구매 상품이 비었습니다.</span>
          </div>
        `;
        shoppingItemList.innerHTML = emptyHtml;
      } else {
        // 쇼핑 목록이 있을 때
        result.shoppingItemList.forEach((shopping) => {
          const shoppingItemHtml = `
            <div class="rental-div-item">
              <div class="rental-div-item-checkbox">
                <input type="checkbox" checked class="shopping-item-check" value="${shopping.itemNo}" />
              </div>
              <div class="rental-div-item-img">
                <div class="rental-div-item-img-div">
                  <img src="/images/sample/profileImg.png" class="cart-img" />
                  <i class="fa-regular fa-heart"></i>
                </div>
              </div>
              <div class="rental-div-item-info">
                <div class="rental-div-item-name">
                  <div class="rental-div-item-name-div">
                    <span class="item-name">${shopping.itemName}</span>
                    <span class="item-price shopping-item-price">${shopping.price}원</span>
                  </div>
                </div>
                <div class="rental-div-item-count">
                  <div class="rental-div-item-count-div">
                    <button class="shoppingItemAppendBtn appendBtn">
                        장바구니 담기
                    </button>
                  </div>
                </div>
                <button class="rental-div-item-close shopping-item-close">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          `;
          shoppingItemList.innerHTML += shoppingItemHtml;
        });
      }

      allFunc();
    });
};

// 전체 체크 함수
const allCheck = (clickElement, items) => {
  // 전체 체크하는 요소의 체크 여부에 따라 check 변수에 저장
  clickElement.addEventListener("click", () => {
    let check = clickElement.checked ? true : false;

    items.forEach((item) => {
      item.checked = check;
    });
  });
};

// 개별 체크 함수
const soloCheck = (allCheck, clickChecks) => {
  clickChecks.forEach((check) => {
    check.addEventListener("click", () => {
      let test = true;
      // 상품 체크 리스트 확인
      clickChecks.forEach((ch) => {
        if (!ch.checked) {
          test = false;
        }
      });

      if (!test) {
        allCheck.checked = false;
        return;
      }
      allCheck.checked = true;
    });
  });
};

// 상품 삭제 함수
const deleteItem = (itemNo, type) => {
  const obj = {
    itemNo: itemNo,
    type: type,
  };

  fetch("/interest/itemDelete", {
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
    body: JSON.stringify(obj),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result > 0) {
        console.log("삭제 확인");
      } else {
        console.log("삭제 확인 중 에러 발생  " + result);
      }
    });
};

// 삭제 버튼 이벤트
const deleteClick = (closes, itemNo, type) => {
  closes.forEach((close, index) => {
    close.addEventListener("click", () => {
      let answer = confirm("정말 삭제하시겠습니까?");

      if (answer) {
        deleteItem(itemNo[index].value, type);
        alert("장바구니에서 삭제되었습니다.");

        // 삭제 후 새로고침 함수
        redirect();
      }
    });
  });
};

// 장바구니 추가 이벤트
const appendCart = (appendBtn, checks, type) => {
  appendBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const obj = {
        memberNo: memberNo,
        itemNo: checks[index].value,
        type: type,
      };

      fetch("/cart/appendCart", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(obj),
      })
        .then((resp) => resp.text())
        .then((result) => {
          if (result > 0) {
            alert("상품을 장바구니에 추가했습니다.");

            let answer = confirm(
              "장바구니에 추가한 뒤, 관심 상품에서 삭제하시겠습니까?"
            );
            if (answer) {
              // 삭제하는 함수
            }
          } else {
            console.log("추가 실패.. " + result);
          }
        });
    });
  });
};

// 전체 기능 부여하는 함수
const allFunc = () => {
  // 대여 차
  const rentalCarAllCheck = document.querySelector(".rental-car-all-check"); // 대여상품 전체 체크
  const rentalCarCheckes = document.querySelectorAll(".rental-car-check"); // 대여상품 개별 체크

  // 대여 상품
  const rentalItemAllCheck = document.querySelector(".rental-item-all-check"); // 대여상품 전체 체크
  const rentalItemCheckes = document.querySelectorAll(".rental-item-check"); // 대여상품 개별 체크

  // 구매 상품
  const shoppingItemAllCheck = document.querySelector(
    ".shopping-item-all-check"
  ); // 구매상품 전체 체크
  const shoppingItemCheckes = document.querySelectorAll(".shopping-item-check"); // 구매상품 개별 체크

  // 삭제 버튼
  const rentalCarCloses = document.querySelectorAll(".rental-car-close"); // 대여 차 삭제 버튼
  const rentalItemCloses = document.querySelectorAll(".rental-item-close"); // 대여 상품 삭제 버튼
  const shoppingItemCloses = document.querySelectorAll(".shopping-item-close"); // 구매 삭제 버튼

  // 장바구니 담기 버튼
  const rentalCarAppendBtn = document.querySelectorAll(".rentalCarAppendBtn");
  const rentalItemAppendBtn = document.querySelectorAll(".rentalItemAppendBtn");
  const shoppingItemAppendBtn = document.querySelectorAll(
    ".shoppingItemAppendBtn"
  );

  // 전체 체크 함수
  allCheck(rentalCarAllCheck, rentalCarCheckes); // 대여 차
  allCheck(rentalItemAllCheck, rentalItemCheckes); // 대여 상품
  allCheck(shoppingItemAllCheck, shoppingItemCheckes); // 구매 상품

  // 개별 체크 함수
  soloCheck(rentalCarAllCheck, rentalCarCheckes); // 대여 차
  soloCheck(rentalItemAllCheck, rentalItemCheckes); // 대여 상품
  soloCheck(shoppingItemAllCheck, shoppingItemCheckes); // 구매 상품

  // 삭제 버튼
  deleteClick(rentalCarCloses, rentalCarCheckes, 1); // 대여 차
  deleteClick(rentalItemCloses, rentalItemCheckes, 1); // 대여 상품
  deleteClick(shoppingItemCloses, shoppingItemCheckes, 2); // 구매 상품

  // 장바구니 추가 버튼
  appendCart(rentalCarAppendBtn, rentalCarCheckes, 1); // 대여 차
  appendCart(rentalItemAppendBtn, rentalItemCheckes, 1); // 대여 상품
  appendCart(shoppingItemAppendBtn, shoppingItemCheckes, 2); // 구매 상품
};

// 처음 시작될때 화면 로드
redirect();