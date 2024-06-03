// 필수 유효성 검사를 위한 객체
const checkObj = {
  memberId: false, // 아이디
  memberPw: false, // 비밀번호
  memberPwConfirm: false, // 비밀번호 확인
  memberEmail: false, // 이메일
  memberNickName: false, // 닉네임
  memberName: false, // 실명
  memberPhoneNo: false, // 휴대폰 번호
  memberBirth: false, // 생년월일
};

// 입력받은 회원 정보 (input) 객체
const inputObj = {
<<<<<<< HEAD
    memberId : document.getElementById("memberId"), // 입력 아이디
    memberPw : document.getElementById("memberPw"), // 입력 비밀번호
    memberPwConfirm : document.getElementById("memberPwConfirm"), // 입력 비밀번호 확인
    memberEmail : document.getElementById("memberEmail"), // 입력 이메일
    memberNickName : document.getElementById("memberNickName"), // 입력 닉네임
    memberName : document.getElementById("memberName"), // 입력 실명
    memberPhoneNo : document.getElementById("memberPhoneNo"), // 입력 휴대폰 번호
    memberBirth : document.getElementById("memberBirth") // 입력 생년월일
}; 

// 메시지 출력용 span
const messageObj = {
    memberId : document.getElementById("memberIdMessage"), // 아이디 유효성 검사 메시지
    memberPw : document.getElementById("memberPwMessage"), // 비밀번호 유효성 검사 메시지
    memberEmail : document.getElementById("memberEmailMessage"), // 이메일 유효성 검사 메시지
    memberNickName : document.getElementById("memberNickNameMessage"), // 닉네임 유효성 검사 메시지
    memberName : document.getElementById("memberNameMessage"), // 실명 유효성 검사 메시지
    memberPhoneNo : document.getElementById("memberPhoneNoMessage"), // 휴대폰 번호 유효성 검사 메시지
    memberBirth : document.getElementById("memberBirthMessage") // 생년월일 유효성 검사 메시지
}; 
=======
  memberId: document.getElementById("memberId"), // 입력 아이디
  memberPw: document.getElementById("memberPw"), // 입력 비밀번호
  memberPwConfirm: document.getElementById("memberPwConfirm"), // 입력 비밀번호 확인
  memberEmail: document.getElementById("memberEmail"), // 입력 이메일
  memberNickName: document.getElementById("memberNickName"), // 입력 닉네임
  memberAddress: document.getElementById("memberAddress"), // 입력 주소
  memberName: document.getElementById("memberName"), // 입력 실명
  memberPhoneNo: document.getElementById("memberPhoneNo"), // 입력 휴대폰 번호
  memberBirth: document.getElementById("memberBirth"), // 입력 생년월일
};

// 메시지 출력용 span
const messageObj = {
  memberId: document.getElementById("memberIdMessage"), // 아이디 유효성 검사 메시지
  memberPw: document.getElementById("memberPwMessage"), // 비밀번호 유효성 검사 메시지
  memberEmail: document.getElementById("memberEmailMessage"), // 이메일 유효성 검사 메시지
  memberNickName: document.getElementById("memberNickNameMessage"), // 닉네임 유효성 검사 메시지
  memberAddress: document.getElementById("memberAddressMessage"), // 주소 유효성 검사 메시지
  memberName: document.getElementById("memberNameMessage"), // 실명 유효성 검사 메시지
  memberPhoneNo: document.getElementById("memberPhoneNoMessage"), // 휴대폰 번호 유효성 검사 메시지
  memberBirth: document.getElementById("memberBirthMessage"), // 생년월일 유효성 검사 메시지
};
>>>>>>> 0d9cc44ccffc7bc6a6d35df9e0cbb8ee71d39e9a

// 유효성 검사용 정규식
const reqObj = {
  memberId: /^[a-z0-9]{5,10}$/, // 아이디 유효성 검사
  memberPw: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{6,16}$/, // 비밀번호 유효성 검사
  memberEmail:
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
  memberNickName: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,10}$/, // 닉네임 유효성 검사
  memberName: /^[가-힣]{2,6}$/, // 이름 유효성 검사
  memberPhoneNo: /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/, // 전화번호 유효성 검사
  memberBirth:
    /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/, // 생년월일 유효성 검사
};

