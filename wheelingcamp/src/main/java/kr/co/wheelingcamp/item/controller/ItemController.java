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

		Map<String, Object> map = new HashMap<>();
		map.put("categoryCode", categoryCode);
		map.put("carLocationNo", carLocationNo);
		map.put("rentDate", rentDate);
		map.put("expectDate", expectDate);
		map.put("carGradeNo", carGradeNo);
		map.put("sortNo", sortNo);

		List<?> itemList = service.selectCategoryAll(map);

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

		Item item = service.selectOne(categoryCode, itemNo);

		log.info("item : {}", ((Car) item).getCarGradeName());

		model.addAttribute(item);

		return "item/itemDetail";
	}

}