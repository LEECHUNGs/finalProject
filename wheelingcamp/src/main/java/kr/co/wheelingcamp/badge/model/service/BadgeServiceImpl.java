package kr.co.wheelingcamp.badge.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.wheelingcamp.badge.model.dto.Badge;
import kr.co.wheelingcamp.badge.model.mapper.BadgeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BadgeServiceImpl implements BadgeService{

	private final BadgeMapper mapper;

	// 뱃지목록 조회
	@Override
	public Map<String, Object> selectBadgeList(int memberNo) {
		
		// 로그인한 회원의 뱃지 목록 조회
		List<Badge> badgeList = mapper.selectBadgeList(memberNo);
		
		// 로그인한 회원의 뱃지 수 조회
		int badgeCount = mapper.getBadgeCount(memberNo);
		
		Map<String,Object> map = new HashMap<String, Object>();
		
		map.put("badgeList", badgeList);
		map.put("badgeCount", badgeCount);
		
		return map;
	}

	// 대표뱃지 선택
	@Override
	public int selectedBadge(int memberNo, int badgeNo) {
		// 모든 뱃지의 SELECTED_BADGE 값을 'N'으로 초기화
		int result =  mapper.resetSelectedBadge(memberNo);
		System.out.println("결과"+result);
        if(result > 0) {

        	int updateResult =mapper.selectedBadge(memberNo,badgeNo);
        	
        	return updateResult;
        	 
        }

       return 0;
	}

	// 대표뱃지 마이페이지에서 보여주기
	@Override
	public Badge showSelectedBadge(int memberNo) {
		
		Badge result = mapper.showSelectedBadge(memberNo);
		log.debug("result1"+result);
		if(result == null) {
			log.debug("result2"+result);
		}
		log.debug("result3"+result);
		return result;
	}
}
