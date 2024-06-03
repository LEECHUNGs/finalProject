package kr.co.wheelingcamp.auth.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuthMapper {

	/** 기존에 아이디/비밀번호를 찾은 회원의 authkey update
	 * @param map
	 * @return
	 */
	int updateAuthKey(Map<String, String> map);

	/** 처음 아이디/비밀번호를 찾는 회원의 authkey insert
	 * @param map
	 * @return
	 */
	int insertAuthkey(Map<String, String> map);

	/** 인증 번호 확인
	 * @param userInfo
	 * @return
	 */
	int checkAuth(Map<String, String> userInfo);

	/** 인증 한적이 있는지 확인
	 * @param map
	 * @return
	 */
	int selectAuthKey(Map<String, String> map);
	
}
