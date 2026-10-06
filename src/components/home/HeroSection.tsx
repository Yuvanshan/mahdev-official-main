import React, { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useFirestoreDataContext } from '../../context/FirestoreDataContext';
import { HeroVideoBackground } from '../common/HeroVideoBackground';
import { useDeviceMotion } from '../motion/MotionWrappers';

interface HeroSectionProps {
  onNavigate: (route: string) => void;
  onExploreMahdev: () => void;
  onContactUs?: () => void;
  onExploreServices?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onExploreMahdev,
  onContactUs,
}) => {
  const { homepageConfig } = useFirestoreDataContext();
  const { reducedMotion, isTouch } = useDeviceMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.1,
  });
  const mediaY = useTransform(smoothProgress, [0, 1], ['0px', '100px']);
  const contentY = useTransform(smoothProgress, [0, 1], ['0px', '-48px']);
  const glowY = useTransform(smoothProgress, [0, 1], ['0px', '70px']);
  const heroConfig = homepageConfig?.hero;
  const videoUrl = heroConfig?.mediaType === 'video'
    ? heroConfig.videoUrl || heroConfig.mediaUrl || heroConfig.videoEmbedUrl || ''
    : '';
  const heroImage = heroConfig?.mediaType === 'image'
    ? heroConfig.imageUrl || heroConfig.defaultImageUrl || heroConfig.mediaUrl || ''
    : heroConfig?.defaultImageUrl || heroConfig?.imageUrl || '';

  const navigateTo = (route: string | undefined, fallback: () => void) => {
    const target = route?.trim();
    if (!target) {
      fallback();
    } else if (target.startsWith('#')) {
      const section = document.getElementById(target.slice(1));
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        onExploreMahdev();
      }
    } else {
      onNavigate(target);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[88svh] w-full items-center overflow-hidden bg-[#061033] text-white sm:min-h-[90svh]"
    >
      <motion.div
        aria-hidden="true"
        className="absolute -inset-y-20 inset-x-0"
        style={!reducedMotion && !isTouch ? { y: mediaY } : undefined}
      >
        <HeroVideoBackground
          videoUrl={videoUrl}
          imageUrl={heroImage}
          posterImageUrl={heroImage}
          title={heroConfig?.titleLine1 || 'Homepage hero'}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[8%] aspect-square w-[min(72vw,48rem)] rounded-full border border-cyan-200/10"
        style={!reducedMotion && !isTouch ? { y: glowY } : undefined}
      >
        <div className="absolute inset-[12%] rounded-full border border-white/[0.07]" />
        <div className="absolute inset-[26%] rounded-full bg-cyan-400/10 blur-3xl" />
      </motion.div>

      <motion.div
        className="relative z-20 mx-auto w-full max-w-7xl px-5 py-24 text-left sm:px-8 sm:py-28 lg:px-10 lg:py-32"
        style={!reducedMotion && !isTouch ? { y: contentY } : undefined}
      >
        <motion.div
          className="max-w-3xl space-y-6 sm:space-y-7"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {heroConfig?.badgeText && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 shadow-lg shadow-black/10 backdrop-blur-md sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
              {heroConfig.badgeText}
            </span>
          )}
          <h1 className="space-y-1.5 font-display text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white [text-wrap:balance] drop-shadow-[0_4px_24px_rgba(0,0,0,0.28)]">
            {heroConfig?.titleLine1 && <span className="block">{heroConfig.titleLine1}</span>}
            {heroConfig?.titleHighlight && (
              <span className="block bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-300 bg-clip-text text-transparent">
                {heroConfig.titleHighlight}
              </span>
            )}
            {heroConfig?.titleLine2 && <span className="block text-white/85">{heroConfig.titleLine2}</span>}
          </h1>
          {heroConfig?.description && (
            <p className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg sm:leading-8">
              {heroConfig.description}
            </p>
          )}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 pt-1 sm:gap-4"
          >
            <button
              id="hero-explore-services-btn"
              onClick={() => navigateTo(heroConfig?.primaryCtaLink, onExploreMahdev)}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_-12px_rgba(0,82,255,0.8)] transition duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-cyan-500 hover:shadow-[0_16px_40px_-12px_rgba(0,210,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061033] active:translate-y-0 sm:px-7 sm:text-base"
            >
              <span>{heroConfig?.primaryCtaLabel || 'Explore'}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            {heroConfig?.secondaryCtaLabel && heroConfig.secondaryCtaLink && (
              <button
                type="button"
                onClick={() => navigateTo(heroConfig.secondaryCtaLink, onContactUs || onExploreMahdev)}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061033] sm:px-7 sm:text-base"
              >
                {heroConfig.secondaryCtaLabel}
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <button
        type="button"
        onClick={onExploreMahdev}
        aria-label="Scroll to explore"
        className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65 backdrop-blur-sm transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:inline-flex"
      >
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        Explore
      </button>
    </section>
  );
};
