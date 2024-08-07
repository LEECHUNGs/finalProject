// 필수 유효성 검사를 위한 객체
const updatenewObj = {
  memberEmail: true, // 이메일
  memberNickName: true, // 닉네임
  memberName: true, // 실명
  memberPhoneNo: true, // 휴대폰 번호
  memberBirth: true, // 생년월일
};

// 입력받은 회원 정보 (input) 객체
const inputnewObj = {
  memberEmail: document.getElementById("memberEmail"), // 입력 이메일
  memberNickName: document.getElementById("memberNickName"), // 입력 닉네임
  memberName: document.getElementById("memberName"), // 입력 실명
  memberPhoneNo: document.getElementById("memberPhoneNo"), // 입력 휴대폰 번호
  memberBirth: document.getElementById("memberBirth"), // 입력 생년월일
};

// 유효성 검사용 정규식
const updateReqnewObj = {
  memberEmail:
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
  memberNickName: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,10}$/, // 닉네임 유효성 검사
  memberName: /^[가-힣]{2,6}$/, // 이름 유효성 검사
  memberPhoneNo: /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/, // 전화번호 유효성 검사
  memberBirth:
    /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/, // 생년월일 유효성 검사
};

const memberNickNameMessage = document.querySelector(".memberNickNameMessage"); // 닉네임 유효성 메세지
const memberPhoneNoMessage = document.querySelector(".memberPhoneNoMessage"); // 전화번호 유효성 메세지
const memberEmailMessage = document.querySelector(".memberEmailMessage"); // 이메일 유효성 메세지

const checkValidity = (
  url,
  value,
  element,
  messageElement,
  validMessage,
  invalidMessage,
  updateObjKey,
  regex
) => {
  fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(value),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result > 0) {
        messageElement.innerText = invalidMessage;
        messageElement.style.color = "red";
        updatenewObj[updateObjKey] = false;
        element.style.backgroundColor = "#a2a285";
        element.style.color = "white";
      } else {
        if (!regex.test(value[updateObjKey])) {
          element.style.backgroundColor = "#a2a285";
          element.style.color = "white";
          messageElement.innerText = "";
          updatenewObj[updateObjKey] = true;
        } else {
          messageElement.innerText = validMessage;
          messageElement.style.color = "blue";
          updatenewObj[updateObjKey] = true;
        }
      }
    });
};

for (const key in inputnewObj) {
  if (inputnewObj[key].value != null) {
    inputnewObj[key].addEventListener("change", (e) => {
      // 빈칸 입력시 공백 제거
      if (e.target.value.trim().length == 0) {
        updatenewObj[key] = false;
        e.target.style.backgroundColor = "#a2a285";
        e.target.style.color = "white";

        return;
      }
      // 유효성 검사를 해야하는 요소일 때
      if (updateReqnewObj[key] != null) {
        // 유효성 검사 실행

        // 닉네임 검사
        if (inputnewObj[key].id === "memberNickName") {
          checkValidity(
            "/member/nickNameCheck",
            { memberNickName: inputnewObj[key].value },
            inputnewObj.memberNickName,
            memberNickNameMessage,
            "사용가능",
            "사용중인 닉네임",
            "memberNickName",
            updateReqnewObj[key]
          );
        }

        // 전화번호 검사
        if (inputnewObj[key].id === "memberPhoneNo") {
          checkValidity(
            "/member/phoneNoCheck",
            { memberPhoneNo: inputnewObj[key].value },
            inputnewObj.memberPhoneNo,
            memberPhoneNoMessage,
            "사용가능",
            "사용중인 전화번호",
            "memberPhoneNo",
            updateReqnewObj[key]
          );
        }

        // 이메일 검사
        if (inputnewObj[key].id === "memberEmail") {
          checkValidity(
            "/member/emailCheck",
            { memberEmail: inputnewObj[key].value },
            inputnewObj.memberEmail,
            memberEmailMessage,
            "사용가능",
            "사용중인 이메일",
            "memberEmail",
            updateReqnewObj[key]
          );
        }

        if (!updateReqnewObj[key].test(e.target.value)) {
          e.target.style.backgroundColor = "#a2a285";
          e.target.style.color = "white";
          updatenewObj[key] = false;
          return;
        }

        // 유효성 검사 성공 시
        e.target.style.backgroundColor = "white";
        e.target.style.color = "rgb(115, 115, 104)";
        updatenewObj[key] = true;
      }
    });
  }
}

