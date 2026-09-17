import type { Participant } from "../../../types/participant";

const MOCK_PARTICIPANT_NAMES = [
  "강서연", "고유진", "구민서", "권지우", "김하은",
  "나서윤", "남예린", "남지아", "노수빈", "노하린",
  "마예진", "명서현", "문다은", "문지유", "민채원",
  "박서연", "박지민", "방유나", "배수아", "백예원",
  "서나연", "성지안", "소예은", "손하윤", "신유정",
  "안소윤", "양지현", "오하영", "윤서아", "이채은",
  "장민지", "전예서", "정다인", "조수연", "진하은",
  "차서영", "차유림", "채나은", "최다현", "최예빈",
  "팽지수", "편서진", "편유진", "표나현", "표소민",
  "한서희", "허지윤", "현수빈", "홍다연", "황예나",
] as const;

export const MOCK_PARTICIPANTS: Participant[] = MOCK_PARTICIPANT_NAMES.map(
  (name, index) => ({ id: `participant-${index + 1}`, name }),
).sort((first, second) => first.name.localeCompare(second.name, "ko"));
