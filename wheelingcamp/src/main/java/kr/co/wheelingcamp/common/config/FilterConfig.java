package kr.co.wheelingcamp.common.config;

import java.util.Arrays;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import kr.co.wheelingcamp.common.filter.LoggedInFilter;
import kr.co.wheelingcamp.common.filter.LoggedOutFilter;

@Configuration
public class FilterConfig {
	/**
	 * 로그인한 회원 존재시 접근 불가 필터
	 * 
	 * @return
	 */
	@Bean
	public FilterRegistrationBean<LoggedInFilter> loggedInFilter() {
		// Filter
		FilterRegistrationBean<LoggedInFilter> filter = new FilterRegistrationBean<>();

		filter.setFilter(new LoggedInFilter());

		/* 로그인한 회원이 접근할 수 없는 주소 */
		String[] filteringURL = { "/member/signup", "/member/login" };

		// Array.asList(filteringURL) == filteringURL을 List로
		filter.setUrlPatterns(Arrays.asList(filteringURL));

		// 필터 이름 설정
		filter.setName("loginFilter");

		// 필터 순서 지정
		filter.setOrder(1);

		return filter;
	}

	/**
	 * 로그인한 회원 존재하지 않으면 접근 불가 필터
	 * 
	 * @return
	 */
//	@Bean
//	public FilterRegistrationBean<LoggedOutFilter> loggedOutFilter() {
//		// Filter
//		FilterRegistrationBean<LoggedOutFilter> filter = new FilterRegistrationBean<>();
//
//		filter.setFilter(new LoggedOutFilter());
//
//		/* 로그인 하지 않으면 접근할 수 없는 주소 */
//		String[] filteringURL = { "/member/myPage" };
//
//		// Array.asList(filteringURL) == filteringURL을 List로
//		filter.setUrlPatterns(Arrays.asList(filteringURL));
//
//		// 필터 이름 설정
//		filter.setName("logOutFilter");
//
//		// 필터 순서 지정
//		filter.setOrder(1);
//
//		return filter;
//	}

}
