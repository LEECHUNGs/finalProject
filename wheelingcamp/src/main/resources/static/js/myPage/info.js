//비밀번호가 현재 입력한 값과 같은지 조회
// 모달창으로 나온 현재 비밀번호 클릭한 경우
const checkPwForm = document.querySelector("#checkPwForm");
const inputPw = document.querySelector("#inputPw");

checkPwForm.addEventListener("submit",e=>{
     e.preventDefault();
    if(inputPw.value.trim().length == 0){
        alert('현재 비밀번호를 입력해주시기 바랍니다');
        e.preventDefault();
        return;
    }
    fetch("/user/checkCurrentPw", {
        method : 'POST',
        headers : { 'Content-Type': 'application/json; charset=utf-8' },
        body : JSON.stringify({
            'inputPw' : inputPw.value
        })
    })
    .then(resp => resp.json())
    .then(result => {
        if(result == 0){
            alert('비밀번호가 일치하지 않습니다.');
            e.preventDefault();
            return;
        } else{
            window.location.href="/user/updateProfile";
        }
    })
}) 