for (const key in inputObj) {
<<<<<<< HEAD
    inputObj[key].addEventListener('input', e => {
        
        // 빈칸 입력시 공백 제거
        if(e.target.value.trim().length === 0) {
            
            if(messageObj[key] != null) {
                messageObj[key].innerText = "";
            }

            e.target.value = "";

            return;
        }
=======
  inputObj[key].addEventListener("input", (e) => {
    if (messageObj[key] != null) {
      // 비밀번호 확인 요소가 아닐 때
      // 빈칸 입력시 공백 제거
      if (e.target.value.trim().length === 0) {
        messageObj[key].innerText = "";
        e.target.value = "";
        return;
      }
    }
>>>>>>> 0d9cc44ccffc7bc6a6d35df9e0cbb8ee71d39e9a

    if (reqObj[key] != null) {
      // 유효성 검사를 해야하는 요소일 때
      // 유효성 검사 실행
      if (!reqObj[key].test(e.target.value)) {
        // 유효하지 않을 때
        messageObj[key].innerText = "유효한 형식이 아닙니다.";
        checkObj[key] = false;
        return;
      }

      // 유효성 검사 성공 메시지를 띄움
      messageObj[key].innerText = "유효한 형식입니다.";

<<<<<<< HEAD
    if (reqObj[key] != null) {
      // 유효성 검사를 해야하는 요소일 때
      // 유효성 검사 실행
      if (!reqObj[key].test(e.target.value)) {
        // 유효하지 않을 때
        messageObj[key].innerText = '유효한 형식이 아닙니다.';
        checkObj[key] = false;
        return;
      }

      // 유효성 검사 성공 메시지를 띄움
      messageObj[key].innerText = '유효한 형식입니다.';

=======
>>>>>>> 0d9cc44ccffc7bc6a6d35df9e0cbb8ee71d39e9a
      // 유효성 검사 객체의 값을 변경
      checkObj[key] = true;
    } else {
      // 유효성 검사를 하지 않는 요소일 때(비밀번호 확인)
      // 비밀번호 일치 검사
      if (inputObj.memberPwConfirm.value != inputObj.memberPw.value) {
<<<<<<< HEAD
        messageObj.memberPw.innerText = '비밀번호가 일치하지 않습니다.';
=======
        messageObj.memberPw.innerText = "비밀번호가 일치하지 않습니다.";
>>>>>>> 0d9cc44ccffc7bc6a6d35df9e0cbb8ee71d39e9a
        checkObj[key] = false;
        return;
      } else {
        // 비밀번호 일치시
<<<<<<< HEAD
        messageObj.memberPw.innerText = '비밀번호가 일치합니다.';
=======
        messageObj.memberPw.innerText = "비밀번호가 일치합니다.";
>>>>>>> 0d9cc44ccffc7bc6a6d35df9e0cbb8ee71d39e9a
        checkObj[key] = true;
      }
    }
  });
}

// 회원가입 데이터 form 요소
<<<<<<< HEAD
document.getElementById('signUpForm').addEventListener('submit', (e) => {
=======
document.getElementById("signUpForm").addEventListener("submit", (e) => {
>>>>>>> 0d9cc44ccffc7bc6a6d35df9e0cbb8ee71d39e9a
  // 유효성 검사 객체의 요소들이 모두 true 인지 검사
  for (const key in checkObj) {
    // 1개라도 유효성 검사 실패 시 submit 막기
    if (checkObj[key] == false) {
      let str;
      switch (key) {
<<<<<<< HEAD
        case 'memberId':
          str = '아이디를';
          break;
        case 'memberPw':
          str = '비밀번호를';
          break;
        case 'memberPwConfirm':
          str = '비밀번호를';
          break;
        case 'memberEmail':
          str = '이메일을';
          break;
        case 'memberNickName':
          str = '닉네임을';
          break;
        case 'memberName':
          str = '이름을';
          break;
        case 'memberPhoneNo':
          str = '전화번호를';
          break;
        case 'memberBirth':
          str = '생년월일을';
          break;
      }

      alert(str + ' 확인해 주세요');
=======
        case "memberId":
          str = "아이디를";
          break;
        case "memberPw":
          str = "비밀번호를";
          break;
        case "memberPwConfirm":
          str = "비밀번호를";
          break;
        case "memberEmail":
          str = "이메일을";
          break;
        case "memberNickName":
          str = "닉네임을";
          break;
        case "memberName":
          str = "이름을";
          break;
        case "memberPhoneNo":
          str = "전화번호를";
          break;
        case "memberBirth":
          str = "생년월일을";
          break;
      }

      alert(str + " 확인해 주세요");
>>>>>>> 0d9cc44ccffc7bc6a6d35df9e0cbb8ee71d39e9a
      inputObj[key].focus();
      e.preventDefault();

      return;
    }
  }
});
