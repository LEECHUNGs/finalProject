// JQuery 기본 설정
jQuery(document).ready(function ($) {
  // 이미지 클릭시 메인 이미지 경로 변경
  $(".itemImage").on("click", function (e) {
    // 3D 이미지 숨기기
    if ($(".3dView").length) {
      $(".3dView").css("display", "none");
    }

    // 메인 이미지 화면 표시
    $("#itemImageMain").css("display", "block");
    // 메인 이미지 경로 변경
    $("#itemImageMain").attr("src", e.target.src);
  });

  $("#3dItemImage").on("click", function () {
    // 메인 이미지 화면 숨기기
    const itemSrc = this.src;

    $("#itemImageMain").css("display", "none");
    if (!$(".3dView").length) {
      $(".itemImageMain").prepend(`
        <a-scene embedded class="3dView">
          <a-sky th:src="${itemSrc}" rotation="0 0 0"></a-sky>
        </a-scene>`);
    } else {
      $(".3dView").css("display", "block");
    }
  });

  //------------------------------ 돋보기 ------------------------------
  var Magnify = function (element, options) {
    this.init("magnify", element, options);
  };
  Magnify.prototype = {
    constructor: Magnify,
    init: function (type, element, options) {
      var event = "mousemove",
        eventOut = "mouseleave";

      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      this.nativeWidth = 0;
      this.nativeHeight = 0;

      this.$element.wrap('<div class="magnify" >');
      $(".magnify-large").remove();
      this.$element.parent(".magnify").append('<div class="magnify-large" >');
      this.$element
        .siblings(".magnify-large")
        .css(
          "background",
          "url('" + this.$element.attr("src") + "') no-repeat"
        );

      this.$element
        .parent(".magnify")
        .on(event + "." + this.type, $.proxy(this.check, this));
      this.$element
        .parent(".magnify")
        .on(eventOut + "." + this.type, $.proxy(this.check, this));
    },
    getOptions: function (options) {
      options = $.extend(
        {},
        $.fn[this.type].defaults,
        options,
        this.$element.data()
      );
      if (options.delay && typeof options.delay == "number") {
        options.delay = {
          show: options.delay,
          hide: options.delay,
        };
      }
      return options;
    },
    check: function (e) {
      var container = $(e.currentTarget);
      var self = container.children("img");
      var mag = container.children(".magnify-large");
      // Get the native dimensions of the image
      if (!this.nativeWidth && !this.nativeHeight) {
        var image = new Image();
        image.src = self.attr("src");

        this.nativeWidth = image.width;
        this.nativeHeight = image.height;
      } else {
        var magnifyOffset = container.offset();
        var mx = e.pageX - magnifyOffset.left;
        var my = e.pageY - magnifyOffset.top;

        if (
          mx < container.width() &&
          my < container.height() &&
          mx > 0 &&
          my > 0
        ) {
          mag.fadeIn(100);
        } else {
          mag.fadeOut(100);
        }

        if (mag.is(":visible")) {
          var rx =
            Math.round(
              (mx / container.width()) * this.nativeWidth - mag.width() / 2
            ) * -1;
          var ry =
            Math.round(
              (my / container.height()) * this.nativeHeight - mag.height() / 2
            ) * -1;
          var bgp = rx + "px " + ry + "px";

          var px = mx - mag.width() / 2;
          var py = my - mag.height() / 2;

          mag.css({ left: px, top: py, backgroundPosition: bgp });
        }
      }
    },
  };
  /* MAGNIFY PLUGIN DEFINITION
   * ========================= */
  $.fn.magnify = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data("magnify"),
        options = typeof option == "object" && option;
      if (!data) $this.data("tooltip", (data = new Magnify(this, options)));
      if (typeof option == "string") data[option]();
    });
  };
  $.fn.magnify.Constructor = Magnify;

  $.fn.magnify.defaults = {
    delay: 0,
  };
  /* MAGNIFY DATA-API
   * ================ */
  $(window).on("load", function () {
    $('[data-toggle="magnify"]').each(function () {
      var $mag = $(this);
      $mag.magnify();
    });
  });
  $(".itemImageList").on("click", function () {
    $('[data-toggle="magnify"]').each(function () {
      var $mag = $(this);
      $mag.magnify();
    });
  });
});

