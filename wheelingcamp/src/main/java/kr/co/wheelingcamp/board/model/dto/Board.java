package kr.co.wheelingcamp.board.model.dto;

import java.util.List;

import groovy.transform.ToString;
import groovy.transform.builder.Builder;
import kr.co.wheelingcamp.file.model.dto.BoardImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class Board {

	private int boardNo;
	private String boardTitle;
	private String boardContent;
	private String boardDate; // 작성일
	private int readCount;
	private int memberNo;
	
	private String memberNickname;
	private int commentCount;
	private int likeCount;
	private String profileImg;
	private String thumbnail;
	private List<BoardImage> imgList;
	private int likeCheck;
	
}