// 이메일 관련 요소 얻어오기
const emailBtn = document.querySelector("#emailBtn"); //이메일 변경버튼
const emailDiv = document.querySelector("#emailDiv"); //이메일 입력하는 inputDiv
const sendAuthKeyBtn = document.querySelector("#sendAuthKeyBtn"); //인증번호 요청버튼
const authNum = document.querySelector("#authNum"); //인증번호 입력 input
const authKeyMessage = document.querySelector("#authKeyMessage");
const authKeyBtn = document.querySelector("#authKeyBtn"); //인증하기버튼
const memberEmail = document.querySelector("#memberEmail");
var authKeyModal = new bootstrap.Modal(
  document.getElementById("authKeyModal"),
  { keyboard: false }
);
// 이메일 변경 클릭시 인증번호 요청 나오게 하기
emailBtn.addEventListener("click", (e) => {
  emailDiv.setAttribute("style", "pointer-events:auto");
  sendAuthKeyBtn.setAttribute("style", "display:block");
  emailBtn.setAttribute("style", "display : none");
});

var myModalEl = document.querySelector("#authKeyModal");
var myModal = bootstrap.Modal.getOrCreateInstance(myModalEl);

// 이메일 변경 시 인증번호
let newAuthTimer;
const newInitMin = 4;
const newInitSec = 59;
const newInitTime = "05:00";

let newMin = newInitMin;
let newSec = newInitSec;

// 인증번호 발생 클릭시 나타나는 이벤트
sendAuthKeyBtn.addEventListener("click", () => {
  // updatenewObj.memberEmail = false;
  authKeyMessage.innerText = "";

  if (memberEmail.value.trim().length == 0) {
    fffffsdsdfwshowa44bd();
    return;
  }

  if (!updatenewObj.memberEmail) {
    ffbvxbvcbvcfsdsdfwshowa44bd();
    return;
  }

  myModal.show();

  newMin = newInitMin;
  newSec = newInitSec;

  clearInterval(newAuthTimer);

  // 인증번호 발송 비동기
  fetch("/auth/sendEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: memberEmail.value,
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result == 1) {
        console.log("인증 번호 발송 성공");
      } else {
        console.log("인증 번호 발송 실패");
      }
    });

  authKeyMessage.innerText = newInitTime;
  authKeyMessage.classList.remove("confirm", "error");

  ffbvxbvcbvcfsdsdcvxcvcxvbd();

  newAuthTimer = setInterval(() => {
    authKeyMessage.innerText = `${addZero(newMin)}:${addZero(newSec)}`;
    if (newMin == 0 && newSec == 0) {
      updatenewObj.memberEmail = false;
      clearInterval(newAuthTimer);
      authKeyMessage.classList.add("error");
      authKeyMessage.classList.remove("confirm");
      return;
    }
    if (newSec == 0) {
      newSec = 60;
      newMin--;
    }
    newSec--;
  }, 1000);
});
function addZero(number) {
  if (number < 10) return "0" + number;
  else return number;
}

authKeyBtn.addEventListener("click", () => {
  if (newMin == 0 && newSec == 0) {
    showMysummermAlert24124412421();
    updatenewObj.memberEmail = false;
    return;
  }

  const userInfo = {
    memberEmail: memberEmail.value,
    authNum: authNum.value,
  };

  fetch("/auth/findMemberInfo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result == 0) {
        console.log(result);
        showalvvcvccvbvcvcfdfdve3cvDFDF();
        return;
      }
      console.log(result);
      clearInterval(newAuthTimer);
      showalvvcvccvbvcvcbvcbbvcvcfdfdve3cvDFDF();
      updatenewObj.memberEmail = true;
      authKeyModal.hide();
    });
});

// 주소 다음 api
function execDaumPostCode() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ""; // 주소 변수
      // var extraAddr = ''; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }
      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("postcode").value = data.zonecode;
      document.getElementById("address").value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("detailAddress").focus();
    },
  }).open();
}

// 주소 검색 버튼 클릭 시
document
  .querySelector("#searchAddress")
  .addEventListener("click", execDaumPostCode);

//주소 유효성
// const memberAddress = document.querySelectorAll('input[name="memberAddress"]');

// const addr0 = memberAddress[0].value.trim().length == 0;
// const addr1 = memberAddress[1].value.trim().length == 0;
// const addr2 = memberAddress[2].value.trim().length == 0;

// //모두 true 인 경우만 true 저장
// const result1 = addr0 && addr1 && addr2; //아무것도 입력안한 경우

// //모두 false 인 경우만 true 저장
// const result2 = !(addr0 || addr1 || addr2); //모두 다 입력한 경우