var today = new Date();
/* ----------------------------------------- */
let totalprice;

/* ----------------------------------------- */
var pick = new Lightpick({
  field: document.getElementById("datePick"),
  format: "YYYY- MM- DD",
  singleDate: false,
  minDate: today,
  onSelect: function (start, end) {
    // 결과 값 반환
    let dateCalSpan = document.querySelector(".dateCalSpan");

    let startDate = new Date(start);
    let endDate = new Date(end);

    // 날짜계산
    let diff =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24);

    var str = "";
    str += start ? start.format("YYYY. MM. DD") + "  ~  " : "";
    str += end ? end.format("YYYY. MM. DD") : "...";

    // 선택한 날짜 값 전달 (str)
    let dateSpan = document.querySelector(".dateSpan");

    // 기간에 n박 m일 나타내기
    if (diff >= 1) {
      end ? (dateSpan.innerHTML = str) : "";
    } else {
      end ? (dateSpan.innerHTML = "") : "";
    }

    // 기간에 n박 m일 나타내기
    if (diff >= 1) {
      end ? (dateSpan.innerHTML = str) : "";
    } else {
      end ? (dateSpan.innerHTML = "") : "";
    }

    // 기간에 n박 m일 나타내기
    if (diff >= 1) {
      end
        ? (dateCalSpan.innerHTML = diff + " 박  " + Number(diff + 1) + " 일 ")
        : "";
    } else {
      end ? (dateCalSpan.innerHTML = "") : "";
    }

    // 가격
    let price = "";

    // categoryCode에 따른 price 값 설정
    switch (categoryCode) {
      case 1:
        price = item.carRentPrice;
        break;
      case 2:
        price = item.equipmentRentPrice;
        break;
      case 3:
        price = item.packagePrice;
        break;
    }

    // 총 가격 나타낼 span 태그
    let totalPriceSpan = document.querySelector(".totalPriceSpan");

    // 총 가격 계산
    if (diff >= 1) {
      end
        ? (totalPriceSpan.innerHTML =
            (Number(price) * diff).toLocaleString() + " 원")
        : "";
      totalprice = Number(price) * diff;
    } else {
      end ? (totalPriceSpan.innerHTML = "") : "";
    }
  },
  inline: true,
});

/////////////////////////////////////////////////////////////////////////////////////////////////
// 찜하기

const like = document.getElementById("like");
const cartBtn = document.getElementById("cartItem");

// 찜 기능

like.addEventListener("click", () => {
  if (loginMember == null) {
    showMyCustomAlert153();
    return;
  }

  const obj = {
    categoryCode: categoryCode,
  };

  // 패키지가 아닌 경우
  if (item.itemNo != 0) {
    obj.itemNo = item.itemNo;
  } else {
    obj.packageNo = item.packageNo;
  }

  like.innerHtml = "";

  fetch("/interest/item", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(obj),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result == 1) {
        showMyCustomAlert154();
        like.innerHTML = "<i class='fa-solid fa-heart'></i> 찜 취소";
      } else if (result == 2) {
        showMyCustomAlert155();
        like.innerHTML = "<i class='fa-regular fa-heart'></i> 찜 하기";
      } else {
        console.log("진행 실패..");
      }
    });
});

/**-------------------------------------------------------------------- */
//  대여하기 차량
/**-------------------------------------------------------------------- */

// let paymentCounter = 1; // 초기 결제 고유 ID 카운터

// 결제를 위한 고유한 ID 생성 함수
// function generatePaymentId() {
//   const paymentId = `payment-${crypto.randomUUID()}`;
//   paymentCounter++;
//   return paymentId;
// }
// const SERVER_BASE_URL = "http://localhost:8080";
// 결제 요청 함수

