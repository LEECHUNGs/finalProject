package kr.co.wheelingcamp.member.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wheelingcamp.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	/**
	 * 아이디 중복 검사
	 * 
	 * @param checkId
	 * @return
	 */
	int checkId(String checkId);

	/**
	 * 네이버 로그인하기
	 * 
	 * @param map
	 * @return
	 */
	Member snsLoginMember(String checkId);

	/**
	 * 네이버 회원가입 하기
	 * 
	 * @param map
	 * @return
	 */
	int naverSignUp(Map<String, String> map);

	/**
	 * 일반 회원가입
	 * 
	 * @param member
	 * @return
	 */
	int signUp(Member member);

	/**
	 * 카카오 회원가입
	 * 
	 * @param userInfo
	 * @return
	 */
	int kakaoSignUp(Map<String, String> userInfo);

	/**
	 * 구글 회원가입
	 * 
	 * 
	 * @param userInfo
	 * @return
	 */
	int googleSignUp(Map<String, String> userInfo);

	/**
	 * 일반 로그인
	 * 
	 * @param memberId
	 * @return
	 */
	Member login(String memberId);

	/**
	 * 소셜 회원가입(카카오, 구글 추가 입력한 정보)
	 * 
	 * @param member
	 * @return
	 */
	int snsSignUp(Member member);

	/** 아이디 찾아서 반환
	 * @param userInfo
	 * @return
	 */
	String findId(Map<String, String> userInfo);

	/** 비밀번호 찾아서 반환
	 * @param userInfo
	 * @return
	 */
	String findPw(Map<String, String> userInfo);
	
	/** 현재 암호화된 비밀번호 가져오기
	 * @param map
	 * @return
	 */
	String selectMemberPw(Map<String, String> map);

	/** 비밀번호 변경
	 * @param map(memberId, memberPw)
	 * @return
	 */
	int changePw(Map<String, String> map);

	/** 회원가입 시 아이디 중복 검사
	 * @param map
	 * @return
	 */
	int idCheck(Map<String, String> map);

	/** 회원가입 후 1번뱃지 수여(일반로그인)
	 * @param memberNo
	 * @return
	 */
	int updateSignUpBadge(int memberNo);

	/** 회원가입 시 이메일 중복 검사
	 * @param map
	 * @return
	 */
	int emailCheck(Map<String, String> map);

	/** 회원가입 시 전화번호 중복 검사
	 * @param map
	 * @return
	 */
	int phoneNoCheck(Map<String, String> map);

	/** 회원가입 시 닉네임 중복 검사
	 * @param map
	 * @return
	 */
	int nickNameCheck(Map<String, String> map);

	/** 소셜 회원가입 시 이메일 중복 검사
	 * @param email
	 * @return
	 */
	int emailCheckCount(String email);



	



}