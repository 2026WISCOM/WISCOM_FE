# 타이포그래피

`utilities/typography.css`에 정의한 Tailwind 유틸리티를 이름 그대로 사용합니다.
모든 스타일은 Pretendard Variable, normal, 줄 높이 150%를 사용합니다.
명시되지 않은 자간은 0으로 적용합니다.

| 이름 / 클래스 | 크기 | 굵기 | 줄 높이 | 자간 |
| --- | --- | --- | --- | --- |
| `display-large` | 44px | 700 | 66px | 0.44px |
| `display-medium` | 32px | 700 | 48px | 0.32px |
| `display-small` | 28px | 700 | 42px | 0.28px |
| `heading-large` | 24px | 700 | 36px | 0.24px |
| `heading-medium` | 22px | 700 | 33px | 0 |
| `heading-small` | 19px | 700 | 28.5px | 0 |
| `body-large` | 19px | 400 | 28.5px | 0 |
| `body-medium` | 17px | 400 | 25.5px | 0 |
| `body-small` | 15px | 400 | 22.5px | 0 |
| `body-xsmall` | 13px | 400 | 19.5px | 0 |
| `body-xxsmall` | 10px | 400 | 15px | 0 |

```tsx
<h1 className="display-large text-navy">전시 소개</h1>
<p className="body-medium">전시 안내 문구</p>
```

텍스트 스타일을 이름으로 요청하면 해당 클래스를 적용합니다.
크기, 굵기, 줄 높이, 자간을 변경하는 별도 유틸리티는 함께 사용하지 않습니다.
`typography-base`는 프리셋 내부에서만 사용하는 공통 정의입니다.
