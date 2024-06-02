package kr.co.wheelingcamp.mypage.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import groovy.util.logging.Slf4j;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.co.wheelingcamp.member.model.dto.Member;
import kr.co.wheelingcamp.mypage.model.service.MyPageService;
import lombok.RequiredArgsConstructor;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("myPage")
public class MyPageController {

	private final MyPageService service;
	 
	//마이페이지 들어가기
	@RequestMapping("info")
	public String myPageInfo(){
		
		return "myPage/info";
	}
	
	/**입력한 비밀번호가 현재 비밀번호와 일치하는지 확인하는 메서드
	 * @param request
	 * @param inputPw
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkPw")
	public String checkPw(HttpServletRequest request, @RequestParam String inputPw,
							RedirectAttributes ra) {
		
		HttpSession session = request.getSession();
		Member loginMember = (Member)session.getAttribute("loginMember");
		int memberNo = loginMember.getMemberNo();
		
		int result =service.checkPw(memberNo,inputPw);
			
		if(result == 0) {
			
			return "비밀번호가 일치하지 않습니다";
		}
		if(result == 2) {
			
			return "홈페이지 회원만 정보 수정이 가능합니다";
		}
		
		
		return  "redirect:/myPage/profile";
	}
	
	/**
	 * 회원 탈퇴
	 * 
	 * @param request
	 * @param ra
	 * @return
	 */
	@PostMapping("secession")
	public String secession(HttpServletRequest request, RedirectAttributes ra, SessionStatus status) {
		// 현재 세션
		HttpSession session = request.getSession();

		Member loginMember = (Member) session.getAttribute("loginMember");

		if (loginMember == null) { // 세션은 존재하지만 로그인한 회원은 존재하지 않을 경우
			ra.addFlashAttribute("message", "로그인한 유저가 존재하지 않습니다");

			return "redirect:" + request.getHeader("REFERER");
		}

		int result = service.secession(loginMember.getMemberNo());

		// 성공 시
		if (result > 0) {

			// 세션 만료 (로그아웃)
			status.setComplete();

			ra.addFlashAttribute("message", "성공적으로 탈퇴가 완료되었습니다");

			return "redirect:/";
		}

		// 이외의 방법으로 실패 시
		ra.addFlashAttribute("message", "실패");

		return "redirect:/myPage/info";
	}
	
	
	/** 내정보 수정 페이지로 이동
	 * @return
	 */
	@GetMapping("profile")
	public String profile() {
		return "myPage/profile";
	}

	
	
}
