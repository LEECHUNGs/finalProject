package kr.co.wheelingcamp.board.service;

import java.util.Map;

import kr.co.wheelingcamp.board.dto.Board;

public interface BoardService {

	Map<String, Object> selectBoardList(int cp);

	Board selectOne(Map<String, Integer> map);

	int updateReadCount(int boardNo);

}
