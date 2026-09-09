import { useEffect, useState } from "react";

function appSrc() {
  return "/";
}

export function PhonePreview() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid-bg flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b0b0c] p-4">
      <div className="relative aspect-[9/19.5] h-[min(86vh,700px)] w-[min(92vw,340px)]">
        <div className="absolute inset-0 rounded-[42px] bg-black shadow-[0_18px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/15" />
        <div className="absolute inset-[10px] overflow-hidden rounded-[34px] bg-[#141312]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-3 text-[13px] font-semibold text-white">
            <span>{time}</span>
            <span className="absolute left-1/2 top-2 h-6 w-[88px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1 text-[10px] opacity-80">5G</span>
          </div>
          <iframe
            title="Wellness & Healing SF"
            src={appSrc()}
            className="h-full w-full border-0 bg-[#141312]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
            <span className="h-1 w-28 rounded-full bg-white/50" />
          </div>
        </div>
      </div>
      <style>{`
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 34px 34px;
        }
      `}</style>
    </div>
  );
}
