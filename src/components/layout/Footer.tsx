import duksungLogo from "../../assets/duksung_logo.svg";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer px-5 pt-3 pb-[35px] text-left text-white">
      <div className="flex flex-col gap-1 text-xs leading-5">
        <p className="text-sm font-medium">WISCOM : Beneath the Surface</p>
        <p className="break-keep">
          덕성여자대학교 컴퓨터공학전공 제36회 졸업 프로젝트 전시회
        </p>
        <p>ⓒ Computer Engineering 2026. All rights reserved.</p>
      </div>
      <img
        src={duksungLogo}
        alt="덕성여자대학교"
        width={150}
        height={34}
        className="mx-auto mt-[34px] h-auto w-[150px]"
      />
    </footer>
  );
}
