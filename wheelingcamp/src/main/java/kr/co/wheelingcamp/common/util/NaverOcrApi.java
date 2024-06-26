package kr.co.wheelingcamp.common.util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

import org.apache.tomcat.util.json.JSONParser;
import org.apache.tomcat.util.json.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StopWatch;

import groovyjarjarantlr4.v4.parse.ANTLRParser.exceptionGroup_return;
import lombok.extern.slf4j.Slf4j;
import retrofit2.http.Url;

//@Slf4j
//@Service
//public class NaverOcrApi {
//
//	@Value("${naver.service.url}")
//	private static String url;
//	
//	@Value("{naver.service.secretKey}")
//	private static String secretKey;
//	
//	
//	public static List<String> callApi(String type, String filePath,String secretKey, String ext, String url){
//		
//		try {
//			URL apiUrl = new URL(url);
//			
//		 HttpURLConnection con = (HttpURLConnection)apiUrl.openConnection();
//	     con.setUseCaches(false);
//	     con.setDoInput(true);
//	     con.setDoOutput(true);
//	     con.setReadTimeout(30000);
//	     con.setRequestMethod(type);
//	     String boundary = UUID.randomUUID().toString().replaceAll("-", "");
//	     con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
//	     con.setRequestProperty("X-OCR-SECRET", secretKey);
//	     JSONObject json = new JSONObject();
//         json.put("version", "V2");
//         json.put("requestId", UUID.randomUUID().toString());
//         json.put("timestamp", System.currentTimeMillis());
//         JSONObject imageJson = new JSONObject();
//         imageJson.put("format", ext);
//         imageJson.put("name", "demo");
//         JSONArray images = new JSONArray();
//         images.put(imageJson);
//         json.put("images", images);
//         
//         LinkedMultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
// 		 params.add("message", json.toString());
//
//         con.connect();
//         DataOutputStream wr = new DataOutputStream(con.getOutputStream());
//         long start = System.currentTimeMillis();
//         File tempFile = File.createTempFile("upload", "tmp");
// 		image.transferTo(tempFile);
// 		params.add("file", new FileSystemResource(tempFile));
//
//
//         int responseCode = con.getResponseCode();
//         BufferedReader br;
//         if (responseCode == 200) {
//             br = new BufferedReader(new InputStreamReader(con.getInputStream()));
//         } else {
//             br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
//         }
//         String inputLine;
//         StringBuffer response = new StringBuffer();
//         while ((inputLine = br.readLine()) != null) {
//             response.append(inputLine);
//         }
//         br.close();
//
//         parseData = jsonparse(response);
//
//     } catch (Exception e) {
//         System.out.println(e);
//     }
//     return parseData;
//	}
	
	
//	public static String execute(ImageParsingRequest request) throws Exception{
//        
//            StopWatch totalTime = new StopWatch();
//            totalTime.start();
//
//            // ----------- 요청 전송 ---------------------
//            StopWatch requestStopWatch = new StopWatch();
//            requestStopWatch.start();
//
//            URL newUrl = new URL(url);
//            HttpURLConnection connection = createRequestHeader(newUrl);
//            createRequestBody(connection, request);
//
//            requestStopWatch.stop();
//            System.out.println("request 생성 시간 : " + requestStopWatch.getTotalTimeMillis() + "ms");
//
//            // ----------- 응답 수신 ---------------------
//            StopWatch responseStopWatch = new StopWatch();
//            responseStopWatch.start();
//
//            StringBuilder response = getResponseData(connection);
//
//            responseStopWatch.stop();
//            System.out.println("응답 수신 시간 : " + responseStopWatch.getTotalTimeMillis() + "ms");
//
//            // ----------- 데이터 파싱 ---------------------
//            StopWatch parsingStopWatch = new StopWatch();
//            parsingStopWatch.start();
//
//            StringBuilder result = parseResponseData(response);
//
//            parsingStopWatch.stop();
//            System.out.println("data parsing 시간 : " + parsingStopWatch.getTotalTimeMillis() + "ms");
//
//            totalTime.stop();
//            System.out.println("Total Time = " + totalTime.getTotalTimeMillis() + "ms");
//            return result.toString();
//
//    }
//
//    private static HttpURLConnection createRequestHeader(URL newUrl) throws Exception {
//        HttpURLConnection connection = (HttpURLConnection) newUrl.openConnection();
//        connection.setUseCaches(false);
//        connection.setDoInput(true);
//        connection.setDoOutput(true);
//        connection.setReadTimeout(5000);
//        connection.setRequestMethod("POST");
//        connection.setRequestProperty("Content-Type", "application/json;");
//        connection.setRequestProperty("X-OCR-SECRET", secretKey);
//        return connection;
//    }
//
//    private static void createRequestBody(HttpURLConnection connection, ImageParsingRequest request) throws Exception {
//        JSONObject image = new JSONObject();
//        image.put("format", "png");
//        image.put("name", "requestImage");
//        image.put("url", request.url());
//
//        JSONArray images = new JSONArray();
//        images.put(image);
//
//        JSONObject requestObject = new JSONObject();
//        requestObject.put("version", "V2");
//        requestObject.put("requestId", UUID.randomUUID().toString());
//        requestObject.put("timestamp", System.currentTimeMillis());
//        requestObject.put("lang", "ko");
//        requestObject.put("resultType", "string");
//        requestObject.put("images", images);
//
//        connection.connect();
//        DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream());
//        outputStream.write(requestObject.toString().getBytes(StandardCharsets.UTF_8));
//        outputStream.flush();
//        outputStream.close();
//    }
//
//    private static BufferedReader checkResponse(HttpURLConnection connection) throws Exception{
//        int responseCode = connection.getResponseCode();
//        BufferedReader reader;
//
//        if (responseCode == 200) {
//            reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//        }
//        else {
//            reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
//        }
//        return reader;
//    }
//
//    private static StringBuilder getResponseData(HttpURLConnection connection) throws Exception{
//        BufferedReader reader = checkResponse(connection);
//        String line;
//        StringBuilder response = new StringBuilder();
//        while ((line = reader.readLine()) != null) {
//            response.append(line);
//        }
//        reader.close();
//        return response;
//    }
//
//    private static StringBuilder parseResponseData(StringBuilder response) throws Exception {
//        JSONParser responseParser = new JSONParser(response.toString());
//        LinkedHashMap<String, String> hashMap = (LinkedHashMap<String, String>) responseParser.parse();
//        JSONObject parsed = new JSONObject(hashMap);
//        JSONArray parsedImages = (JSONArray) parsed.get("images");
//        StringBuilder result = new StringBuilder();
//
//        if (parsedImages != null) {
//            JSONObject parsedImage = (JSONObject) parsedImages.get(0);
//            JSONArray parsedTexts = (JSONArray) parsedImage.get("fields");
//
//            for (int i = 0; i < parsedTexts.length(); i++) {
//                JSONObject current = (JSONObject) parsedTexts.get(i);
//                result.append((String) current.get("inferText")).append(" ");
//            }
//        }
//        return result;
//    }
	
//	
//}
