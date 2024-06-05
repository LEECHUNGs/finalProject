package kr.co.wheelingcamp.mypage.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import groovy.util.logging.Slf4j;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.co.wheelingcamp.member.model.dto.Member;
import kr.co.wheelingcamp.mypage.model.service.MyPageService;
import lombok.RequiredArgsConstructor;

@SessionAttributes({ "loginMember" })
@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("myPage")
public class MyPageController {

	private final MyPageService service;

	// 마이페이지 들어가기
	@GetMapping("info")
	public String myPageInfo(

	) {

		return "myPage/info";
	}

	/**
	 * 입력한 비밀번호가 현재 비밀번호와 일치하는지 확인하는 메서드
	 * 
	 * @param request
	 * @param inputPw
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkPw")
	public int checkPw(HttpServletRequest request, @RequestBody String inputPw) {

		HttpSession session = request.getSession();
		Member loginMember = (Member) session.getAttribute("loginMember");
		
		
		int memberNo = loginMember.getMemberNo();

		int result = service.checkPw(memberNo, inputPw);

		System.out.println(result);
		
		return result;
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

//	/**
//	 * 내정보 수정 페이지로 이동
//	 * 
//	 * @return
//	 */
//	@GetMapping("profile")
//	public String profile() {
//		return "myPage/profile";
//	}

	/**
	 * 비밀번호 변경
	 * 
	 * @param request
	 * @param paramMap
	 * @return
	 */
	@ResponseBody
	@PostMapping(value = "changePw", produces = "application/json; charset=UTF-8")
	public int changePw(HttpServletRequest request, @RequestBody Map<String, Object> paramMap) {

		HttpSession session = request.getSession();

		Member loginMember = (Member) session.getAttribute("loginMember");

		int memberNo = loginMember.getMemberNo();
		String currentPw = (String) paramMap.get("currentPw");
		String newPw = (String) paramMap.get("newPw");

		// 현재 비밀번호가 일치하는지 확인
		int result = service.checkPw(memberNo, currentPw);
		int result2 = 0;

		// 현재 비밀번호가 입력한 비밀번호와 일치하는 경우
		if (result != 0) {
			result2 = service.changePw(loginMember, newPw);
		}
		return result2;

	}

//	@GetMapping("profile")
//	public String setAddress(@SessionAttribute("loginMember") Member loginMember, Model model) {
//
//		// 주소만 꺼내옴
//		String memberAddress = loginMember.getMemberAddress();
//
//		// 주소가 있을 경우에만 동작
//		if (memberAddress != null) {
//
//			String[] arr = null;
//		
//			if (memberAddress.equals("^^^^^^")) {
//				arr = new String[3];
//				arr[0] = "";
//				arr[1] = "";
//				arr[2] = "";
//
//			} else {
//
//				arr = memberAddress.split("\\^\\^\\^"); // regEx : 정규표현식
//			}
//
//			model.addAttribute("postcode", arr[0]);
//			model.addAttribute("address", arr[1]);
//			model.addAttribute("detailAddress", arr[2]);
//
//		}
//
//		// /templates/myPage/myPage-info.html로 forward
//		return "myPage/profile";
//	}

	/**
	 * 내정보 수정
	 * 
	 * @return
	 */
	@PostMapping("profile")
	public String profile(Member inputMember, @SessionAttribute("loginMember") Member loginMember,
			 RedirectAttributes ra) {

		
		int memberNo = loginMember.getMemberNo();
		inputMember.setMemberNo(memberNo);

		int result = service.profile(inputMember);

		String message = null;

		if (result > 0) {

			loginMember.setMemberEmail(inputMember.getMemberEmail());
			loginMember.setMemberNickName(inputMember.getMemberNickName());
			loginMember.setMemberAddress(inputMember.getMemberAddress());
			loginMember.setMemberName(inputMember.getMemberName());
			loginMember.setMemberPhoneNo(inputMember.getMemberPhoneNo());
			loginMember.setMemberBirth(inputMember.getMemberBirth());
			
			message = loginMember.getMemberNickName() + "님의 정보가 수정되었습니다";

		} else {
			message = loginMember.getMemberNickName() + "님의 정보 수정에 실패했습니다";

		}
		
		System.out.println(loginMember);
		System.out.println(loginMember.getMemberEmail());
		ra.addFlashAttribute("message", message);

		return "redirect:/myPage/info";

	}
	@GetMapping("profile")
	public String profile() {
		
		return "myPage/profile";
	}
	
	
	
}
