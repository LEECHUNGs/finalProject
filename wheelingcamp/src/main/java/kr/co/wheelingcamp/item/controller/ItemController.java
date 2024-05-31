package kr.co.wheelingcamp.item.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.co.wheelingcamp.item.model.dto.CampEquipment;
import kr.co.wheelingcamp.item.model.dto.Car;
import kr.co.wheelingcamp.item.model.dto.CarStock;
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
	 * @param categoryCode : 카테고리 코드
	 * @param cp           : 페이지 번호
	 * @return
	 */
	@GetMapping("itemList")
	public String itemListView(@RequestParam("categoryCode") int categoryCode,
			@RequestParam(value = "cp", required = false, defaultValue = "1") int cp, Model model) {

		List<Item> itemList = service.selectCategoryAll(categoryCode);

		log.info("itemList : {}", itemList);

		log.info("car : {}", ((Car) itemList.get(0)).getCarName());

		return "item/itemList";
	}

	/**
	 * 상품 상세정보 redirect
	 * 
	 * @param itemNo : 상품 번호
	 * @return
	 */
	@GetMapping("itemDetail")
	public String itemDetailView(@RequestParam("itemNo") int itemNo, 
			@RequestParam("categoryCode") int categoryCode,
			@RequestParam(value="cp", required=false) int cp,
			Model model) {

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