// //모두 입력 또는 모두 미입력이 아니면
// if( !(result1 || result2) ){
//     alert("주소를 모두 작성 또는 미작성 해주세요");
//     e.preventDefault();
// }

//========================================
// 내 정보 수정 데이터 form 요소 제출
document.getElementById("profileForm").addEventListener("submit", (e) => {
  // 유효성 검사 객체의 요소들이 모두 true 인지 검사
  for (const key in updatenewObj) {
    // 1개라도 유효성 검사 실패 시 submit 막기
    if (updatenewObj[key] == false) {
      let str;
      switch (key) {
        case "memberName":
          str = "이름을";
          break;
        case "memberNickName":
          str = "닉네임을";
          break;
        case "memberPhoneNo":
          str = "전화번호를";
          break;
        case "memberBirth":
          str = "생년월일을";
          break;
        case "memberEmail":
          str = "이메일을";
          break;
      }

      // alert(str + " 확인해 주세요");
      showa44erfcbvcbbvcvcfdfdve3cvDFDF(str);
      inputnewObj[key].focus();
      e.preventDefault();

      return;
    }
  }
});

//==================================
// 비밀번호 변경 모달창

const form = document.querySelector("#changePwForm"),
  newPw = form.querySelector("#newPw"),
  newPwConfirm = form.querySelector("#newPwConfirm"),
  newPwMessage = form.querySelector("#newPwMessage"),
  currentPw = form.querySelector("#currentPw"),
  regExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{6,16}$/;

// 비밀번호 유효성 검사
const validatePassword = () => {
  const check = {
    empty: "red", // 둘다 값을 입력하지 않았을때
    mismatch: "red", // 비밀번호가 불일치할때
    invalid: "red", // 유효하지 않을 때
    match: "rgb(115, 115, 104)", // 비밀번호 일치할 때
  };

  let pw = newPw.value.trim(),
    pwConfirm = newPwConfirm.value.trim();

  newPw.style.color =
    !pw || !pwConfirm
      ? check.empty
      : pw !== pwConfirm
      ? check.mismatch
      : !regExp.test(pw)
      ? check.invalid
      : check.match;

  newPwConfirm.style.color =
    !pw || !pwConfirm
      ? check.empty
      : pw !== pwConfirm
      ? check.mismatch
      : !regExp.test(pw)
      ? check.invalid
      : check.match;
};

// 이벤트 리스너
[newPw, newPwConfirm].forEach((e) =>
  e.addEventListener("input", validatePassword)
);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let alerts = {
    currentEmpty: "현재 비밀번호를 입력해 주세요.",
    newEmpty: "변경 비밀번호를 입력해주세요.",
    confirmEmpty: "변경 비밀번호 확인을 입력해주세요.",
    mismatch: "변경 비밀번호가 불일치 합니다",
    invalid: "변경 비밀번호가 유효하지 않습니다",
    currentMismatch: "현재 비밀번호가 일치하지 않습니다.",
    sameAsCurrent: "현재 비밀번호와 변경된 비밀번호가 일치합니다.",
    success: "비밀번호가 변경되었습니다.",
  };

  let current = currentPw.value.trim(),
    pw = newPw.value.trim(),
    pwConfirm = newPwConfirm.value.trim();

  if (!current)
    return (
      showa44erfcbvcbbvcvc312321fdfdve3cvDFDF(alerts.currentEmpty) &&
      currentPw.focus()
    );
  if (!pw)
    return (
      showa44erfcbvcbbvcvxxcvcxvc312321fdfdve3cvDFDF(alerts.newEmpty) &&
      newPw.focus()
    );
  if (!pwConfirm)
    return showa44erfd(alerts.confirmEmpty) && newPwConfirm.focus();
  if (pw !== pwConfirm) return showa44bbberfd(alerts.mismatch) && newPw.focus();
  if (!regExp.test(pw))
    return showa44bbbbbbberfd(alerts.invalid) && newPw.focus();

  fetch("/myPage/changePw", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ currentPw: current, newPw: pw }),
  })
    .then((resp) => resp.json())
    .then((result) => {
      switch (result) {
        case 0:
          return (
            showa44bbbbbbbbxbxcvxcverfd(alerts.currentMismatch) &&
            currentPw.focus()
          );
        case 2:
          return (
            wshowa44bbbbbbbbxbxcvxcverfd(alerts.sameAsCurrent) && newPw.focus()
          );
        case 1:
          wshowa44bd(alerts.success);
          window.location.href = "/myPage/info";
          break;
      }
    });
});
