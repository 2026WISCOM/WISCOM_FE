import storyPlaceholder from "../../../assets/project-placeholder.svg";
import type { NeverEndingStory } from "../../../types/neverEndingStory";

export const MOCK_NEVER_ENDING_STORIES: NeverEndingStory[] = [
  { name: "김미주", introduction: "코드뒤의이야기", width: 4, height: 5 },
  { name: "김은서", introduction: "우리의첫도전", width: 4, height: 3 },
  { name: "이채은", introduction: "함께여서가능했어", width: 1, height: 1 },
  { name: "황민지", introduction: "마지막까지한걸음", width: 3, height: 4 },
  { name: "장은선", introduction: "상상을그리다", width: 16, height: 9 },
  { name: "강서연", introduction: "오늘도성장중", width: 4, height: 5 },
  { name: "고유진", introduction: "작은발견의순간", width: 3, height: 4 },
  { name: "구민서", introduction: "기록하고싶은날", width: 1, height: 1 },
  { name: "권지우", introduction: "끝이아닌시작", width: 4, height: 3 },
  { name: "김하은", introduction: "우리가만든시간", width: 2, height: 3 },
  { name: "나서윤", introduction: "다시만날이야기", width: 4, height: 5 },
  { name: "남예린", introduction: "다음장을향해서", width: 1, height: 1 },
].map((story, index) => ({
  ...story,
  id: `story-${index + 1}`,
  image: storyPlaceholder,
  content: "졸업 전시를 준비하며 남긴 이야기입니다. 함께 고민하고 도전했던 순간들을 이곳에 담을 예정입니다.",
}));
