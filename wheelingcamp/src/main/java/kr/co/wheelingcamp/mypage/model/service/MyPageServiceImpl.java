package kr.co.wheelingcamp.mypage.model.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.co.wheelingcamp.mypage.model.mapper.MyPageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService{

	private final MyPageMapper mapper;
	private final BCryptPasswordEncoder bcrypt;
	
	// 입력한 비밀번호와 현재 비밀번호가 같은지 확인
	@Override
	public int checkPw(int memberNo, String inputPw) {
		
		String currentPw = mapper.checkPw(memberNo);
		
		if(!bcrypt.matches(inputPw,currentPw)) {
		return 0;
		}
		if(currentPw == null) {
		return 2;
		}
		return 1;
	}

	// 회원 탈퇴
	@Override
	public int secession(int memberNo) {
		
		return mapper.secession(memberNo);
	}
}
