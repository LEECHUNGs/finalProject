


package kr.co.wheelingcamp.pay;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;



import groovy.util.logging.Slf4j;
import kr.co.wheelingcamp.member.model.dto.Member;
import kr.co.wheelingcamp.pay.model.PaymentService;
import kr.co.wheelingcamp.pay.model.dto.Pay;
import lombok.RequiredArgsConstructor;


/**
 * 
 */
@SessionAttributes({"loginMember"})
@RequiredArgsConstructor
@RequestMapping("payment")
@Controller
public class PaymentController {
	
	private final PaymentService service;
	
	   /** 대여하기 차량   
	 * @param loginMember
	 * @param map
	 * @return
	 */
	@PostMapping("complete")
	   @ResponseBody
	    public ResponseEntity<String> payComplement(
	    		@SessionAttribute("loginMember") Member loginMember,
	    		@RequestBody Map<String, Object> map
	    		) {
		
	        
		  String[] dates = ((String) map.get("dateSpan")).split(" ~ ");
		  
		  String startDate = dates[0].trim(); // "2024. 06. 20"
		  String endDate = dates[1].trim();  // "2024. 06. 25"
		  
		  
		  map.put("rentDate", startDate);
		  map.put("expectDate", endDate);
		  
		  // 갖고온것
		  
		  // memberNo , startDate , endDate , 
		  // 구매가격, 상품이름 , 아이템 번호 , PaymentId
		  
		  
		
		  //payment 에 들어오는 값 paymentId,  totalAmount, orderName 
		 // 보내줘야 되는 값 memberNo
		 map.put("memberNo", loginMember.getMemberNo());
		 
		 
		 
//		 map.put("memberNo", loginMember.getMemberNo());
//		 map.put("paymentId", paymentRequest.getPaymentId());
//		 map.put("totalAmount", paymentRequest.getTotalAmount());
//		 map.put("orderName", paymentRequest.getOrderName());
		 
		 int result = service.setPayList(map);
		 	
		 if(result > 0) {
			 return ResponseEntity.ok("Payment processed successfully.");
		 }else {
			 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed.");
		 }
		 
		 
     
	    }
 
	 
	  
	  
	   /** 패키지 대여하기 
	     * @return
	     */
       @PostMapping("PackageComplete")
       public ResponseEntity<String> payComlementPurchase(
	    		@SessionAttribute("loginMember") Member loginMember,
	    		@RequestBody Map<String, Object> map
	    		){
    	      	     	   
    	   String[] dates = ((String) map.get("dateSpan")).split(" ~ ");
 		  
 		  String startDate = dates[0].trim(); // "2024. 06. 20"
 		  String endDate = dates[1].trim();  // "2024. 06. 25"
 		  
 		  
 		  map.put("rentDate", startDate);
 		  map.put("expectDate", endDate);
 		  
			 map.put("memberNo", loginMember.getMemberNo());
			 
		
			 
			 int result = service.borrowPackageList(map);
			 	
			 if(result > 0) {
				 return ResponseEntity.ok("Payment processed successfully.");
			 }else {
				 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed.");
			 }
			 
			 
	    }
       
       /** 캠핑용품 대여하기 
	     * @return
	     */
      @PostMapping("borrowCamping")
	    public ResponseEntity<String> borrowCamp(
	    		@SessionAttribute("loginMember") Member loginMember,
	    		@RequestBody Map<String, Object> map
	    		){
    	  
    	  System.out.println("payList: payListpayListpayListpayListpayListpayListpayList" + map);
   	   String[] dates = ((String) map.get("dateSpan")).split(" ~ ");
		  
		  String startDate = dates[0].trim(); // "2024. 06. 20"
		  String endDate = dates[1].trim();  // "2024. 06. 25"
		  
		  
		  map.put("rentDate", startDate);
		  map.put("expectDate", endDate);
		  

			 map.put("memberNo", loginMember.getMemberNo());
			 		 	 

			 
			 int result = service.borrowCamping(map);
			 	
			 if(result > 0) {
				 return ResponseEntity.ok("Payment processed successfully.");
			 }else {
				 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed.");
			 }
			 
			 
	    }
      
      
       
       
      /** 캠핑용품 구매하기
	     * @return
	     */
  	@PostMapping("purChaseCamp")
	    public ResponseEntity<String> purChaseCamp(
	    		@SessionAttribute("loginMember") Member loginMember,
	    		@RequestBody Map<String, Object> map
	    		){
			 map.put("memberNo", loginMember.getMemberNo());
			 
			
			 
			 int result = service.purChaseCamping(map);
			 	
			 if(result > 0) {
				 return ResponseEntity.ok("Payment processed successfully.");
			 }else {
				 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed.");
			 }
			 
			 
	    }
	 
  	
  	
