package kr.co.wheelingcamp.mypage.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MyPageMapper {

	/** 입력한 비밀번호와 현재 비밀번호가 같은지 확인
	 * @param memberNo
	 * @return
	 */
	String checkPw(int memberNo);

	/** 회원 탈퇴
	 * @param memberNo
	 * @return
	 */
	int secession(int memberNo);
}