async function requestPaymentCar() {
  if (loginMember == null) {
    showMyCustomAlert65();
    return;
  }

  let totalAmount; // 상품가격 << 1 없애야됨 나중에

  let amountText = document.querySelector(".totalPriceSpan").textContent.trim();
   amountText = amountText.replace(/,/g, ''); // 쉼표 제거
   amountText = amountText.replace(/원/g, ''); // "원" 제거
   totalAmount = Number(amountText);

  let paymentId = `payment-${crypto.randomUUID()}`.slice(0, 40);

  if (document.querySelector(".dateSpan").innerHTML.length == 0) {
    return showMyCustomAlert200();
  }
  try {
    // const paymentId = generatePaymentId(); // 고유한 결제 ID 생성

    const response =  await PortOne.requestPayment ({
      storeId: "store-83435443-985f-4172-afde-d5607f514534",
      channelKey: "channel-key-c76e683c-3c74-4534-b7ad-539fee45702e",
      paymentId: paymentId, // 생성된 결제 고유 ID 사용
      orderName: ItemName,
      totalAmount: 1000,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      customer: {
        fullName: memberNickname,
        phoneNumber: phoneNumber,
        email: email,
      },
      productType: "PRODUCT_TYPE_DIGITAL",
    });

    if (response.code != null) {
      // 오류 발생
      return showMyCustomAlert100();
    }

    console.log("...아 뭐냐");


    const notified = await fetch("/payment/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: paymentId,
        // 넘길값
        // 가격
        // 상품 이름
        // paymentId
        totalAmount: totalAmount,
        // orderName: ItemName,
        dateSpan: document.querySelector(".dateSpan").innerHTML,
        itemNo: item.itemNo,
        categoryCode : categoryCode
      }),
    });

    // fetch 요청이 성공적으로 처리되었는지 확인할 수 있는 추가 로직 필요
    if (notified.ok) {
      // 성공적으로 처리된 경우

      showMyCustomAlert10000000000000001222();
      location.href = `/payment/BorrowComplete?categoryCode=${categoryCode}&itemNo=${item.itemNo}`;

      
    } else {
      // 오류 발생한 경우
      // console.error("Failed to send payment notification.");
      showMyCustomAlert10004242();
    }
  } catch (error) {
    console.error("Error occurred during payment request:", error);
    // 오류 처리 로직 추가
  }
}

/**-------------------------------------------------------------------- */
//  대여하기 차량
/**-------------------------------------------------------------------- */

/**-------------------------------------------------------------------- */
//  대여하기 패키지
/**-------------------------------------------------------------------- */

async function requestPaymentPackage() {
  if (loginMember == null) {
    showMyCustomAlert65();
    return;
  }

  let totalAmount; // 상품가격 << 1 없애야됨 나중에

  let amountText = document.querySelector(".totalPriceSpan").textContent.trim();
   amountText = amountText.replace(/,/g, ''); // 쉼표 제거
   amountText = amountText.replace(/원/g, ''); // "원" 제거
   totalAmount = Number(amountText);

  let paymentId = `Package-${crypto.randomUUID()}`.slice(0, 40);

  if (document.querySelector(".dateSpan").innerHTML.length == 0) {
    return showMyCustomAlert200();
  }

  try {
    // const paymentId = generatePaymentId(); // 고유한 결제 ID 생성

    const response = await PortOne.requestPayment({
      storeId: "store-83435443-985f-4172-afde-d5607f514534",
      channelKey: "channel-key-c76e683c-3c74-4534-b7ad-539fee45702e",
      paymentId: paymentId, // 생성된 결제 고유 ID 사용
      orderName: ItemName,
      totalAmount: 1000,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      customer: {
        fullName: memberNickname,
        phoneNumber: phoneNumber,
        email: email,
      },
      productType: "PRODUCT_TYPE_DIGITAL",
    });

    if (response.code != null) {
      // 오류 발생
      return showMyCustomAlert100();
    }
   

    const notified = await fetch("/payment/PackageComplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: paymentId,
        // 넘길값
        // 가격
        // 상품 이름
        // paymentId
        totalAmount: totalAmount,
        // orderName: ItemName,
        dateSpan: document.querySelector(".dateSpan").innerHTML,
        packageNo: packageNo,
        categoryCode : categoryCode
      }),
    });

    // fetch 요청이 성공적으로 처리되었는지 확인할 수 있는 추가 로직 필요
    if (notified.ok) {
      // 성공적으로 처리된 경우
      showMyCustomAlert1000000000000000();
      location.href = `/payment/BorrowComplete?categoryCode=${categoryCode}&itemNo=${item.packageNo}`;
    } else {
      // 오류 발생한 경우
      showMyCustomAlert10004242();
      console.error("Failed to send payment notification.");
    }
  } catch (error) {
    console.error("Error occurred during payment request:", error);
    // 오류 처리 로직 추가
  }
}

