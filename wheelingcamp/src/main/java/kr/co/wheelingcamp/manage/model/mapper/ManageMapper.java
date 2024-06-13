package kr.co.wheelingcamp.manage.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import kr.co.wheelingcamp.item.model.dto.CampEquipment;
import kr.co.wheelingcamp.item.model.dto.Car;
import kr.co.wheelingcamp.item.model.dto.Package;

@Mapper
public interface ManageMapper {

	// -----------------------------------------------------------------------------------

	/**
	 * 카테고리별 상품 전체 개수 탐색
	 * 
	 * @param map
	 * @return
	 */
	int getItemCount(Map<String, Object> map);

	/**
	 * 모든 차 목록 가져오기
	 * 
	 * @param map
	 * @param rowBounds
	 * @return
	 */
	List<Car> selectCarAll(Map<String, Object> map, RowBounds rowBounds);

	/**
	 * 모든 캠핑용품 목록 가져오기
	 * 
	 * @param map
	 * @param rowBounds
	 * @return
	 */
	List<CampEquipment> selectCampEquipmentAll(Map<String, Object> map, RowBounds rowBounds);

	/**
	 * 모든 패키지 목록 가져오기
	 * 
	 * @param map
	 * @param rowBounds
	 * @return
	 */
	List<Package> selectPackageAll(Map<String, Object> map, RowBounds rowBounds);

	// -----------------------------------------------------------------------------------
}
