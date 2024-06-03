package kr.co.wheelingcamp.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.web.servlet.server.Session;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.wheelingcamp.member.model.dto.Member;
import kr.co.wheelingcamp.member.model.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SessionAttributes({ "loginMember" })
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("member")
public class MemberController {

	private final MemberService service;

	/**
	 * 로그인 페이지 redirect
	 * 
	 * @return
	 */
	@GetMapping("login")
	public String loginView() {
		
		return "member/login";
	}

	/**
	 * 일반 로그인
	 * 
	 * @param member : 로그인 시 입력받는 아이디와 비밀번호
	 * @param model  : loginMember를 세션에 저장하기 위한 변수
	 * @return
	 */
	@PostMapping("login")
	public String login(Member member, Model model) {

		// 일반 로그인 멤버 검색
		Member loginMember = service.login(member);

		// 로그인 성공 시
		if (loginMember != null) {

			// 세션에 로그인 회원 세팅
			model.addAttribute("loginMember", loginMember);

		} else {

			return "redirect:/";
		}

		return "pages/home";
	}

	/**
	 * 회원가입 페이지 redirect
	 * 
	 * @return
	 */
	@GetMapping("signUp")
	public String signUpView() {
		return "member/signUp";
	}

	/**
	 * 일반 회원가입
	 * 
	 * @param member : 회원가입을 요청한 회원의 정보
	 * @return
	 */
	@PostMapping("signUp")
	public String siginUp(Member member, HttpServletRequest request) {

		// DB에 회원 입력
		int result = service.signUp(member);

		// 아이디 중복 시
		if (result < 0) {
			return "redirect:" + request.getHeader("REFERER");
		}

		log.info("memberNo : {}", member.getMemberNo());

		return "pages/home";
	}

	/**
	 * 카카오 로그인 페이지 이동
	 * 
	 * @return
	 */
	@GetMapping("loginKakao")
	public String loginKakaoView() {

		// 카카오 로그인 url
		String kakaoLoginUrl = service.kakaoLoginUrl();

		return "redirect:" + kakaoLoginUrl;
	}

	/**
	 * 카카오 토큰 발급 + 유저 정보(고유키, 닉네임, 프로필 이미지) 가져오기
	 * 
	 * @return
	 */
	@GetMapping("kakaoCallback")
	public String getKakaoToken(@RequestParam("code") String code, RedirectAttributes ra, Model model) {

		// 카카오 토큰 받기
		String kakaoToken = service.getKakaoToken(code);

		// 받은 카카오 토큰으로 해당 유저 정보를 담은 map
		Map<String, String> userInfo = service.getKakaoUserInfo(kakaoToken);

		// System.out.println("카카오 유저 = " + userInfo);

		// 사용자가 있으면 로그인, 아니면 회원가입 페이지로 이동
		Member loginMember = service.kakaoLogin(userInfo);

		// 존재하지 않는 사용자면 회원가입 페이지로 이동(고유키(아이디), 닉네임, 프로필 이미지 값을 갖고)
		if (loginMember == null) {

			model.addAttribute("userInfo", userInfo);

			return "member/kakaoSignUp";

		}

		model.addAttribute("loginMember", loginMember);
		
		return "redirect:/";
	}

	/**
	 * 카카오 회원가입 진행
	 * 
	 * @param member
	 * @return
	 */
	@PostMapping("kakaoSignUp")
	public String kakaoSignUp(Member member, Model model) {

		log.info("member = {} ", member);

		int result = service.snsSignUp(member);

		log.info("result = {}", result);

		return "redirect:/";
	}

	/**
	 * 구글 로그인 페이지로 이동
	 * 
	 * @return
	 */
	@GetMapping("loginGoogle")
	public String loginGoogleView() {

		// 구글 로그인 url
		String googleLoginUrl = service.googleLoginUrl();

		return "redirect:" + googleLoginUrl;
	}

	/**
	 * 구글 토큰 발급 + 유저 정보(고유키, 이메일...) 가져오기
	 * 
	 * @param code
	 * @return
	 */
	@GetMapping("googleCallback")
	public String getGoogleToken(@RequestParam("code") String code, RedirectAttributes ra, Model model) {

		// 구글 토큰 받기
		String googleToken = service.getGoogleToken(code);
		
		// 받은 구글 토큰으로 해당 유저 정보를 담은 map
		Map<String, String> userInfo = service.getGoogleUserInfo(googleToken);

		// 사용자가 있으면 로그인, 아니면 회원가입 페이지로 이동
		Member loginMember = service.googleLogin(userInfo);

		// (고유키(아이디), 실명, 이메일, 프로필 이미지 값을 갖고)
		if (loginMember == null) {

			model.addAttribute("userInfo", userInfo);

			return "member/googleSignUp";

		}

		model.addAttribute("loginMember", loginMember);
		System.out.println(loginMember);
		
		return "redirect:/";
	}

	/**
	 * 구글 회원가입 진행
	 * 
	 * @param member
	 * @return
	 */
	@PostMapping("googleSignUp")
	public String googleSignUp(Member member, Model model) {

		log.info("member = {} ", member);

		int result = service.snsSignUp(member);

		log.info("result = {}", result);

		return "redirect:/";
	}