/**-------------------------------------------------------------------- */
//  대여하기 패키지
/**-------------------------------------------------------------------- */

/**-------------------------------------------------------------------- */
// 캠핑용품 구매하기
/**-------------------------------------------------------------------- */

async function requestPaymentCampingPurchase() {

  if (loginMember == null) {
    showMyCustomAlert65();
    return;
  }

  let totalAmount; // 상품가격 << 1 없애야됨 나중에

  let amountText = document.querySelector("#purchase-camping-price").textContent.trim();
   amountText = amountText.replace(/,/g, ''); // 쉼표 제거
   amountText = amountText.replace(/원/g, ''); // "원" 제거
   totalAmount = Number(amountText);

  let paymentId = `purchaseCamp-${crypto.randomUUID()}`.slice(0, 40);

  // if(document.querySelector(".dateSpan").innerHTML.length == 0){

  //   return showMyCustomAlert200();
  // }

  try {
    // const paymentId = generatePaymentId(); // 고유한 결제 ID 생성

    const response = await PortOne.requestPayment({
      storeId: "store-83435443-985f-4172-afde-d5607f514534",
      channelKey: "channel-key-c76e683c-3c74-4534-b7ad-539fee45702e",


      paymentId: paymentId, // 생성된 결제 고유 ID 사용
      orderName:ItemName,
      totalAmount: 1000,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      customer: {
        fullName: memberNickname,
        phoneNumber: phoneNumber,
        email: email,
      },
      productType: "PRODUCT_TYPE_DIGITAL",
    });

    if (response.code != null) {
      // 오류 발생
      return showMyCustomAlert100();
    }
  
    const notified = await fetch("/payment/purChaseCamp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: paymentId,
        totalAmount: totalAmount,
        itemNo: item.itemNo,
        categoryCode : categoryCode
      }),
    });

    // fetch 요청이 성공적으로 처리되었는지 확인할 수 있는 추가 로직 필요
    if (notified.ok) {
      // 성공적으로 처리된 경우
      showMyCustomAlert10000000000000001();
      location.href = `/payment/PurChaseComplete?categoryCode=${categoryCode}&itemNo=${item.itemNo}`;

    } else {
      // 오류 발생한 경우
      showMyCustomAlert10004242();
      console.error("Failed to send payment notification.");
    }
  } catch (error) {
    console.error("Error occurred during payment request:", error);
    // 오류 처리 로직 추가
  }
}

/**-------------------------------------------------------------------- */
// 캠핑용품 구매하기
/**-------------------------------------------------------------------- */

/**-------------------------------------------------------------------- */
// 캠핑용품 대여하기
/**-------------------------------------------------------------------- */