  	/** 대여하기 완료했을때 페이지 넘어가기 전에 값 전달하기
  	 * @param categoryCode
  	 * @param model
  	 * @param loginMember
  	 * @return
  	 */
  	@RequestMapping("BorrowComplete")
  	public String carBorrowComplete(
  			@RequestParam("categoryCode") int categoryCode,
  			Model model,
  			@SessionAttribute("loginMember") Member loginMember
  			) {
  		
  		Pay payList = service.getNowPayList(loginMember.getMemberNo());
  		
  		model.addAttribute("payList", payList);
  		model.addAttribute("categoryCode", categoryCode)  ;
  		
       System.out.println("payList : 들어오나요 " + payList);
  		
  		return "complete/Borrow";
  	}
  	
  	  /** 구매(캠핑용품)하기 완료했을때 페이지 넘어가기 전에 값 전달하기
  	 * @param categoryCode
  	 * @param model
  	 * @param loginMember
  	 * @return
  	 */
  	@RequestMapping("PurChaseComplete")
  	  public String PurChaseComplete(
  			  @RequestParam("categoryCode") int categoryCode,
  			  Model model,
  			  @SessionAttribute("loginMember") Member loginMember
  			  ) {
  		
 
  		  
  		  Pay payList = service.getNowPayListPurChase(loginMember.getMemberNo());
  		  
  		  model.addAttribute("payList", payList);
  		  model.addAttribute("categoryCode", categoryCode);
  		 
  		  
  		  return "complete/Purchase";
  	  }
  	
  	@RequestMapping("sumPurchase")
  	public ResponseEntity<String> sumPurchase(
  			@RequestBody Map<String , Object> sumList
  			) {
  		
  		String paymentId = (String) sumList.get("paymentId");
  		
  	// allItems 리스트 가져오기
  	    List<Map<String, Object>> allItems = (List<Map<String, Object>>) sumList.get("allItems");
  		// startDate가 있는 객체들과 없는 객체들을 분류할 리스트 생성
  	    List<Map<String, Object>> itemsWithStartDate = new ArrayList<>();
  	    List<Map<String, Object>> itemsWithoutStartDate = new ArrayList<>();
  	    
  	  // allItems 리스트를 순회하며 startDate 기준으로 분류
  	    for (Map<String, Object> item : allItems) {
  	        if (item.containsKey("startDate") && item.get("startDate") != null) {
  	            itemsWithStartDate.add(item);
  	        } else {
  	            itemsWithoutStartDate.add(item);
  	        }
  	    }
  			
  	  // 분류된 결과 확인 (예시로 콘솔에 출력)
  	    System.out.println("Items with startDate:");
  	    for (Map<String, Object> item : itemsWithStartDate) {
  	        System.out.println(item);
  	    }

  	    System.out.println("Items without startDate:");
  	    for (Map<String, Object> item : itemsWithoutStartDate) {
  	        System.out.println(item);
  	    }
  	    
  	    	int result = service.SumPurchase(
  	    			itemsWithStartDate, 
  	    			itemsWithoutStartDate, 
  	    			paymentId);
	 	
		 if(result > 0) {
			 return ResponseEntity.ok("Payment processed successfully.");
		 }else {
			 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed.");
		 }
  			
  		
  	}
  	
}
