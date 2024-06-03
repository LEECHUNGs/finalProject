//비밀번호가 현재 입력한 값과 같은지 확인
const checkPwForm = document.querySelector("#checkPwForm");
const inputPw = document.querySelector("#inputPw").value;

checkPwForm.addEventListener("submit", (e) => {
  fetch("/myPage/checkPw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { inputPw: inputPw },
  })
    .then((resp) => resp.json())
    .then((result) => {
      if (result == 2) {
        e.preventDefault();
        return;
      }
      if (result == 0) {
        PwMessage.innerText = "비밀번호 불일치";
        e.preventDefault();
      }
      PwMessage.innerText = "비밀번호 일치";
      checkSecession.currentPw = true;
    });
});

//회원 탈퇴 모달창
const checkSecession = {
  agree: false,
  currentPw: false,
};

const currentPw = document.querySelector("#currentPw");
const agree = document.querySelector("#agree");
const PwMessage = document.querySelector("#PwMessage");
const secessionBtn = document.querySelector("#secessionBtn");

const secessionForm = document.querySelector("#secessionForm");

// 비밀번호 입력 시 이벤트
currentPw.addEventListener("input", () => {
  if (currentPw.value.trim().length == 0) {
    PwMessage.innerText = "비밀번호를 입력해주세요";
    checkSecession.currentPw = false;
    return;
  }

  const inputPw = currentPw.value;
  fetch("/myPage/checkPw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: inputPw,
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result == 0) {
        PwMessage.innerText = "비밀번호 불일치";
        checkSecession.currentPw = false;
        return;
      }
      PwMessage.innerText = "비밀번호 일치";
      checkSecession.currentPw = true;
    });
});

// 동의체크박스
agree.addEventListener("change", (e) => {
  console.log(e.target.checked);
  if (e.target.checked) checkSecession.agree = true;
  else checkSecession.agree = false;
});

// 최종 서브밋 될 때 이벤트
secessionForm.addEventListener("submit", (e) => {
  if (!checkSecession.agree) {
    e.preventDefault();
    alert("탈퇴 약관에 동의해주세요");
    return;
  }

  if (!checkSecession.currentPw) {
    e.preventDefault();
    alert("비밀번호가 일치하지 않습니다");
    return;
  }

  alert("탈퇴 되었습니다!");
  return true;
});
