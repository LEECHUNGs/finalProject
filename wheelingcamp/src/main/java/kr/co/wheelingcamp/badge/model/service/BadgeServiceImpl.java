package kr.co.wheelingcamp.badge.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.wheelingcamp.badge.model.dto.Badge;
import kr.co.wheelingcamp.badge.model.mapper.BadgeMapper;
import lombok.RequiredArgsConstructor;

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
}