async function requestPaymentCampingBorrow() {
  if (loginMember == null) {
    showMyCustomAlert65();
    return;
  }

  let totalAmount; // 상품가격 << 1 없애야됨 나중에

  let amountText = document.querySelector(".totalPriceSpan").textContent.trim();
   amountText = amountText.replace(/,/g, ''); // 쉼표 제거
   amountText = amountText.replace(/원/g, ''); // "원" 제거
   totalAmount = Number(amountText);

  let paymentId = `payborrowCamp-${crypto.randomUUID()}`.slice(0, 40);

  if (document.querySelector(".dateSpan").innerHTML.length == 0) {
    return showMyCustomAlert200();
  }

  try {
    // const paymentId = generatePaymentId(); // 고유한 결제 ID 생성

    const response = await PortOne.requestPayment({
      storeId: "store-83435443-985f-4172-afde-d5607f514534",
      channelKey: "channel-key-c76e683c-3c74-4534-b7ad-539fee45702e",
      paymentId: paymentId, // 생성된 결제 고유 ID 사용
      orderName:ItemName,
      totalAmount: 1000,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      customer: {
        fullName: memberNickname,
        phoneNumber: phoneNumber,
        email: email,
      },
      productType: "PRODUCT_TYPE_DIGITAL",
    });

    if (response.code != null) {
      // 오류 발생
      return showMyCustomAlert100();
    }
 

    const notified = await fetch("/payment/borrowCamping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: paymentId,
        // 넘길값
        // 가격
        // 상품 이름
        // paymentId
        totalAmount: totalAmount,
        // orderName: ItemName,
        dateSpan: document.querySelector(".dateSpan").innerHTML,
        itemNo: item.itemNo,
        categoryCode : categoryCode
      }),
    });

    // fetch 요청이 성공적으로 처리되었는지 확인할 수 있는 추가 로직 필요
    if (notified.ok) {
      // 성공적으로 처리된 경우
      showMyCustomAlert100000000000000012();
      location.href = `/payment/BorrowComplete?categoryCode=${categoryCode}&itemNo=${item.itemNo}`;
    } else {
      // 오류 발생한 경우
      showMyCustomAlert10004242();
      console.error("Failed to send payment notification.");
    }
  } catch (error) {
    console.error("Error occurred during payment request:", error);
    // 오류 처리 로직 추가
  }
}

/**-------------------------------------------------------------------- */
// 캠핑용품 대여하기
/**-------------------------------------------------------------------- */

/////////////////////////////////////////////////////////////////////////////////////////////////
// 장바구니

const cartItem = document.getElementById("cartItem"); // 장바구니 버튼
const dateSpan = document.querySelector(".dateSpan"); // 예약 날짜 기간
const totalPriceSpan = document.querySelector(".totalPriceSpan"); // 총 결제금액
const buttonDiv = document.getElementById("buttonDiv"); // 버튼 div
const rentalBtn = document.querySelector(".rentalBtn"); // 대여용 버튼
const shoppingBtn = document.querySelector(".shoppingBtn"); // 구매용 버튼

const obj = {
  itemNo: item.itemNo,
  categoryCode: item.categoryCode,

  packageNo: item.packageNo,
};

// package가 0이면 차, 장비 / 1이면 패키지

// type에서 1은 대여, 2는 구매
const cartAppend = (type) => {
  // 패키지라면 obj.package = 1
  if (obj.categoryCode == 3) {
    obj.itemNo = item.packageNo;
  }

  obj.type = type;

  console.log(obj);

  fetch("/cart/appendCart", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(obj),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result > 0) {
        showMyCustomAlert157();
      } else {
        console.log("오류...");
      }
    });

  console.log(obj);
};

// 버튼 기능을 추가하는 함수 정의
const btnClickEvent = (btn, type) => {
  btn.addEventListener("click", () => {
    cartAppend(type);
  });
};

// 장바구니 버튼을 눌렀을 때
cartItem.addEventListener("click", (e) => {
  if (loginMember == null) {
    showMyCustomAlert153();
    return;
  }

  // 장비를 장바구니에 추가하는 경우 대여인지 구매인지 따져줌
  if (obj.categoryCode == 2) {
    cartItem.style.display = "none";
    rentalBtn.style.display = "block";
    shoppingBtn.style.display = "block";

    return;
  } else {
    cartAppend(1);
  }
});

document.addEventListener("click", (e) => {
  if (!buttonDiv.contains(e.target)) {
    cartItem.style.display = "block";
    rentalBtn.style.display = "none";
    shoppingBtn.style.display = "none";
  }
});

btnClickEvent(rentalBtn, 1); // 대여용 버튼 함수
btnClickEvent(shoppingBtn, 2); // 구매용 버튼 함수

/////////////////////////////////////////////////////////////////////////////////////////////////
// 리뷰 작성

