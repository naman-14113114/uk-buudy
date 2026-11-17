const CERTIFICATIONS = [
  {
    title: "FDA Registered",
    icon: "/images/certifications/fda-registered.svg",
  },
  {
    title: "B Corporation",
    icon: "/images/certifications/b-corp.svg",
  },
  {
    title: "Good Manufacturing Practice",
    icon: "/images/certifications/gmp-certified.svg",
  },
];

export function SerumCertificationsRow() {
  return (
    <section className="bg-[#f6ede2] pt-2 md:pt-4 pb-14 md:pb-24">
      <div className="buudy-wrap">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-4 items-center">
          {CERTIFICATIONS.map((badge, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center gap-3 md:gap-4 text-left justify-start sm:justify-center mx-auto w-full max-w-[260px] sm:max-w-none"
            >
              <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 flex-none opacity-90">
                <img
                  src={badge.icon}
                  alt={badge.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-medium text-[var(--plum)] leading-snug text-sm md:text-base max-w-[180px]">
                {badge.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
