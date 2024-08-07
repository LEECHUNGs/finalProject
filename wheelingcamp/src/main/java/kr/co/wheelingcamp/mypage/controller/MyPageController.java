package kr.co.wheelingcamp.mypage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import groovy.util.logging.Slf4j;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.co.wheelingcamp.badge.model.dto.Badge;
import kr.co.wheelingcamp.badge.model.service.BadgeService;
import kr.co.wheelingcamp.cart.model.dto.Cart;
import kr.co.wheelingcamp.cart.model.service.CartService;
import kr.co.wheelingcamp.item.model.dto.Item;
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
	
	private final BadgeService badgeService;
	
	private final CartService cartService;

	// 마이페이지 들어가기
	// 소셜 로그인인 경우와 일반 로그인인 경우 다른페이지로 들어가게 하기
//	@PostMapping("info")
//	public String checkInfo(@SessionAttribute("loginMember") Member loginMember, Model model) {
//
//		String memberPw = loginMember.getMemberPw();
//		int memberNo = loginMember.getMemberNo();
//		
//		int result = service.checkInfo(memberNo, memberPw);
//		
//		if(result == 0) {
//			return "myPage/loginApiInfo";
//		}
//		
//		
//		return "myPage/info";
//	}


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

	@GetMapping("profile")
	public String setAddress(@SessionAttribute("loginMember") Member loginMember, Model model) {

		// 주소만 꺼내옴
		String memberAddress = loginMember.getMemberAddress();

		// 주소가 있을 경우에만 동작
		if (memberAddress != null) {

			String[] arr = null;
			
			if (memberAddress.equals("^^^^^^")) {
				arr = new String[3];
				arr[0] = "";
				arr[1] = "";
				arr[2] = "";

			} else {

				 arr = memberAddress.split("\\^\\^\\^", -1); // regEx : 정규표현식
			}

			// 배열의 길이에 따른 처리
	        String postcode = arr.length > 0 ? arr[0] : "";
	        String address = arr.length > 1 ? arr[1] : "";
	        String detailAddress = arr.length > 2 ? arr[2] : "";

	        model.addAttribute("postcode", postcode);
	        model.addAttribute("address", address);
	        model.addAttribute("detailAddress", detailAddress);
		}

		return "myPage/profile";
	}

	/**
	 * 내정보 수정
	 * 
	 * @return
	 */
	@PostMapping("profile")
	public String profile(Member inputMember, @SessionAttribute("loginMember") Member loginMember,
			 @RequestParam("memberAddress")String[] memberAddress,RedirectAttributes ra,Model model) {

		int memberNo = loginMember.getMemberNo();
		inputMember.setMemberNo(memberNo);

		int result = service.profile(inputMember,memberAddress);

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

	/** 프로필 이미지 변경 
	 * @param profileImg
	 * @param loginMember
	 * @param ra
	 * @return
	 */
	@PostMapping("changeProfileImg")
	public String changeProfileImg(@RequestParam("profileImg") MultipartFile uploadFile,
						  @SessionAttribute("loginMember") Member loginMember,
						  RedirectAttributes ra ) throws Exception {
		
		// 서비스 호출
		// 현재 로그인한 회원의 PROFILE_IMG 컬럼값으로 수정(UPDATE)
		int result = service.changeProfileImg(uploadFile, loginMember);
		String message = null;
		
		if(result >0) message ="변경 성공!";
		else message ="변경 실패";
		
		ra.addFlashAttribute("message", message);
		

		return "redirect:info";
	}
	
	/**마이페이지 메인페이지로 들어가기
	 * @return
	 */
	@GetMapping("info")
	public String info(Model model, @SessionAttribute("loginMember") Member loginMember) {
		model.addAttribute("loginMember", loginMember);
		
		int memberNo = loginMember.getMemberNo();
		
		Member license = service.getMyLicense(memberNo);
		//뱃지목록 조회
		
		Badge badge = badgeService.showSelectedBadge(memberNo);
		model.addAttribute("badge",badge);
		model.addAttribute("license",license);
		
		
		
		
		return "myPage/info";
	}
	
	@GetMapping("cart")
	public String cart() {
	
		return "mypage/cart";
	}
	
	
	
	/** 소셜 로그인인지 일반로그인인지 확인하기
	 * @param model
	 * @param loginMember
	 * @return
	 */
	@PostMapping("checkingLogin")
	@ResponseBody
	public int checkingLogin(Model model,@SessionAttribute("loginMember") Member loginMember) {
		model.addAttribute("loginMember",loginMember);
		int memberNo = loginMember.getMemberNo();
		int result = service.checkingLogin(memberNo);
	    System.out.println("최종 result:" + result);

	    return result;
	}
	
	
	/** 로그인한 회원의 대여용 장바구니 정보 불러오기
	 * @param member
	 * @return
	 */
	@GetMapping("cartList")
	public String cartList(@ModelAttribute("loginMember") Member member,
							Model model) {
		
		// 대여 상품, 구매상품 리스트
		Map<String, List<Cart>> cartMap = cartService.getCartList(member.getMemberNo());
		
		model.addAttribute("rentalList", cartMap.get("rentalList"));
		model.addAttribute("shoppingList", cartMap.get("shoppingList"));
		
		System.out.println(cartMap.get("rentalList"));
		System.out.println(cartMap.get("shoppingList"));
		
		return "myPage/cartList";
	}
	
	
	/**
	 * 관심상품 페이지 이동
	 * 
	 * @return
	 */
	@GetMapping("interest")
	public String interest() {

		return "myPage/interest";
	}
	
	
	/** 주문내역 페이지로 이동
	 * @return
	 */
	@GetMapping("myOrderList")
	public String payList(
			Model model,
			@SessionAttribute("loginMember") Member loginMember
			) {
		
		List<Item> itemListBorrow = service.myOrderListBorrow(loginMember.getMemberNo());	
		List<Item> itemListPurchase = service.myOrderListPurchase(loginMember.getMemberNo());
		
		List<Item> itemListBorrowCancle = service.itemListBorrowCancle(loginMember.getMemberNo());
		
		List<Item> itemListPurchaseCancle = service.itemListPurchaseCancle(loginMember.getMemberNo());
		
		 System.out.println("itemListBorrow : " + itemListBorrow);
		 System.out.println("itemListPurchase :" + itemListPurchase);
		 
		 model.addAttribute("itemListBorrow", itemListBorrow);	
		 model.addAttribute("itemListPurchase", itemListPurchase);
		 
		 model.addAttribute("itemListBorrowCancle", itemListBorrowCancle);	
		 model.addAttribute("itemListPurchaseCancle", itemListPurchaseCancle);
		 
		 return "myPage/orderList";
	}
	
	
	/** 대여 취소 하기
	 * @param model
	 * @param loginMember
	 * @param rentDetailNo
	 * @return
	 */
	@GetMapping("borrowListCancle")
	public String borrowListCancle(
			@SessionAttribute("loginMember") Member loginMember,
			@RequestParam("rentDetailNo") int rentDetailNo,
			RedirectAttributes ra
			) {
		
		int result = service.borrowListCancle(rentDetailNo);
		
		String message = null;
		String path = null;
		
		if(result > 0) {
			message = "대여 취소 완료";
			
			path = "redirect:/myPage/myOrderList"; 
			}else {
				
			message = "취소 실패";
			
			
			path = "redirect:/myPage/myOrderList";
			}
		
	  ra.addFlashAttribute("message", message);	
		return path;
	}
	
	/** 구매 취소 하기
	 * @param ra
	 * @param loginMember
	 * @param purchaseDetailNo
	 * @return
	 */
	@GetMapping("purchaseListCancle")
	public String purchaseListCancle(
			RedirectAttributes ra,
	        @SessionAttribute("loginMember") Member loginMember,
	        @RequestParam("purchaseDetailNo") int purchaseDetailNo) {

	    int result = service.purchaseListCancle(purchaseDetailNo);
	    
	    String path = null;
	    
	    if(result > 0) {
	    	ra.addFlashAttribute("message", "구매 취소 완료")	;    }else {
	    		ra.addFlashAttribute("message", "취소 실패") ;   	}

//	    Map<String, String> response = new HashMap<>();
//	    if (result > 0) {
//	        response.put("message", "구매 취소 완료");
//	        return ResponseEntity.ok(response);
//	    } else {
//	        response.put("message", "취소 실패");
//	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//	    }
	    
	    return "redirect:/myPage/myOrderList";
	}

	@GetMapping("borrorDeleteCancle")
	public String borrorDeleteCancle(
			RedirectAttributes ra,
			@SessionAttribute("loginMember") Member loginMember,
			@RequestParam("RentDetailNo") int rentDetailNo
			) {
		
		
		int result = service.borrowDeleteCancle(rentDetailNo);
		
		String path = null;
		
		if(result > 0) {
			ra.addFlashAttribute("message", "철회 완료")	;    }else {
				ra.addFlashAttribute("message", "철회 실패") ;   	}
		
		
		return "redirect:/myPage/myOrderList";
	}
	
	/** 구매 취소 철회
	 * @param ra
	 * @param loginMember
	 * @param purchaseDetailNo
	 * @return
	 */
	@GetMapping("PurchaseDeleteCancle")
	public String PurchaseDeleteCancle(
			RedirectAttributes ra,
	        @SessionAttribute("loginMember") Member loginMember,
	        @RequestParam("purchaseDetailNo") int purchaseDetailNo
			) {
		
		
		int result = service.purchaseDeleteCancle(purchaseDetailNo);
		
			String path = null;
	    
				if(result > 0) {
						ra.addFlashAttribute("message", "철회 완료")	;    }else {
						ra.addFlashAttribute("message", "철회 실패") ;   	}

	    
	    return "redirect:/myPage/myOrderList";
	}
	
	
	
	
	
	
//   @ResponseBody
//   @GetMapping("myOrderListRe")
//   public List<Item> myOrderListRe(
//		   @SessionAttribute("loginMember") Member loginMember
//		   ){
//	   
//	   List<Item> items = service.myOrderListRe(loginMember.getMemberNo());
//	    System.out.println("Returned items: " + items); // 로그 추가
//	    return items;
//	   
//	  
//   }
	
}
