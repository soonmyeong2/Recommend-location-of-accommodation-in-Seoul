# Visualization Application
## 개요
Visualization은 Node.js와 다음 지도 API를 이용한 웹 애플리케이션으로 제작하였다.

## 설치
```
$ git clone https://github.com/philjjoon/2019-1-GROUP-1
$ cd visual/code
$ npm install
```

## 설정
index.js에서 데이터베이스를 설정한다.
```javascript
var database = {
    host: 'localhost',
    user: 'root',
    password: '2019',
    database: 'project'
};
```

## 실행
```
$ node index.js
```
서버는 50077번 포트를 사용한다.
서버의 루트 경로로 접속하면 Visualization Application이 실행된다.

## API
API는 MVC 모델을 적용한 RESTful API로 작성하였다.

### 행정동 목록
```http
GET /adm_dongs
```

응답
```json5
[
  {
    "code": "1102417", // 국토부 행정동 코드(7자리)
    "code2": "1102417500", // 행정안전부 행정동 코드(10자리)
    "address": "서울특별시 사직구 번동", // 주소
    "t1": 0.15321, // Normalize된 공시지가 평균
    "t1_raw": 155481245 // 공시지가 평균 원/km²
    "t2": 0.55213, // Normalize된 생활인구 - 거주인구의 일 평균
    "t2_raw": 48651202011, // 생활인구 - 거주인구의 일 평균
    "f1": 0.55213, // Normalize된 2017년 1월 ~ 2019년 3월 단기체류 외국인 생활인구 총합
    "f1_raw": 48651202011, // 2017년 1월 ~ 2019년 3월 단기체류 외국인 생활인구 총합
    "t3": 0.6647, // Normalize된 숙박업소 호실 수
    "t3_raw": 45, // 숙박업소 호실 수
    "t3_expected": 0.9954, // 예상 숙박업소 호실 수
    "r": 0.3307 // 추천 점수(t3_expected - t3)
  },
  // ...
]
```

### 행정동 정보
```http
GET /adm_dongs/{code}
```
code: 국토부 행정동 코드

응답
```json5
{
  "code": "1102417", // 국토부 행정동 코드(7자리)
  "code2": "1102417500", // 행정안전부 행정동 코드(10자리)
  "address": "서울특별시 사직구 번동", // 주소
  "t1": 0.15321, // Normalize된 공시지가 평균
  "t1_raw": 155481245 // 공시지가 평균 원/km²
  "t2": 0.55213, // Normalize된 생활인구 - 거주인구의 일 평균
  "t2_raw": 48651202011, // 생활인구 - 거주인구의 일 평균
  "f1": 0.55213, // Normalize된 2017년 1월 ~ 2019년 3월 단기체류 외국인 생활인구 총합
  "f1_raw": 48651202011, // 2017년 1월 ~ 2019년 3월 단기체류 외국인 생활인구 총합
  "t3": 0.6647, // Normalize된 숙박업소 호실 수
  "t3_raw": 45, // 숙박업소 호실 수
  "t3_expected": 0.9954, // 예상 숙박업소 호실 수
  "r": 0.3307 // 추천 점수(t3_expected - t3)
}
```
