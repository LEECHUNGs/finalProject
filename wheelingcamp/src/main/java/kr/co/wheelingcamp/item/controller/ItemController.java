package kr.co.wheelingcamp.item.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.co.wheelingcamp.item.model.dto.CampEquipment;
import kr.co.wheelingcamp.item.model.dto.Car;
import kr.co.wheelingcamp.item.model.dto.Item;
import kr.co.wheelingcamp.item.model.dto.Package;
import kr.co.wheelingcamp.item.model.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 상품 컨트롤러
 */
@Slf4j
@Controller
@RequestMapping("item")
@RequiredArgsConstructor
public class ItemController {

	private final ItemService service;

	/**
	 * 상품 목록 redirect
	 * 
	 * @param categoryCode  : 상품 종류 번호
	 * @param cp            : 페이지 번호
	 * @param carLocationNo : 대여 지역
	 * @param rentDate      : 대여 예정 날짜
	 * @param expectDate    : 반납 예정 날짜
	 * @param carGradeNo    : 차급 (소형, 중형, 대형, 캠핑카)
	 * @param model
	 * @return
	 */
	@GetMapping("itemList")
	public String itemListView(@RequestParam("categoryCode") int categoryCode,
			@RequestParam(value = "cp", required = false, defaultValue = "1") int cp,
			@RequestParam(value = "carLocationNo", required = false, defaultValue = "0") int carLocationNo,
			@RequestParam(value = "rentDate", required = false) String rentDate,
			@RequestParam(value = "expectDate", required = false) String expectDate,
			@RequestParam(value = "carGradeNo", required = false, defaultValue = "0") int carGradeNo,
			@RequestParam(value = "sortNo", required = false, defaultValue = "0") int sortNo, Model model) {

		// Service에서 사용한 변수를 MAP에 세팅
		Map<String, Object> map = new HashMap<>();
		map.put("categoryCode", categoryCode);
		map.put("carLocationNo", carLocationNo);
		map.put("rentDate", rentDate);
		map.put("expectDate", expectDate);
		map.put("carGradeNo", carGradeNo);
		map.put("sortNo", sortNo);

		// 검색된 상품 목록을 가져옴
		List<?> itemList = service.selectCategoryAll(map);

		// 상품 목록을 종류에 따라 각각의 객체로 다운캐스팅후 request scope에 세팅
		switch (categoryCode) {
		case 1:
			List<Car> carList = (List<Car>) itemList;
			model.addAttribute("itemList", carList);
			break;
		case 2:
			List<CampEquipment> campEquipmentList = (List<CampEquipment>) itemList;
			model.addAttribute("itemList", campEquipmentList);
			break;
		case 3:
			List<Package> packageList = (List<Package>) itemList;
			model.addAttribute("itemList", packageList);
			break;
		}

		return "item/itemList";
	}
	
	

	/**
	 * 상품 상세정보 redirect
	 * 
	 * @param itemNo : 상품 번호
	 * @return
	 */
	@GetMapping("itemDetail")
	public String itemDetailView(@RequestParam("itemNo") int itemNo, @RequestParam("categoryCode") int categoryCode,
			@RequestParam(value = "cp", required = false) int cp, Model model) {

		if(categoryCode == 1) { // 차인 경우
			
			Item item = service.selectOne(categoryCode, itemNo);
			model.addAttribute("item",((Car)item)); 
			return "item/itemDetail";
			
		} else if (categoryCode == 2) { // 캠핑용품인 경우
			
			Item item = service.selectOne(categoryCode, itemNo);
			model.addAttribute("item",((CampEquipment)item)); 
			return "item/itemDetail";
			
		} else { // 패키지인 경우
			
			Item item = service.selectOne(categoryCode, itemNo);
			model.addAttribute("item",((Package)item)); 
			
			log.info("info : {}", (item).getItemNo());
			
			return "item/itemDetail";
			
		}
	}

}
