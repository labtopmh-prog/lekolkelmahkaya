import React, { useEffect, useRef, useState } from 'react';
import { SkipForward, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { LIBRARY_MEDIA, SEED_TEAM } from '../data/seedData';
import { audioEngine } from '../utils/audioEngine';
import { LibraryButton } from './LibraryButton';
import { EditorialImage } from './EditorialImage';

interface CinematicIntroProps {
  onEnterLibrary: () => void;
  onSkip: () => void;
}

const TOTAL_DURATION_SEC = 24;

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onEnterLibrary,
  onSkip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exteriorImgRef = useRef<HTMLImageElement | null>(null);
  const interiorImgRef = useRef<HTMLImageElement | null>(null);
  const bookImgRef = useRef<HTMLImageElement | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const ext = new Image();
    ext.src = LIBRARY_MEDIA.exterior;
    exteriorImgRef.current = ext;

    const intImg = new Image();
    intImg.src = LIBRARY_MEDIA.interior;
    interiorImgRef.current = intImg;

    const bk = new Image();
    bk.src = LIBRARY_MEDIA.bookArt;
    bookImgRef.current = bk;

    return () => {
      audioEngine.stopAmbientMusic();
    };
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      setElapsed((prev) => {
        const next = prev + dt;
        if (next >= TOTAL_DURATION_SEC) {
          return TOTAL_DURATION_SEC;
        }
        return next;
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Draw animated 8-scene cinematic canvas synchronized with `elapsed`
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 1280;
    const height = canvas.clientHeight || 720;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#FCF9F4');
    bgGrad.addColorStop(0.55, '#FBECEF');
    bgGrad.addColorStop(1, '#F2EEFA');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const drawCoverImage = (
      img: HTMLImageElement | null,
      scale: number,
      offsetX: number,
      offsetY: number,
      alpha: number
    ) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = width / height;
      let drawW = width;
      let drawH = height;
      if (imgAspect > boxAspect) {
        drawH = height;
        drawW = height * imgAspect;
      } else {
        drawW = width;
        drawH = width / imgAspect;
      }
      drawW *= scale;
      drawH *= scale;
      const x = (width - drawW) / 2 + offsetX;
      const y = (height - drawH) / 2 + offsetY;
      ctx.drawImage(img, x, y, drawW, drawH);
      ctx.restore();
    };

    // Scenes 1-5: Garden & Cream-Rose Library Exterior + Doorway Light
    if (elapsed < 15.8) {
      const progress = elapsed / 15.5;
      const zoom = 1.02 + progress * 0.28;
      const panX = Math.sin(elapsed * 0.35) * 14;
      const panY = -progress * 18;
      const fadeOut = elapsed > 14.5 ? 1 - (elapsed - 14.5) / 1.3 : 1;
      drawCoverImage(exteriorImgRef.current, zoom, panX, panY, fadeOut);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const sunGrad = ctx.createRadialGradient(
        width * 0.22,
        height * 0.16,
        10,
        width * 0.22,
        height * 0.16,
        width * 0.55
      );
      sunGrad.addColorStop(0, 'rgba(255, 245, 214, 0.55)');
      sunGrad.addColorStop(1, 'rgba(255, 245, 214, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      for (let i = 0; i < 16; i += 1) {
        const px = ((i * 97 + elapsed * (22 + (i % 4) * 6)) % (width + 60)) - 30;
        const py =
          ((i * 53 + Math.sin(elapsed * 1.4 + i) * 26 + elapsed * 14) %
            (height * 0.85)) +
          20;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(elapsed * 0.7 + i);
        ctx.fillStyle =
          i % 3 === 0
            ? 'rgba(247, 212, 222, 0.78)'
            : i % 3 === 1
              ? 'rgba(229, 219, 247, 0.75)'
              : 'rgba(253, 233, 212, 0.78)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (elapsed >= 13 && elapsed < 15.8) {
        const doorProg = (elapsed - 13) / 2.5;
        ctx.save();
        const doorGlow = ctx.createRadialGradient(
          width * 0.52,
          height * 0.52,
          10,
          width * 0.52,
          height * 0.52,
          width * (0.2 + doorProg * 0.45)
        );
        doorGlow.addColorStop(0, `rgba(255, 250, 238, ${0.45 + doorProg * 0.45})`);
        doorGlow.addColorStop(1, 'rgba(255, 250, 238, 0)');
        ctx.fillStyle = doorGlow;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    }

    // Scene 6: Inside Library Sanctuary
    if (elapsed >= 14.8 && elapsed < 19.3) {
      const local = elapsed - 14.8;
      const fadeIn = Math.min(1, local / 0.9);
      const fadeOut = elapsed > 18.2 ? 1 - (elapsed - 18.2) / 1.1 : 1;
      const scale = 1.04 + (local / 4.5) * 0.14;
      drawCoverImage(interiorImgRef.current, scale, -local * 6, 0, fadeIn * fadeOut);
    }

    // Scenes 7 & 8: Open Book, Rising Luminous Arabic Letters & Final Reveal
    if (elapsed >= 18.2) {
      const local = elapsed - 18.2;
      const fadeIn = Math.min(1, local / 0.9);
      drawCoverImage(bookImgRef.current, 1.02 + Math.min(0.12, local * 0.025), 0, 0, fadeIn * 0.92);

      if (elapsed >= 21.2) {
        const veilAlpha = Math.min(0.62, ((elapsed - 21.2) / 1.5) * 0.62);
        ctx.fillStyle = `rgba(252, 249, 244, ${veilAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      const letters = ['ك', 'ل', 'م', 'ة', 'ح', 'ك', 'ا', 'ي', 'ة', 'ن', 'و', 'ر'];
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      letters.forEach((char, idx) => {
        const cycle = (local * 0.55 + idx * 0.22) % 3.2;
        const rise = cycle / 3.2;
        const x = width * 0.5 + Math.sin(idx * 1.9 + local * 1.1) * (width * 0.18);
        const y = height * 0.62 - rise * (height * 0.42);
        const alpha = Math.sin(rise * Math.PI) * 0.85;
        ctx.font = `700 ${26 + (idx % 3) * 8}px "Amiri", Georgia, serif`;
        ctx.fillStyle = `rgba(196, 154, 69, ${alpha})`;
        ctx.shadowColor = 'rgba(255, 226, 162, 0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText(char, x, y);
      });
      ctx.restore();
    }

    ctx.restore();
  }, [elapsed]);

  const handleToggleSound = () => {
    if (soundEnabled) {
      audioEngine.stopAmbientMusic();
      setSoundEnabled(false);
    } else {
      audioEngine.startAmbientMusic();
      setSoundEnabled(true);
    }
  };

  const handleEnter = () => {
    audioEngine.playPageTurnSfx(soundEnabled);
    audioEngine.stopAmbientMusic();
    onEnterLibrary();
  };

  const handleSkip = () => {
    audioEngine.stopAmbientMusic();
    onSkip();
  };

  const showTeamLineup = elapsed >= 8.8 && elapsed < 15.6;
  const showTitleReveal = elapsed >= 21.2;

  return (
    <section
      aria-label="الفيلم التقديمي لمكتبة كل كلمة حكاية"
      className="relative min-h-screen w-full overflow-hidden bg-[#FCF9F4] flex flex-col justify-between"
    >
      <canvas
        ref={canvasRef}
        data-testid="intro-cinema-canvas"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#FCF9F4]/45 via-transparent to-[#FCF9F4]/65 pointer-events-none" />

      {/* Minimal Top Bar: Brand + Sound + Skip Only */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-10 pt-5 pb-3">
        <span className="font-editorial text-xl md:text-2xl font-bold text-[#2B241E]">
          كل كلمة حكاية
        </span>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الموسيقى الهادئة'}
            className="min-h-[42px] px-3.5 rounded-xl bg-white/85 backdrop-blur-sm border border-[#8C6D46]/15 text-xs font-medium text-[#2B241E] inline-flex items-center gap-2 hover:bg-white transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#8D5B4C] icon-float" aria-hidden="true" />
                <span>الموسيقى تعمل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-[#685D53]" aria-hidden="true" />
                <span>تشغيل الموسيقى</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="min-h-[42px] px-4 rounded-xl bg-white/85 backdrop-blur-sm border border-[#8C6D46]/15 text-xs font-medium text-[#2B241E] inline-flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
          >
            <span>تخطي الفيديو</span>
            <SkipForward className="w-3.5 h-3.5 icon-float" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Center Stage: Team Portraits (Name Only) & Final Library Title */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6">
        {showTeamLineup && (
          <div className="animate-gentle-reveal max-w-4xl w-full bg-[#FCF9F4]/88 backdrop-blur-md rounded-3xl border border-[#C49A45]/25 p-5 md:p-7 shadow-lg text-center">
            <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#2B241E] mb-5">
              فريق كل كلمة حكاية
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
              {SEED_TEAM.map((member, idx) => (
                <div
                  key={member.id}
                  style={{ animationDelay: `${idx * 110}ms` }}
                  className="animate-gentle-reveal flex flex-col items-center p-3 rounded-2xl bg-white/90 border border-[#8C6D46]/12 shadow-xs"
                >
                  <EditorialImage
                    src={member.portraitUrl}
                    alt={member.name}
                    fallbackTitle={member.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#C49A45]/35"
                  />
                  <span className="mt-2.5 text-xs md:text-sm font-bold text-[#2B241E] text-center">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTitleReveal && (
          <div className="animate-gentle-reveal max-w-2xl w-full text-center bg-[#FCF9F4]/85 backdrop-blur-md rounded-3xl border border-[#C49A45]/30 px-6 py-10 md:px-12 md:py-12 shadow-xl">
            <h1 className="font-editorial text-5xl md:text-7xl font-bold text-[#2B241E] leading-tight">
              كل كلمة حكاية
            </h1>
            <p className="mt-4 text-sm md:text-base text-[#685D53] max-w-lg mx-auto leading-relaxed">
              حديقة هادئة من الكتب المختارة، والكلمات التي تلمس القلب، واقتباسات الصباح المضيئة.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LibraryButton
                variant="primary"
                size="lg"
                onClick={handleEnter}
                icon={<ArrowLeft className="w-5 h-5 icon-float" aria-hidden="true" />}
              >
                ادخل المكتبة
              </LibraryButton>
            </div>
          </div>
        )}
      </div>

      <div className="h-6" aria-hidden="true" />
    </section>
  );
};
