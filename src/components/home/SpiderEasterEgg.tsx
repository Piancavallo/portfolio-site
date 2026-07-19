import { useCallback, useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { SPIDER_EGG_DEFAULTS as D } from './spiderEggDefaults';
import spiderStillUrl from '../../assets/spider.png?url';
import '../../styles/spider-easter-egg.css';

type Phase = 'idle' | 'descending' | 'finished';

type RunGeometry = {
  silkX: number;
  silkLength: number;
  dropDistance: number;
};

interface Props {
  label?: string;
  className?: string;
}

export default function SpiderEasterEgg({ label = 'spider', className = '' }: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timersRef = useRef<number[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [run, setRun] = useState<RunGeometry | null>(null);
  const [mounted, setMounted] = useState(false);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => clearTimers();
  }, [clearTimers]);

  const markFinished = useCallback(() => {
    setPhase('finished');
    setRun(null);
    schedule(() => setPhase('idle'), 0);
  }, [schedule]);

  const startRun = useCallback(() => {
    console.log('[spider egg] click', { phase });
    if (phase !== 'idle') {
      console.log('[spider egg] ignored — not idle');
      return;
    }
    const el = triggerRef.current;
    if (!el) {
      console.log('[spider egg] no trigger ref');
      return;
    }

    clearTimers();

    const rect = el.getBoundingClientRect();
    const silkX = rect.left + rect.width / 2;
    const dropDistance = D.dropDistancePx;
    const silkLength = dropDistance;

    console.log('[spider egg] start drop', { silkX, dropDistance });
    setRun({ silkX, silkLength, dropDistance });
    setPhase('descending');
    schedule(markFinished, D.dropDurationMs + D.landingDelayMs);
  }, [phase, clearTimers, schedule, markFinished]);

  const onActorAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.animationName.includes('spider-egg-drop')) {
        clearTimers();
        schedule(markFinished, D.landingDelayMs);
      }
    },
    [clearTimers, schedule, markFinished],
  );

  const cssVars: CSSProperties | undefined = run
    ? ({
        ['--silk-x' as string]: `${run.silkX}px`,
        ['--silk-length' as string]: `${run.silkLength}px`,
        ['--drop-distance' as string]: `${run.dropDistance}px`,
        ['--drop-duration' as string]: `${D.dropDurationMs / 1000}s`,
        ['--frame-width' as string]: `${D.frameWidth}px`,
        ['--frame-height' as string]: `${D.frameHeight}px`,
        ['--spider-still' as string]: `url("${spiderStillUrl}")`,
      } as CSSProperties)
    : undefined;

  const showOverlay = mounted && run && phase === 'descending';

  const overlay = showOverlay
    ? createPortal(
        <div className="spider-egg spider-egg__layer" style={cssVars} aria-hidden="true">
          <div className="spider-egg__silk" />
          <div
            className="spider-egg__actor spider-egg__actor--descending"
            onAnimationEnd={onActorAnimationEnd}
          />
        </div>,
        document.body,
      )
    : null;

  const triggerClass = ['bio-home__effect', 'spider-egg__trigger', className].filter(Boolean).join(' ');

  return (
    <span className="spider-egg">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-label={label}
        onClick={startRun}
      >
        {label}
      </button>
      {overlay}
    </span>
  );
}
