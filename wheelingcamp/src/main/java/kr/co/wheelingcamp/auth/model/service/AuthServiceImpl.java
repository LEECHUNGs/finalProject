package kr.co.wheelingcamp.auth.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.ISpringTemplateEngine;

import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;
import kr.co.wheelingcamp.auth.model.mapper.AuthMapper;
import kr.co.wheelingcamp.common.util.CreateAuthKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService{
	
	// 인증 API Key
	@Value("${util.coolsms.key}")
	private String apiKey;
	// 인증 API Secret
	@Value("${util.coolsms.secret}")
	private String apiSecret;
	

	private final AuthMapper mapper;
	
	// 메일 객체
	private final JavaMailSender mailSender;
	
	private final ISpringTemplateEngine templateEngine;
	
	private DefaultMessageService messageService;
	
	private final CreateAuthKey createAuthKey;
	
	
	@PostConstruct // 의존성 주입전 실행되는 코드
	private void init() {
		this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
	}

	
	
	
	// 이메일 인증번호 발급
		@Override
		public int sendEmail(String html, String email) {
			
			CreateAuthKey createAuthKey = new CreateAuthKey();
			String authKey =  createAuthKey.createAuthKey();
			
			
			try {
				MimeMessage mail = mailSender.createMimeMessage();
				
				MimeMessageHelper helper = new MimeMessageHelper(mail, true, "UTF-8");
				
				
				
				helper.setTo(email); // 받는 사람 이메일
				helper.setSubject("[WheelingCamp] 인증번호"); // 이메일 제목
				helper.setText( loadHtml(authKey, html), true);
				
				mailSender.send(mail);
				
				
			}catch(Exception e) {
				e.printStackTrace();
				return 0;
			}
			
			Map<String, String> map = new HashMap<>();
			map.put("authKey", authKey);
			map.put("method", email);
			
			
			// 먼저 인증 키가 존재하는지 확인
			int result = mapper.selectAuthKey(map);
			
			// 존재하지 않으면 추가하는 insert 구문 실행
			if(result == 0) {
				result = mapper.insertAuthkey(map);
			}else { // 존재하면 update 구문 실행
				result = mapper.updateAuthKey(map);
			}
			
			// 둘다 실패 시 0 반환
			if(result == 0) return 0;
			
			return 1;
		}
		
		// HTML 파일을 읽어와 String 으로 변환
		private String loadHtml(String authKey, String html) {
			
			Context context = new Context();
			
			context.setVariable("authKey", authKey);
			
			return templateEngine.process("email/" + html, context);
		}

		// 인증번호 확인하기
		@Override
		public int checkAuth(Map<String, String> userInfo) {

			return mapper.checkAuth(userInfo);
		}

		// 휴대폰 인증번호 발급
		@Override
		public int sendSMS(String phoneNo) {
			
			
			Message message = new Message();
			
			String authKey =  createAuthKey.createAuthKey();

			// 발신번호 및 수신번호는 반드시 01012345678 형태로 입력.
			message.setFrom("01038070614"); // 발송 번호
			message.setTo(phoneNo); // 송신 번호
			message.setText("[WheelingCamp] 인증번호는\n[" + authKey + "] 입니다"); // 인증번호 출력

			SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
			
			log.info("response = {}", response);
			
			
			Map<String, String> map = new HashMap<>();
			map.put("authKey", authKey);
			map.put("method", phoneNo);
			
			// 먼저 인증 키가 존재하는지 확인
			int result = mapper.selectAuthKey(map);
			
			// 존재하지 않으면 추가하는 insert 구문 실행
			if(result == 0) {
				result = mapper.insertAuthkey(map);
			}else { // 존재하면 update 구문 실행
				result = mapper.updateAuthKey(map);
			}
			
			// 둘다 실패 시 0 반환
			if(result == 0) return 0;
			
			return 1;
		}

	
}