	/**
	 * 네이버 로그인 페이지 redirect
	 * 
	 * @return naverLoginUrl
	 */
	@GetMapping("loginNaver")
	public String loginNaverView(HttpServletRequest request) {

		Map<String, String> map = service.naverLoginUrl(request);

		// url 주소
		String naverLoginUrl = map.get("naverLoginUrl");

		// state를 session에 저장
		request.getSession().setAttribute("state", map.get("state"));

		return "redirect:" + naverLoginUrl;
	}

	/**
	 * 네이버 로그인 callBack
	 * 
	 * @return
	 */
	@GetMapping("naverCallBack")
	public String naverCallBack(HttpServletRequest request, RedirectAttributes ra, Model model) {

		// 네이버에서 전달받은 code, state값 가져오기
		String code = request.getParameter("code");
		String state = request.getParameter("state");

		// 세션에 저장해둔 state값 가져오기
		String sessionState = request.getSession().getAttribute("state").toString();

		// CSRF 공격 방지를 위해 state 값 비교하기
		if (!state.equals(sessionState)) {
			request.getSession().removeAttribute("state");
			return "redirect:/";
		}

		// 기본 tokenURL 주소
		String tokenUrl = "https://nid.naver.com/oauth2.0/token";

		// body data 생성
		MultiValueMap<String, String> parameter = service.naverTockenUrl(code, state);

		// request header 설정하기
		HttpHeaders headers = new HttpHeaders();

		// Content-type 설정
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

		// header와 body로 Request 생성
		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(parameter, headers);

		try {

			RestTemplate restTemplate = new RestTemplate();

			// 응답 데이터(json)을 Map으로 받을 수 있도록 관련 메시지 컨버터 추가하기
			restTemplate.getMessageConverters().add(new StringHttpMessageConverter());

			// Post 방식으로 Http 요청하기
			// 응답 데이터 형식은 Hashmap
			ResponseEntity<HashMap> result = restTemplate.postForEntity(tokenUrl, entity, HashMap.class);

			// result의 body 꺼내오기
			Map<String, String> resMap = result.getBody();

			// accessToken 가져오기
			String accessToken = resMap.get("access_token");

			// userinfo 가져오는 base url
			String userInfoUrl = "https://openapi.naver.com/v1/nid/me";

			// Header에 accessToken 삽입
			headers.set("Authorization", "Bearer " + accessToken);

			// Request entity 생성하기
			HttpEntity<?> userInfoEntity = new HttpEntity<>(headers);

			// Post 방식으로 Http 요청
			// 응답 데이터 형식은 Hashmap
			ResponseEntity<HashMap> userResult = restTemplate.postForEntity(userInfoUrl, userInfoEntity, HashMap.class);
			Map<String, Map<String, String>> userResultMap = userResult.getBody();

			// Member 객체에 값 세팅해서 회원가입 or 로그인 수행하기
			Member naverMember = service.naverLogin(userResultMap.get("response"));

			// 로그인 실패인 경우
			if (naverMember == null) {

				String message = "회원가입 실패";
				ra.addFlashAttribute("message", message);

				return "member/login";

			}

			// session scope에 loginMember 넣기
			model.addAttribute("loginMember", naverMember);

			// 세션에 저장된 state값 삭제
			request.getSession().removeAttribute("state");

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "member/loginComplete";
	}

	/**
	 * 이미 로그인된 회원 에러
	 * 
	 * @param ra
	 * @return
	 */
	@GetMapping("loggedInError")
	public String loggedInError(RedirectAttributes ra, HttpServletRequest request) {

		ra.addFlashAttribute("message", "이미 로그인된 회원입니다");

		// 요청 페이지로 반환
		return "redirect:" + request.getHeader("REFERER");
	}

	/**
	 * 로그인 안함 에러
	 * 
	 * @param ra
	 * @return
	 */
	@GetMapping("loggedOutError")
	public String loggedOutError(RedirectAttributes ra, HttpServletRequest request) {

		ra.addFlashAttribute("message", "로그인을 먼저 해주시기 바랍니다");

		// 요청 페이지로 반환
		return "redirect:" + request.getHeader("REFERER");
	}

	/**
	 * 로그아웃
	 * 
	 * @param status
	 * @return
	 */
	@GetMapping("logout")
	public String logout(SessionStatus status) {

		status.setComplete();

		return "redirect:/";
	}
	
	
	/** 아이디 찾아서 반환
	 * @param userInfo
	 * @return
	 */
	@ResponseBody
	@PostMapping("findId")
	public String findId(@RequestBody Map<String, String> userInfo) {
		
		return service.findId(userInfo);
	}
	
	
	/** 비밀번호 찾아서 반환
	 * @param userInfo
	 * @return
	 */
	@ResponseBody
	@PostMapping("findPw")
	public String findPw(@RequestBody Map<String, String> userInfo) {
		
		return service.findPw(userInfo);
	}
	
	

	/**
	 * 아이디 찾기 페이지 redirect
	 * 
	 * @return
	 */
	@GetMapping("findId")
	public String findId() {
		return "member/findId";
	}
	
	/**
	 * 비밀번호 찾기 페이지 redirect
	 * 
	 * @return
	 */
	@GetMapping("findPw")
	public String findPw() {
		return "member/findPw";
	}

}
