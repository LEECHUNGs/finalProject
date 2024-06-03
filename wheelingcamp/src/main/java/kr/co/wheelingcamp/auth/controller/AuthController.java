package kr.co.wheelingcamp.auth.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.wheelingcamp.auth.model.service.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("auth")
public class AuthController {
	


	private final AuthService service;
	

	

	
	
	
	
	/** 이메일 인증 메일 발송
	 * @param email
	 * @return
	 */
	@PostMapping("sendEmail")
	public int sendEmail(@RequestBody String email) {
		
		int result = service.sendEmail("sendAuthKey", email);
		
		return result;
	}
	
	
	
	@PostMapping("sendSMS")
	public int sendSMS(@RequestBody String phoneNo) {
		
		int result = service.sendSMS(phoneNo);
		
		return result;
	}
	
	
	/** 휴대폰/이메일이 갖고있는 인증번호와 맞는지 확인
	 * @param userInfo
	 * @return
	 */
	@PostMapping("findMemberInfo")
	public int checkAuth(@RequestBody Map<String, String> userInfo) {
		
		int result = service.checkAuth(userInfo);
		
		return result;
	}
	
	
}
