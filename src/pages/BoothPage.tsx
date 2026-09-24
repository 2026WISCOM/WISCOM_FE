import BoothFloorPlan from "./booths/components/BoothFloorPlan";

export default function BoothPage() {
  return (
    <div className="bg-white pt-[calc(max(1rem,env(safe-area-inset-top))+4rem+24px)] pb-16">
      <h1 className="sr-only">부스배치도</h1>
      <BoothFloorPlan />
    </div>
  );
}