// 화면 새로고침 하는 함수
const reviewReload = () => {
  fetch("/review/selectReview", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ itemNo: item.itemNo }),
  })
    .then((resp) => resp.json())
    .then((result) => {
      const reviewContainer = document.getElementById("tabContentContainer");

      // 기존의 내용을 지우기
      reviewContainer.innerHTML = "";
      count = 0;
      if (result.length === 0) {
        reviewContainer.innerHTML =
          '<div class="noReview">작성된 후기가 없습니다.</div>';
      } else {
        result.forEach((review) => {
          const eachContainer = document.createElement("div");
          eachContainer.classList.add("EachContainer");

          const reviewDetailBox = document.createElement("div");
          reviewDetailBox.classList.add("reviewDetailBox");

          // 프로필 이미지 처리
          const profileImg = document.createElement("img");
          profileImg.classList.add("reviewProfileImg");
          if (review.profileImg) {
            profileImg.src = review.profileImg;
          } else {
            profileImg.src = "/images/user.png";
          }
          reviewDetailBox.appendChild(profileImg);

          const reviewDetailContainer = document.createElement("div");
          reviewDetailContainer.classList.add("reviewDetailContainer");

          // 닉네임과 날짜 처리
          const nickNameDateContainer = document.createElement("div");
          nickNameDateContainer.classList.add("nickNameDateContainer");

          const nickName = document.createElement("div");
          nickName.textContent = review.memberNickName;
          nickNameDateContainer.appendChild(nickName);

          const reviewDate = document.createElement("div");
          reviewDate.textContent = review.reviewDate;
          nickNameDateContainer.appendChild(reviewDate);

          reviewDetailContainer.appendChild(nickNameDateContainer);

          // 후기 내용 처리
          const reviewContent = document.createElement("div");
          reviewContent.classList.add("reviewContent");
          reviewContent.textContent = review.reviewContent;
          reviewDetailContainer.appendChild(reviewContent);

          reviewDetailBox.appendChild(reviewDetailContainer);

          eachContainer.appendChild(reviewDetailBox);

          // 후기 작성자와 로그인 사용자가 같을 때 수정 및 삭제 버튼 표시
          if (review.memberNo === loginMember.memberNo) {
            const updateDiv = document.createElement("div");
            updateDiv.classList.add("update-div");

            const updateBtn = document.createElement("button");
            updateBtn.textContent = "수정";
            updateBtn.classList.add("updateBtn");
            updateDiv.appendChild(updateBtn);
            updateBtn.value = review.reviewNo;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "삭제";
            deleteBtn.classList.add("deleteBtn");
            updateDiv.appendChild(deleteBtn);

            eachContainer.appendChild(updateDiv);

            // 삭제 이벤트 주기
            deleteBtn.addEventListener("click", () => {
              const reviewNo = review.reviewNo;

              deleteReview(reviewNo);
            });

            // 수정 이벤트 주기
            updateBtn.addEventListener("click", () => {
              updateReview(updateBtn);
            });
          }

          reviewContainer.appendChild(eachContainer);
        });
      }
    })
    .catch((error) => {
      console.error("리뷰 목록 불러오는중 서버 에러:", error);
    });
};

const reviewBtn = document.querySelector(".review-btn");
const reviewContent = document.getElementById("reviewContent");

if (reviewBtn != null) {
  reviewBtn.addEventListener("click", () => {
    if (reviewContent.value == "") {
      alert("글을 작성해주세요.");
      return;
    }

    const answer = confirm("리뷰를 등록하시겠습니까?");

    if (!answer) {
      return;
    }

    const obj = {
      itemNo: item.itemNo,
      content: reviewContent.value,
    };

    fetch("/review/addReview", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.text())
      .then((result) => {
        if (result > 0) {
          alert("리뷰가 등록되었습니다.");
          //textarea 비워주기
          reviewContent.value = "";
          // 새로고침 함수
          reviewReload();
        } else {
          console.log("리뷰 등록 오류...");
        }
      });
  });
}

