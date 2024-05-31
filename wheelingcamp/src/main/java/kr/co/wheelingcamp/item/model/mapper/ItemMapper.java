package kr.co.wheelingcamp.item.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wheelingcamp.item.model.dto.CampEquipment;
import kr.co.wheelingcamp.item.model.dto.Car;
import kr.co.wheelingcamp.item.model.dto.Item;
import kr.co.wheelingcamp.item.model.dto.Package;

@Mapper
public interface ItemMapper {

	/**
	 * 차 하나 가져오기
	 * 
	 * @return
	 */
	Item selectOneCar(int itemNo);

	/**
	 * 모든 차 목록 가져오기
	 * 
	 * @param carLocationNo
	 * @param sortNo
	 * @param carGradeNo
	 * @param expectDate
	 * @param rentDate
	 * 
	 * @return
	 */
	List<Car> selectCarAll(Map<String, Object> map);

	/**
	 * 모든 캠핑용품 목록 가져오기
	 * 
	 * @return
	 */
	List<CampEquipment> selectCampEquipmentAll(Map<String, Object> map);

	/**
	 * 모든 패키지 목록 가져오기
	 * 
	 * @return
	 */
	List<Package> selectPackageAll(Map<String, Object> map);

}
