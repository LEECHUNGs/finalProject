package kr.co.wheelingcamp.interest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interest {

	private int cartNo; // 장바구니 번호
	private int itemNo; // 상품 번호
	private int memberNo; // 회원 번호
	private int saleType; // 판매유형 (1 - 대여, 2 - 구매)

	private int categoryCode; // 카테고리 코드 1- 차 2- 장비 3- 패키지

	private String itemName; // 상품 이름
	private int price; // 상품 가격
	private int sellPrice; // 구매 가격
	private String thumbnail; // 상품 이미지

	private int packageNo; // 패키지 번호

}
