# pkvboard

코드에서 변경되어야 할 부분과 변경되지 않아야 하는 부분이 미리 정의된 형태의 프리셋을 이용하여 코드를 생성할 수 있는 프로그램


# Getting Started / 어떻게 시작하나요?

## 플러그인의 사용
1. 변수의 값을 변경한다.
2. 클립보드로 코드를 복사하거나 파일로 저장한다.

## 플러그인 만들기
1. 프로그램 내부의 /plugins 폴더에 임의의 이름으로 폴더생성
2. plugin_info.json 생성 (플러그인 정보)
3. plugin_source.mustache 생성 (플러그인 코드)

## 플러그인 찾기
https://seatable.ekcapaper.net/dtable/external-links/b33649a9f340452e9470/

## 플러그인 공유
https://seatable.ekcapaper.net/dtable/forms/6052ec13-f691-4a6e-af1e-a680c75e7028/

# 스크린샷

![캡처](https://user-images.githubusercontent.com/63381869/139208671-120d82c1-e462-4a61-a714-ce24325f1f96.PNG)


## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```
