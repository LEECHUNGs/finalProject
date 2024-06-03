package kr.co.wheelingcamp.common.util;

import org.springframework.stereotype.Component;

@Component
public class CreateAuthKey {
	/**
	 * 인증 코드 생성 (영어 대문자 + 소문자 + 숫자 6자리)
	 * 
	 * @return
	 */
	public String createAuthKey() {
		String key = "";
		for (int i = 0; i < 6; i++) {

			int sel1 = (int) (Math.random() * 3); // 0:숫자 / 1,2:영어

			if (sel1 == 0) {
				int num = (int) (Math.random() * 10); // 0~9
				key += num;

			} else {
				char ch = (char) (Math.random() * 26 + 65); // A~Z
				int sel2 = (int) (Math.random() * 2); // 0:소문자 / 1:대문자

				if (sel2 == 0) {
					ch = (char) (ch + ('a' - 'A')); // 대문자로 변경
				}
				key += ch;
			}
		}
		return key;
	}
}
