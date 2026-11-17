export interface CertificationBadge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  alt: string;
}

const CERTIFICATIONS: CertificationBadge[] = [
  {
    id: "fda-registered",
    title: "FDA REGISTERED",
    subtitle: "Facility Registered & Inspected Standards",
    icon: "/images/certifications/fda-registered.svg",
    alt: "FDA Registered Cosmetic Manufacturing Facility",
  },
  {
    id: "b-corp",
    title: "B CORPORATION",
    subtitle: "Verified Environmental & Social Performance",
    icon: "/images/certifications/b-corp.svg",
    alt: "Certified B Corporation - Highest Verified Standards",
  },
  {
    id: "gmp-certified",
    title: "GOOD MANUFACTURING PRACTICE",
    subtitle: "ISO 22716 Clean Standard Certified",
    icon: "/images/certifications/gmp-certified.svg",
    alt: "Good Manufacturing Practice (GMP) ISO 22716 Certified Formulation",
  },
];

export function SerumCertificationsRow() {
  return (
    <section
      aria-label="Product Certifications"
      className="bg-[#f6ede2] border-y border-[rgba(58,31,61,0.06)] py-6 md:py-10"
    >
      <div className="buudy-wrap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 items-stretch">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-[rgba(58,31,61,0.08)] p-4 md:p-8 flex flex-row md:flex-col items-center justify-start md:justify-between text-left md:text-center gap-4 md:gap-0 min-h-0 md:min-h-[210px] shadow-[0_2px_10px_rgba(58,31,61,0.02)] transition-all duration-300 hover:border-[rgba(184,149,86,0.35)] hover:shadow-md group"
            >
              <div className="w-16 h-12 md:w-full md:h-20 shrink-0 flex items-center justify-center">
                <img
                  src={cert.icon}
                  alt={cert.alt}
                  width={120}
                  height={60}
                  loading="lazy"
                  className="max-h-full max-w-[120px] md:max-w-[130px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 md:flex-initial md:mt-4">
                <p className="font-mono text-xs md:text-[13px] font-bold tracking-widest text-[var(--plum)] uppercase leading-tight">
                  {cert.title}
                </p>
                <p className="text-[11px] md:text-xs text-[var(--plum)]/65 mt-0.5 md:mt-1 font-sans leading-snug">
                  {cert.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
