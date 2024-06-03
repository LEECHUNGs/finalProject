package kr.co.wheelingcamp.board.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import kr.co.wheelingcamp.board.dto.Board;

@Mapper
public interface BoardMapper {

	/** 삭제되지 않은 게시판 조회
	 * @return
	 */
	int getListCount();

	/** 게시판 내용 가져오기
	 * @param rowBounds
	 * @return
	 */
	List<Board> selectBoardList(RowBounds rowBounds);

	/** 내가 선택한 게시글 하나 목록 불러오기
	 * @param map
	 * @return
	 */
	Board selectOne(Map<String, Integer> map);

	/** 게시글 조회수 증가
	 * @param boardNo
	 * @return
	 */
	int updateReadCount(int boardNo);

	/** 게시글 조회수 증가 2
	 * @param boardNo
	 * @return
	 */
	int selectReadCount(int boardNo);

}