// 리뷰 삭제 함수
const deleteReview = (reviewNo) => {
  const answer = confirm("정말 삭제하시겠습니까?");

  if (answer) {
    fetch("/review/deleteReview", {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      body: JSON.stringify({ reviewNo: reviewNo }),
    })
      .then((resp) => resp.text())
      .then((result) => {
        if (result > 0) {
          alert("리뷰가 삭제되었습니다.");
          reviewReload();
        } else {
          console.log("리뷰 삭제중 에러 발생...");
        }
      });
  }
};

let count = 0;

// 실제 업데이트하는 함수
const updateReviewFunc = (obj) => {
  fetch("/review/updateReview", {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify(obj),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result > 0) {
        alert("리뷰가 수정되었습니다.");
        // 새로고침 함수
        reviewReload();
      } else {
        console.log("리뷰 수정 중 에러발생..");
      }
    });
};

// 이전 수정 버튼
let beforeElement;

// 리뷰 수정 함수
const updateReview = (element) => {
  count++;

  if (count > 1) {
    const answer = confirm("현재 작성중인 댓글을 취소하시겠습니까?");

    if (!answer) {
      count--;
      return;
    } else {
      count--;

      beforeContainerBox =
        beforeElement.parentElement.previousElementSibling.lastElementChild;
      beforeContentBox = beforeContainerBox.lastElementChild;

      // 이전 형제의 내용 박스 보이게
      beforeContentBox.style.display = "block";

      // 이전 형제의 수정 버튼 보이게
      beforeElement.style.display = "block";

      // 이전 형제의 삭제 버튼 보이게
      beforeElement.nextElementSibling.style.display = "block";

      // 이전형제의 취소버튼, 저장버튼 없애기
      beforeElement.parentElement.removeChild(
        beforeElement.parentElement.lastElementChild
      );

      beforeElement.parentElement.removeChild(
        beforeElement.parentElement.lastElementChild
      );

      // 이전 형제의 댓글 div 보이게
      beforeElement.parentElement.previousElementSibling.lastElementChild.lastElementChild.previousElementSibling.style.display =
        "block";

      // 이전 형제의 textarea 없애기
      beforeElement.parentElement.previousElementSibling.lastElementChild.removeChild(
        beforeElement.parentElement.previousElementSibling.lastElementChild
          .lastElementChild
      );
    }
  }

  const reviewNo = element.value;

  // 버튼 박스
  const buttonBox = element.parentElement;

  // 리뷰 컨테이너
  const reviewContainerBox =
    element.parentElement.previousElementSibling.lastElementChild;
  // 리뷰 텍스트 박스
  const reviewContentBox = reviewContainerBox.lastElementChild;

  const textarea = document.createElement("textarea");

  reviewContentBox.style.display = "none";

  textarea.classList.add("review-textarea");
  textarea.value = reviewContentBox.innerText;

  // 텍스트 영역을 reviewContentBox 다음에 삽입
  reviewContainerBox.appendChild(textarea);

  const backBtn = document.createElement("button");
  const updateBtn = document.createElement("button");

  backBtn.innerText = "취소";
  updateBtn.innerText = "저장";

  backBtn.classList.add("deleteBtn");
  updateBtn.classList.add("deleteBtn");

  buttonBox.firstElementChild.style.display = "none";
  buttonBox.firstElementChild.nextElementSibling.style.display = "none";

  buttonBox.appendChild(backBtn);
  buttonBox.appendChild(updateBtn);

  // 이전 element를 저장
  beforeElement = element;

  // 취소 버튼
  backBtn.addEventListener("click", () => {
    reviewContentBox.style.display = "block";

    reviewContainerBox.removeChild(textarea);

    buttonBox.firstElementChild.style.display = "block";
    buttonBox.firstElementChild.nextElementSibling.style.display = "block";

    buttonBox.removeChild(backBtn);
    buttonBox.removeChild(updateBtn);

    count--;
  });

  // 저장 버튼
  updateBtn.addEventListener("click", () => {
    const obj = {
      reviewNo: reviewNo,
      reviewContent: textarea.value,
    };

    count--;
    updateReviewFunc(obj);
  });
};
