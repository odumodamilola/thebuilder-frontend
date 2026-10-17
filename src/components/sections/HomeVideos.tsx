import { usePublicData } from "@/context/PublicDataContext";
import SectionTitle from "../ui/SectionTitle";
import Link from "next/link";

export default function HomeVideos() {
  const videos = usePublicData()?.home?.videos || [
    {
      title: "Haftu Strintzos: the long road to Melbourne",
      duration: "12:40",
      date: "6 Oct",
    },
    {
      title: "Inside Shamba Cold’s first cold room",
      duration: "6:05",
      date: "3 Oct",
    },
    {
      title: "Mohamed Semra on civic leadership",
      duration: "18:22",
      date: "30 Sep",
    },
    {
      title: "Explainer: how remittance fees work",
      duration: "4:51",
      date: "27 Sep",
    },
  ];

  const mainVideo = videos[0];
  const sideVideos = videos.slice(1);

  if (!mainVideo) return null;

  return (
    <section className="bg-[var(--surface-inverse-deep)] py-section-mobile md:py-section">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <SectionTitle inverse>Videos</SectionTitle>
          <a
            href="/videos"
            className="hidden md:block font-semibold text-[var(--text-meta-on-inverse)] hover:text-[var(--text-on-inverse)] transition-colors text-sm"
          >
            All videos →
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[32px]">
          {/* Main Video */}
          <Link
            href={"id" in mainVideo ? `/videos/${mainVideo.id}` : "/videos"}
            aria-label={`Watch ${mainVideo.title}`}
            className="group text-left flex flex-col gap-[12px] min-w-0 rounded-[12px]"
          >
            <div className="w-full aspect-video bg-[var(--surface-inverse)] rounded-[12px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[80%] h-[150%] bg-[var(--decoration-royal)] rounded-bl-full opacity-50 translate-x-[10%] -translate-y-[20%]" />
              <div className="absolute inset-0 tb-dots opacity-20" />
              <div className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--surface-inverse-deep)_20%,transparent)] group-hover:bg-[color:color-mix(in_srgb,var(--surface-inverse-deep)_45%,transparent)] transition-colors duration-250 flex items-center justify-center">
                <div className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--text-on-inverse)] transition-transform duration-250 group-hover:scale-110 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] opacity-0 group-hover:opacity-100 group-hover:animate-[tb-ring_1.2s_ease-out_infinite]" />
                  <div className="w-0 h-0 border-y-[10px] md:border-y-[13px] border-y-transparent border-l-[17px] md:border-l-[21px] border-l-[var(--text-on-inverse)] ml-[4px]"></div>
                </div>
              </div>
              <div className="absolute bottom-[12px] right-[12px] bg-[color:color-mix(in_srgb,var(--surface-inverse-deep)_80%,transparent)] px-2 py-0.5 rounded text-[11px] font-semibold backdrop-blur-sm text-[var(--text-on-inverse)]">
                {mainVideo.duration}
              </div>
            </div>
            <span className="font-display font-bold text-[clamp(20px,2vw,26px)] leading-[1.2] text-[var(--text-on-inverse)] tracking-[-0.01em]">
              {mainVideo.title}
            </span>
            <span className="text-[13px] text-[var(--text-meta-on-inverse)] mt-[-4px]">
              {mainVideo.date}
            </span>
          </Link>

          {/* Side Videos */}
          <div className="flex flex-col gap-4">
            {sideVideos.map((vid, i) => (
              <Link
                key={i}
                href="/videos"
                aria-label={`Watch ${vid.title}`}
                className="group text-left grid grid-cols-[136px_1fr] md:grid-cols-1 lg:grid-cols-[168px_1fr] gap-[16px] items-start min-w-0 rounded-[10px]"
              >
                <div className="w-full aspect-video bg-[var(--surface-inverse)] rounded-[10px] overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-[80%] h-[150%] bg-[var(--decoration-royal)] rounded-bl-full opacity-50 translate-x-[10%] -translate-y-[20%]" />
                  <div className="absolute inset-0 tb-dots opacity-20" />
                  <div className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--surface-inverse-deep)_20%,transparent)] group-hover:bg-[color:color-mix(in_srgb,var(--surface-inverse-deep)_45%,transparent)] transition-colors duration-250 flex items-center justify-center">
                    <div className="w-[44px] h-[44px] bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--text-on-inverse)] transition-transform duration-250 group-hover:scale-110 relative">
                      <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] opacity-0 group-hover:opacity-100 group-hover:animate-[tb-ring_1.2s_ease-out_infinite]" />
                      <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-[var(--text-on-inverse)] ml-[3px]"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-[8px] right-[8px] bg-[color:color-mix(in_srgb,var(--surface-inverse-deep)_80%,transparent)] px-1.5 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm text-[var(--text-on-inverse)]">
                    {vid.duration}
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] min-w-0">
                  <span className="font-display font-bold text-[16px] leading-[22px] text-[var(--text-on-inverse)] break-words">
                    {vid.title}
                  </span>
                  <span className="text-[13px] text-[var(--text-meta-on-inverse)]">
                    {vid.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
