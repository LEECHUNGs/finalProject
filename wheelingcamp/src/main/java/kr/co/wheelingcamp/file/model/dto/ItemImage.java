package kr.co.wheelingcamp.file.model.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 상품 이미지 DTO
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ItemImage {
	private int imgNo; // 이미지 번호
	private String imgPath; // 이미지 경로
	private String imgOriginalName; // 이미지 원본 이름
	private String imgRename; // 이미지 업로드명
	private int imgOrder; // 이미지 순서
	private int itemNo; // 대응되는 상품 번호
	private String imgTypeNo; // 상품 이미지 유형
	private MultipartFile uploadFile; // 이미지 삽입/수정
}
