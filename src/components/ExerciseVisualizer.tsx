import React, { useState, useRef, useEffect } from 'react';
import { ExerciseItem } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Wind,
  Info,
  Film,
  Sparkles,
  Layers,
  Compass,
  Crosshair,
  Gauge,
  Flame
} from 'lucide-react';

interface ExerciseVisualizerProps {
  exercise: ExerciseItem;
  phaseLabel?: string;
}

export const ExerciseVisualizer: React.FC<ExerciseVisualizerProps> = ({
  exercise,
  phaseLabel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideo = Boolean(exercise.videoUrl);

  const [activeTab, setActiveTab] = useState<'video' | 'biomechanical' | 'muscles' | 'technique'>(
    hasVideo ? 'video' : 'biomechanical'
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Biomechanical interactive overlay controls
  const [showJointAngles, setShowJointAngles] = useState(true);
  const [showBarPath, setShowBarPath] = useState(true);
  const [showMuscleHeatmap, setShowMuscleHeatmap] = useState(true);

  // Animation frame state for Biomechanical Motion Engine
  const [animTime, setAnimTime] = useState(0);
  const animRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Sync default tab when exercise changes
  useEffect(() => {
    setActiveTab(exercise.videoUrl ? 'video' : 'biomechanical');
    setVideoError(false);
    setCurrentTime(0);
    setAnimTime(0);
    setIsPlaying(true);
  }, [exercise.id, exercise.videoUrl]);

  // Sync video playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Biomechanical requestAnimationFrame loop (guaranteed smooth 60fps)
  useEffect(() => {
    let running = true;
    lastTimestampRef.current = null;

    const loop = (timestamp: number) => {
      if (!running) return;
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1);
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        setAnimTime((prev) => prev + delta * playbackRate);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, playbackRate]);

  const togglePlayPause = () => {
    if (activeTab === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (activeTab === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      setAnimTime(0);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 0.75, 0.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  // Kinetic Phase & Tempo Calculations
  const getPhaseData = () => {
    const cycleDuration =
      exercise.phase === 'warmup' ? 3.0 : exercise.phase === 'stretch' ? 5.0 : 3.6;
    const progress =
      activeTab === 'video' && duration > 0
        ? (currentTime / duration) % 1
        : (animTime / cycleDuration) % 1;

    // Bench Press Specific
    if (exercise.visualType === 'bench-press') {
      if (progress < 0.45) {
        return {
          label: 'ECCENTRIC DESCENT (2.5s)',
          sub: 'Lower bar with 45° tucked elbows to sternum',
          color: 'text-[#C4B5FD]',
          breath: 'Deep diaphragmatic inhale',
          elbowAngle: Math.round(165 - (progress / 0.45) * 80) + '°',
          jointName: 'ELBOW'
        };
      }
      if (progress < 0.6) {
        return {
          label: 'CHEST TOUCHDOWN & LAT BRACE',
          sub: 'Brief pause with full tension on pectorals',
          color: 'text-[#FFB547]',
          breath: 'Maintain intra-abdominal pressure',
          elbowAngle: '85° (TOUCH)',
          jointName: 'ELBOW'
        };
      }
      return {
        label: 'CONCENTRIC DRIVE (1.2s)',
        sub: 'Press up & slightly back along J-curve to lockout',
        color: 'text-[#8B5CF6]',
        breath: 'Forceful exhale through sticking point',
        elbowAngle: Math.round(85 + ((progress - 0.6) / 0.4) * 80) + '°',
        jointName: 'ELBOW'
      };
    }

    // Squat Specific
    if (exercise.visualType === 'squat' || exercise.visualType === 'hip-squat') {
      if (progress < 0.45) {
        return {
          label: 'ECCENTRIC DESCENT (2.5s)',
          sub: 'Hips back, knees track over toes to parallel',
          color: 'text-[#C4B5FD]',
          breath: 'Belly inhale & brace core',
          kneeAngle: Math.round(175 - (progress / 0.45) * 87) + '°',
          jointName: 'KNEE'
        };
      }
      if (progress < 0.58) {
        return {
          label: 'HOLE PAUSE (PARALLEL DEPTH)',
          sub: 'Hip crease below knee, torso rigid',
          color: 'text-[#FFB547]',
          breath: 'Maintain abdominal pressure',
          kneeAngle: '88° (PARALLEL)',
          jointName: 'KNEE'
        };
      }
      return {
        label: 'CONCENTRIC DRIVE (1.2s)',
        sub: 'Drive floor away through midfoot to full lockout',
        color: 'text-[#8B5CF6]',
        breath: 'Exhale as you stand tall',
        kneeAngle: Math.round(88 + ((progress - 0.58) / 0.42) * 87) + '°',
        jointName: 'KNEE'
      };
    }

    // Pull-Ups Specific
    if (exercise.visualType === 'pull-ups') {
      if (progress < 0.4) {
        return {
          label: 'CONCENTRIC PULL (1.5s)',
          sub: 'Depress scapula, drive elbows down to ribs',
          color: 'text-[#8B5CF6]',
          breath: 'Exhale as chest elevates',
          elbowAngle: Math.round(175 - (progress / 0.4) * 110) + '°',
          jointName: 'ELBOW'
        };
      }
      if (progress < 0.55) {
        return {
          label: 'PEAK SQUEEZE (CHIN OVER BAR)',
          sub: 'Retract upper back, squeeze lats',
          color: 'text-[#FFB547]',
          breath: 'Hold peak contraction',
          elbowAngle: '65° (PEAK)',
          jointName: 'ELBOW'
        };
      }
      return {
        label: 'ECCENTRIC DESCENT (2.0s)',
        sub: 'Control lower body back to dead hang',
        color: 'text-[#C4B5FD]',
        breath: 'Inhale as arms lengthen',
        elbowAngle: Math.round(65 + ((progress - 0.55) / 0.45) * 110) + '°',
        jointName: 'ELBOW'
      };
    }

    // Shoulder Press Specific
    if (exercise.visualType === 'shoulder-press') {
      if (progress < 0.45) {
        return {
          label: 'VERTICAL CONCENTRIC DRIVE',
          sub: 'Press barbell straight up overhead',
          color: 'text-[#8B5CF6]',
          breath: 'Exhale through concentric drive',
          elbowAngle: Math.round(80 + (progress / 0.45) * 95) + '°',
          jointName: 'ELBOW'
        };
      }
      if (progress < 0.6) {
        return {
          label: 'OVERHEAD LOCKOUT',
          sub: 'Stack bar over spine, head through window',
          color: 'text-[#FFB547]',
          breath: 'Maintain tall spinal lock',
          elbowAngle: '175° (LOCK)',
          jointName: 'ELBOW'
        };
      }
      return {
        label: 'ECCENTRIC DESCENT',
        sub: 'Control descent down to collarbone',
        color: 'text-[#C4B5FD]',
        breath: 'Inhale on controlled return',
        elbowAngle: Math.round(175 - ((progress - 0.6) / 0.4) * 95) + '°',
        jointName: 'ELBOW'
      };
    }

    // Bent Row Specific
    if (exercise.visualType === 'bent-row') {
      if (progress < 0.45) {
        return {
          label: 'CONCENTRIC ROW DRIVE',
          sub: 'Pull bar to navel, drive elbows behind ribs',
          color: 'text-[#8B5CF6]',
          breath: 'Exhale as bar reaches waist',
          elbowAngle: Math.round(170 - (progress / 0.45) * 95) + '°',
          jointName: 'ELBOW'
        };
      }
      if (progress < 0.6) {
        return {
          label: 'SCAPULAR PEAK SQUEEZE',
          sub: 'Pinch shoulder blades together tightly',
          color: 'text-[#FFB547]',
          breath: 'Hold contraction',
          elbowAngle: '75° (PEAK)',
          jointName: 'ELBOW'
        };
      }
      return {
        label: 'ECCENTRIC RETURN',
        sub: 'Lower bar under control without rounding back',
        color: 'text-[#C4B5FD]',
        breath: 'Inhale as arms extend',
        elbowAngle: Math.round(75 + ((progress - 0.6) / 0.4) * 95) + '°',
        jointName: 'ELBOW'
      };
    }

    // Dumbbell Bicep Curl Specific
    if (exercise.visualType === 'dumbbell-curl') {
      if (progress < 0.45) {
        return {
          label: 'CONCENTRIC BICEP CURL',
          sub: 'Elbows stationary at ribs, supinate wrists',
          color: 'text-[#8B5CF6]',
          breath: 'Exhale as dumbbell ascends',
          elbowAngle: Math.round(170 - (progress / 0.45) * 125) + '°',
          jointName: 'ELBOW'
        };
      }
      if (progress < 0.6) {
        return {
          label: 'PEAK CONTRACTION',
          sub: 'Squeeze biceps at the top without swinging',
          color: 'text-[#FFB547]',
          breath: 'Hold peak squeeze',
          elbowAngle: '45° (PEAK)',
          jointName: 'ELBOW'
        };
      }
      return {
        label: 'ECCENTRIC NEGATIVE (2.5s)',
        sub: 'Resist gravity smoothly down to arms length',
        color: 'text-[#C4B5FD]',
        breath: 'Inhale on controlled descent',
        elbowAngle: Math.round(45 + ((progress - 0.6) / 0.4) * 125) + '°',
        jointName: 'ELBOW'
      };
    }

    // Dynamic Mobility Warmups
    if (exercise.visualType === 'arm-circles') {
      return {
        label: 'SCAPULAR MOBILITY ROTATION',
        sub: 'Smooth continuous 360° shoulder articulation',
        color: 'text-[#8B5CF6]',
        breath: progress < 0.5 ? 'Inhale: Expand chest' : 'Exhale: Arms forward',
        jointName: 'SHOULDER',
        elbowAngle: Math.round((progress * 360) % 360) + '° ARC'
      };
    }

    if (exercise.visualType === 'cat-cow') {
      const isCow = progress < 0.5;
      return {
        label: isCow ? 'COW EXTENSION (INHALE)' : 'CAT THORACIC ARCH (EXHALE)',
        sub: isCow ? 'Drop belly, lift chin & anterior pelvic tilt' : 'Round spine, tuck pelvis & chin to chest',
        color: isCow ? 'text-[#8B5CF6]' : 'text-[#FFB547]',
        breath: isCow ? 'Deep diaphragmatic inhale' : 'Forceful abdominal exhale',
        jointName: 'SPINE',
        elbowAngle: isCow ? 'EXTENDED (+15°)' : 'FLEXED (-25°)'
      };
    }

    // Default Stretches
    if (exercise.phase === 'stretch') {
      return {
        label: progress < 0.5 ? 'LENGTHENING & EXPANSION' : 'DEEP STATIC RELEASE',
        sub: 'Breathe smoothly into target muscle fibers',
        color: 'text-[#A78BFA]',
        breath: '4s Inhale / 6s Parasympathetic Exhale',
        jointName: 'STRETCH',
        elbowAngle: 'STATIC HOLD'
      };
    }

    // Generic Default
    return {
      label: progress < 0.5 ? 'CONCENTRIC PHASE' : 'ECCENTRIC PHASE',
      sub: 'Maintain spinal neutrality and controlled cadence',
      color: 'text-[#8B5CF6]',
      breath: progress < 0.5 ? 'Exhale on drive' : 'Inhale on return',
      jointName: 'JOINT',
      elbowAngle: 'ACTIVE'
    };
  };

  const phaseInfo = getPhaseData();

  // Full Biomechanical Kinetic Simulation SVG for all exercises
  const renderBiomechanicalVisual = () => {
    const t = animTime;
    const type = exercise.visualType;

    const commonDefs = (
      <defs>
        <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="intense-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrow-lime" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#8B5CF6" />
        </marker>
        <marker id="arrow-cyan" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#C4B5FD" />
        </marker>
      </defs>
    );

    // ==========================================
    // 1. BENCH PRESS BIOMECHANICAL SIMULATION
    // ==========================================
    if (type === 'bench-press') {
      const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 (Top lockout) to 1 (Chest touch)
      const barY = 95 + cycle * 70; // 95 (lockout) down to 165 (chest contact)
      const barX = 185 + cycle * 12; // Slight natural J-curve (down and forward to lower chest)
      const elbowY = 145 + cycle * 55;
      const elbowX = 150 - cycle * 8;
      const pecGlow = 0.2 + cycle * 0.8;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          {/* Floor & Rack */}
          <line x1="40" y1="265" x2="360" y2="265" stroke="#262626" strokeWidth="2" />
          <rect x="75" y="80" width="12" height="185" fill="#222" stroke="#383838" strokeWidth="1.5" />
          <path d="M 75,100 L 95,100 L 95,115" stroke="#737373" strokeWidth="3" fill="none" />

          {/* Flat Bench */}
          <rect x="110" y="195" width="170" height="16" rx="4" fill="#1C1C1C" stroke="#333" strokeWidth="2" />
          <line x1="140" y1="211" x2="140" y2="265" stroke="#333" strokeWidth="6" />
          <line x1="250" y1="211" x2="250" y2="265" stroke="#333" strokeWidth="6" />

          {/* Bar Path Trace Line */}
          {showBarPath && (
            <g opacity="0.65">
              <path d="M 185,95 Q 190,130 197,165" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="185" cy="95" r="3" fill="#C4B5FD" />
              <circle cx="197" cy="165" r="3" fill="#8B5CF6" />
              <text x="210" y="100" fill="#C4B5FD" fontSize="8" fontWeight="bold">LOCKOUT (165°)</text>
              <text x="215" y="170" fill="#8B5CF6" fontSize="8" fontWeight="bold">STERNUM TOUCH (85°)</text>
            </g>
          )}

          {/* Athlete Body on Bench */}
          {/* Head */}
          <circle cx="125" cy="180" r="16" fill="#181818" stroke="#F5F5F5" strokeWidth="2" />
          {/* Torso & Arch */}
          <path d="M 138,185 Q 180,172 230,195" fill="none" stroke="#F5F5F5" strokeWidth="10" strokeLinecap="round" />
          
          {/* Muscle Heatmap: Pectoralis Major Tension */}
          {showMuscleHeatmap && (
            <path
              d="M 160,180 Q 185,174 210,182"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="14"
              opacity={pecGlow}
              strokeLinecap="round"
              filter="url(#neon-glow)"
            />
          )}

          {/* Legs & Planted Feet (Driving into floor) */}
          <line x1="230" y1="195" x2="270" y2="215" stroke="#525252" strokeWidth="6" strokeLinecap="round" />
          <line x1="270" y1="215" x2="275" y2="265" stroke="#525252" strokeWidth="6" strokeLinecap="round" />
          <rect x="270" y="260" width="22" height="6" rx="2" fill="#8B5CF6" />

          {/* Arm Kinetics: Shoulder -> Elbow -> Hands/Bar */}
          <line x1="165" y1="180" x2={elbowX} y2={elbowY} stroke="#E5E5E5" strokeWidth="5" strokeLinecap="round" />
          <line x1={elbowX} y1={elbowY} x2={barX} y2={barY} stroke="#E5E5E5" strokeWidth="5" strokeLinecap="round" />
          
          {/* Elbow Joint Indicator with Live Degree Arc */}
          <circle cx={elbowX} cy={elbowY} r="5" fill="#C4B5FD" />
          {showJointAngles && (
            <g>
              <circle cx={elbowX} cy={elbowY} r="14" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={elbowX - 25} y={elbowY + 4} fill="#C4B5FD" fontSize="9" fontWeight="bold">
                {Math.round(85 + (1 - cycle) * 80)}°
              </text>
            </g>
          )}

          {/* Barbell & Plates */}
          <line x1={barX} y1={barY - 35} x2={barX} y2={barY + 35} stroke="#F5F5F5" strokeWidth="6" strokeLinecap="round" />
          <rect x={barX - 6} y={barY - 32} width="12" height="64" rx="3" fill="#8B5CF6" stroke="#111" strokeWidth="1.5" filter="url(#neon-glow)" />
          <circle cx={barX} cy={barY} r="6" fill="#111" stroke="#8B5CF6" strokeWidth="2" />

          {/* Concentric Force Vectors on drive */}
          {cycle < 0.5 && (
            <g>
              <line x1={barX} y1={barY} x2={barX - 8} y2={barY - 30} stroke="#8B5CF6" strokeWidth="3" markerEnd="url(#arrow-lime)" />
            </g>
          )}

          {/* HUD Header */}
          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            BARBELL BENCH PRESS • J-CURVE TRAJECTORY
          </text>
        </svg>
      );
    }

    // ==========================================
    // 2. SQUAT / AIR SQUAT BIOMECHANICAL SIMULATION
    // ==========================================
    if (type === 'squat' || type === 'hip-squat') {
      const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 (Standing) to 1 (Parallel depth)
      const hipY = 155 + cycle * 55;
      const hipX = 165 - cycle * 12;
      const kneeX = 205 + cycle * 18;
      const kneeY = 215;
      const barY = 95 + cycle * 55;
      const barX = 195; // Stays right over midfoot!

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="50" y1="265" x2="350" y2="265" stroke="#262626" strokeWidth="2" />

          {/* Direct Midfoot Plumb Line (Gravity Vector) */}
          {showBarPath && (
            <g opacity="0.65">
              <line x1={barX} y1="70" x2={barX} y2="265" stroke="#C4B5FD" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={barX} cy="265" r="4" fill="#C4B5FD" />
              <text x={barX + 8} y="262" fill="#C4B5FD" fontSize="8" fontWeight="bold">MIDFOOT BALANCE</text>
              <line x1="140" y1="210" x2="260" y2="210" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <text x="270" y="213" fill="#8B5CF6" fontSize="8" fontWeight="bold">PARALLEL PLANE</text>
            </g>
          )}

          {/* Planted Feet */}
          <line x1="180" y1="265" x2="220" y2="265" stroke="#737373" strokeWidth="6" strokeLinecap="round" />
          <circle cx="195" cy="265" r="4" fill="#8B5CF6" />

          {/* Lower Leg (Shin) */}
          <line x1="195" y1="265" x2={kneeX} y2={kneeY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <circle cx={kneeX} cy={kneeY} r="5" fill="#C4B5FD" />

          {/* Thigh (Femur) */}
          <line x1={kneeX} y1={kneeY} x2={hipX} y2={hipY} stroke="#F5F5F5" strokeWidth="6" strokeLinecap="round" />
          <circle cx={hipX} cy={hipY} r="6" fill="#8B5CF6" />

          {/* Muscle Heatmap: Quadriceps & Glute Activation */}
          {showMuscleHeatmap && (
            <g>
              <line
                x1={kneeX}
                y1={kneeY}
                x2={hipX}
                y2={hipY}
                stroke="#8B5CF6"
                strokeWidth="12"
                opacity={0.3 + cycle * 0.7}
                strokeLinecap="round"
                filter="url(#neon-glow)"
              />
              <circle cx={hipX - 6} cy={hipY + 4} r="12" fill="#8B5CF6" opacity={0.25 + cycle * 0.6} filter="url(#neon-glow)" />
            </g>
          )}

          {/* Torso & Head with 45 deg forward incline */}
          <line x1={hipX} y1={hipY} x2={barX} y2={barY + 15} stroke="#F5F5F5" strokeWidth="6.5" strokeLinecap="round" />
          <circle cx={barX + 10} cy={barY - 5} r="16" fill="#1C1C1C" stroke="#F5F5F5" strokeWidth="2" />

          {/* Barbell across traps (for Squat) */}
          {type === 'squat' && (
            <g>
              <circle cx={barX} cy={barY + 15} r="9" fill="#111" stroke="#8B5CF6" strokeWidth="2" filter="url(#neon-glow)" />
              <rect x={barX - 10} y={barY - 5} width="20" height="40" rx="4" fill="#8B5CF6" opacity="0.85" />
            </g>
          )}

          {/* Counter-balance arms (for Air Squat) */}
          {type === 'hip-squat' && (
            <line x1={barX} y1={barY + 25} x2={260} y2={barY + 15} stroke="#C4B5FD" strokeWidth="4" strokeLinecap="round" />
          )}

          {/* Live Joint Degree Arcs */}
          {showJointAngles && (
            <g>
              <circle cx={kneeX} cy={kneeY} r="16" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={kneeX + 18} y={kneeY + 4} fill="#C4B5FD" fontSize="9" fontWeight="bold">
                {Math.round(175 - cycle * 87)}°
              </text>
            </g>
          )}

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            BARBELL SQUAT • VERTICAL MIDFOOT DRIVE
          </text>
        </svg>
      );
    }

    // ==========================================
    // 3. PULL-UPS BIOMECHANICAL SIMULATION
    // ==========================================
    if (type === 'pull-ups') {
      const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 (Dead hang) to 1 (Chin over bar)
      const bodyY = 160 - cycle * 60; // Pulls up from 160 to 100
      const elbowY = bodyY - 10 + cycle * 20;
      const elbowX = 145 + cycle * 18;
      const rElbowX = 255 - cycle * 18;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          {/* Pull-up Bar Rig */}
          <line x1="80" y1="45" x2="320" y2="45" stroke="#737373" strokeWidth="6" strokeLinecap="round" />
          <circle cx="130" cy="45" r="5" fill="#8B5CF6" />
          <circle cx="270" cy="45" r="5" fill="#8B5CF6" />

          {/* Forearms & Arms */}
          <line x1="130" y1="45" x2={elbowX} y2={elbowY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <line x1={elbowX} y1={elbowY} x2="175" y2={bodyY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          
          <line x1="270" y1="45" x2={rElbowX} y2={elbowY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <line x1={rElbowX} y1={elbowY} x2="225" y2={bodyY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          {/* Head (Clearing Bar at peak) */}
          <circle cx="200" cy={bodyY - 25} r="17" fill="#1C1C1C" stroke="#F5F5F5" strokeWidth="2.5" />
          {/* Chin clearance line */}
          {cycle > 0.8 && (
            <text x="200" y="32" fill="#8B5CF6" textAnchor="middle" fontSize="9" fontWeight="bold">
              CHIN CLEARS BAR (PEAK)
            </text>
          )}

          {/* Torso */}
          <rect x="170" y={bodyY - 5} width="60" height="85" rx="10" fill="#181818" stroke="#C4B5FD" strokeWidth="2.5" />

          {/* Muscle Heatmap: Latissimus Dorsi Expansion */}
          {showMuscleHeatmap && (
            <g>
              <path
                d={`M 172,${bodyY + 10} Q 155,${bodyY + 45} 176,${bodyY + 70}`}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="10"
                opacity={0.3 + cycle * 0.7}
                strokeLinecap="round"
                filter="url(#neon-glow)"
              />
              <path
                d={`M 228,${bodyY + 10} Q 245,${bodyY + 45} 224,${bodyY + 70}`}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="10"
                opacity={0.3 + cycle * 0.7}
                strokeLinecap="round"
                filter="url(#neon-glow)"
              />
            </g>
          )}

          {/* Legs hanging with knees crossed */}
          <line x1="188" y1={bodyY + 80} x2="192" y2={bodyY + 140} stroke="#525252" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="212" y1={bodyY + 80} x2="204" y2={bodyY + 140} stroke="#525252" strokeWidth="4.5" strokeLinecap="round" />

          {/* Upward Pull Force Vectors */}
          {cycle > 0.3 && cycle < 0.8 && (
            <line x1="200" y1={bodyY + 40} x2="200" y2={bodyY + 5} stroke="#8B5CF6" strokeWidth="3" markerEnd="url(#arrow-lime)" />
          )}

          {/* Elbow Degree Arc */}
          {showJointAngles && (
            <g>
              <circle cx={elbowX} cy={elbowY} r="14" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={elbowX - 28} y={elbowY + 4} fill="#C4B5FD" fontSize="9" fontWeight="bold">
                {Math.round(175 - cycle * 110)}°
              </text>
            </g>
          )}

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            STRICT PULL-UP • SCAPULAR RETRACTION & LAT DRIVE
          </text>
        </svg>
      );
    }

    // ==========================================
    // 4. OVERHEAD SHOULDER PRESS SIMULATION
    // ==========================================
    if (type === 'shoulder-press') {
      const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 (Rack at collarbone) to 1 (Overhead lockout)
      const barY = 135 - cycle * 75; // Drives up from 135 to 60
      const elbowY = 160 - cycle * 60;
      const elbowX = 165 - cycle * 15;
      const rElbowX = 235 + cycle * 15;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="60" y1="265" x2="340" y2="265" stroke="#262626" strokeWidth="2" />

          {/* Upright Bench */}
          <rect x="180" y="140" width="40" height="120" rx="4" fill="#1C1C1C" stroke="#333" strokeWidth="2" />

          {/* Seated Torso & Head */}
          <circle cx="200" cy="105" r="17" fill="#181818" stroke="#F5F5F5" strokeWidth="2" />
          <rect x="175" y="125" width="50" height="75" rx="8" fill="#181818" stroke="#C4B5FD" strokeWidth="2.5" />

          {/* Deltoid Muscle Heatmap */}
          {showMuscleHeatmap && (
            <g>
              <circle cx="165" cy="130" r="10" fill="#8B5CF6" opacity={0.3 + cycle * 0.7} filter="url(#neon-glow)" />
              <circle cx="235" cy="130" r="10" fill="#8B5CF6" opacity={0.3 + cycle * 0.7} filter="url(#neon-glow)" />
            </g>
          )}

          {/* Arms & Elbows driving upward */}
          <line x1="175" y1="130" x2={elbowX} y2={elbowY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <line x1={elbowX} y1={elbowY} x2="160" y2={barY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          <line x1="225" y1="130" x2={rElbowX} y2={elbowY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <line x1={rElbowX} y1={elbowY} x2="240" y2={barY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          {/* Barbell & Plates */}
          <line x1="110" y1={barY} x2="290" y2={barY} stroke="#F5F5F5" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="100" y={barY - 20} width="12" height="40" rx="3" fill="#8B5CF6" stroke="#111" strokeWidth="1.5" filter="url(#neon-glow)" />
          <rect x="288" y={barY - 20} width="12" height="40" rx="3" fill="#8B5CF6" stroke="#111" strokeWidth="1.5" filter="url(#neon-glow)" />

          {/* Overhead Vertical Alignment Guide */}
          {showBarPath && (
            <line x1="200" y1="50" x2="200" y2="150" stroke="#C4B5FD" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          )}

          {/* Elbow Degree Indicator */}
          {showJointAngles && (
            <g>
              <circle cx={elbowX} cy={elbowY} r="13" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={elbowX - 28} y={elbowY + 4} fill="#C4B5FD" fontSize="9" fontWeight="bold">
                {Math.round(80 + cycle * 95)}°
              </text>
            </g>
          )}

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            SEATED OVERHEAD PRESS • VERTICAL STACKED BAR PATH
          </text>
        </svg>
      );
    }

    // ==========================================
    // 5. BENT-OVER BARBELL ROW SIMULATION
    // ==========================================
    if (type === 'bent-row') {
      const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 (Hanging) to 1 (Pulled to navel)
      const barY = 210 - cycle * 65; // Pulls from 210 to 145
      const barX = 160 + cycle * 20; // Natural pull back into hip crease
      const elbowY = 175 - cycle * 45;
      const elbowX = 195 + cycle * 30;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="50" y1="265" x2="350" y2="265" stroke="#262626" strokeWidth="2" />

          {/* Feet & Legs hinged at 45 deg */}
          <line x1="220" y1="265" x2="235" y2="210" stroke="#525252" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="235" y1="210" x2="250" y2="160" stroke="#525252" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="250" cy="160" r="6" fill="#8B5CF6" />

          {/* Flat 45 deg Torso */}
          <line x1="250" y1="160" x2="165" y2="120" stroke="#F5F5F5" strokeWidth="8" strokeLinecap="round" />
          <circle cx="150" cy="108" r="16" fill="#181818" stroke="#F5F5F5" strokeWidth="2" />

          {/* Lat & Rhomboid Activation */}
          {showMuscleHeatmap && (
            <path
              d="M 245,155 Q 210,135 180,125"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="12"
              opacity={0.3 + cycle * 0.7}
              strokeLinecap="round"
              filter="url(#neon-glow)"
            />
          )}

          {/* Arms pulling barbell */}
          <line x1="175" y1="125" x2={elbowX} y2={elbowY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <line x1={elbowX} y1={elbowY} x2={barX} y2={barY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          {/* Barbell & Plates */}
          <line x1={barX} y1={barY - 30} x2={barX} y2={barY + 30} stroke="#F5F5F5" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx={barX} cy={barY} r="9" fill="#111" stroke="#8B5CF6" strokeWidth="2" filter="url(#neon-glow)" />

          {/* Pull Vector */}
          {cycle > 0.3 && (
            <line x1={barX} y1={barY} x2={barX + 18} y2={barY - 20} stroke="#8B5CF6" strokeWidth="3" markerEnd="url(#arrow-lime)" />
          )}

          {/* Joint Degree Angle */}
          {showJointAngles && (
            <g>
              <circle cx={elbowX} cy={elbowY} r="13" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={elbowX + 16} y={elbowY + 4} fill="#C4B5FD" fontSize="9" fontWeight="bold">
                {Math.round(170 - cycle * 95)}°
              </text>
            </g>
          )}

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            BENT-OVER BARBELL ROW • 45° HINGE & ELBOW DRIVE
          </text>
        </svg>
      );
    }

    // ==========================================
    // 6. DUMBBELL BICEP CURL SIMULATION
    // ==========================================
    if (type === 'dumbbell-curl') {
      const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 (Hanging) to 1 (Peak contraction)
      const handAngle = cycle * (Math.PI * 0.72); // Radians rotation
      const armPivotX = 185;
      const armPivotY = 160;
      const forearmLen = 65;
      const handX = armPivotX - Math.sin(handAngle) * forearmLen;
      const handY = armPivotY + Math.cos(handAngle) * forearmLen;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="80" y1="265" x2="320" y2="265" stroke="#262626" strokeWidth="2" />

          {/* Upright Athlete */}
          <circle cx="200" cy="75" r="17" fill="#181818" stroke="#F5F5F5" strokeWidth="2" />
          <line x1="200" y1="92" x2="200" y2="185" stroke="#F5F5F5" strokeWidth="7" strokeLinecap="round" />
          <line x1="195" y1="185" x2="190" y2="265" stroke="#525252" strokeWidth="5" strokeLinecap="round" />
          <line x1="205" y1="185" x2="210" y2="265" stroke="#525252" strokeWidth="5" strokeLinecap="round" />

          {/* Stationary Upper Arm (Elbow Pinned) */}
          <line x1="190" y1="105" x2={armPivotX} y2={armPivotY} stroke="#F5F5F5" strokeWidth="6" strokeLinecap="round" />
          <circle cx={armPivotX} cy={armPivotY} r="5" fill="#C4B5FD" />

          {/* Moving Forearm */}
          <line x1={armPivotX} y1={armPivotY} x2={handX} y2={handY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          {/* Bicep Muscle Belly Heatmap Bulge */}
          {showMuscleHeatmap && (
            <ellipse
              cx={armPivotX - 5}
              cy={armPivotY - 25}
              rx={6 + cycle * 6}
              ry={16}
              fill="#8B5CF6"
              opacity={0.3 + cycle * 0.7}
              transform={`rotate(-10, ${armPivotX}, ${armPivotY - 25})`}
              filter="url(#neon-glow)"
            />
          )}

          {/* Dumbbell */}
          <circle cx={handX} cy={handY} r="6" fill="#111" stroke="#8B5CF6" strokeWidth="2" />
          <line x1={handX - 12} y1={handY} x2={handX + 12} y2={handY} stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" filter="url(#neon-glow)" />

          {/* Joint Degree Angle */}
          {showJointAngles && (
            <g>
              <circle cx={armPivotX} cy={armPivotY} r="14" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={armPivotX + 16} y={armPivotY + 4} fill="#C4B5FD" fontSize="9" fontWeight="bold">
                {Math.round(170 - cycle * 125)}°
              </text>
            </g>
          )}

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            DUMBBELL BICEP CURL • ZERO ELBOW DRIFT ISOLATION
          </text>
        </svg>
      );
    }

    // ==========================================
    // 7. TRICEP CABLE PUSHDOWN SIMULATION
    // ==========================================
    if (type === 'tricep-pushdown') {
      const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 (90 deg) to 1 (180 deg lockout)
      const handY = 160 + cycle * 55;
      const handX = 220 + cycle * 10;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="260" y1="30" x2="260" y2="265" stroke="#333" strokeWidth="6" />
          <circle cx="260" cy="50" r="10" fill="#222" stroke="#737373" strokeWidth="2" />
          <line x1="260" y1="50" x2={handX} y2={handY} stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 2" />

          <circle cx="150" cy="80" r="16" fill="#1C1C1C" stroke="#F5F5F5" strokeWidth="2" />
          <line x1="150" y1="96" x2="160" y2="190" stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          {/* Stationary Upper Arm */}
          <line x1="155" y1="108" x2="185" y2="155" stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <circle cx="185" cy="155" r="5" fill="#C4B5FD" />

          {/* Forearm Extension */}
          <line x1="185" y1="155" x2={handX} y2={handY} stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />
          <circle cx={handX} cy={handY} r="5" fill="#8B5CF6" />

          {/* Tricep Lateral Head Heatmap */}
          {showMuscleHeatmap && (
            <line
              x1="160"
              y1="112"
              x2="182"
              y2="148"
              stroke="#8B5CF6"
              strokeWidth="9"
              opacity={0.3 + cycle * 0.7}
              strokeLinecap="round"
              filter="url(#neon-glow)"
            />
          )}

          {/* Joint Degree Angle */}
          {showJointAngles && (
            <g>
              <circle cx="185" cy="155" r="13" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="145" y="158" fill="#C4B5FD" fontSize="9" fontWeight="bold">
                {Math.round(90 + cycle * 90)}°
              </text>
            </g>
          )}

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            TRICEP PUSHDOWN • 90° TO 180° FULL LOCKOUT
          </text>
        </svg>
      );
    }

    // ==========================================
    // 8. ARM CIRCLES & MOBILITY
    // ==========================================
    if (type === 'arm-circles') {
      const angle = (t * 2.5) % (Math.PI * 2);
      const circleRadius = 24;
      const rArmX = 200 + 65 + Math.cos(angle) * circleRadius;
      const rArmY = 130 + Math.sin(angle) * circleRadius;
      const lArmX = 200 - 65 - Math.cos(angle) * circleRadius;
      const lArmY = 130 + Math.sin(angle) * circleRadius;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="80" y1="270" x2="320" y2="270" stroke="#262626" strokeWidth="2" strokeDasharray="4 4" />
          
          <circle cx="265" cy="130" r={circleRadius} stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" fill="none" />
          <circle cx="135" cy="130" r={circleRadius} stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" fill="none" />

          <circle cx="200" cy="72" r="18" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2.5" />
          <path d="M 175,98 L 225,98 L 215,190 L 185,190 Z" fill="#181818" stroke="#C4B5FD" strokeWidth="2.5" />

          {/* Shoulders Glow */}
          <circle cx="175" cy="104" r="8" fill="#8B5CF6" opacity="0.8" filter="url(#neon-glow)" />
          <circle cx="225" cy="104" r="8" fill="#8B5CF6" opacity="0.8" filter="url(#neon-glow)" />

          <line x1="225" y1="104" x2="255" y2="118" stroke="#F5F5F5" strokeWidth="4" strokeLinecap="round" />
          <line x1="255" y1="118" x2={rArmX} y2={rArmY} stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
          <circle cx={rArmX} cy={rArmY} r="5" fill="#8B5CF6" />

          <line x1="175" y1="104" x2="145" y2="118" stroke="#F5F5F5" strokeWidth="4" strokeLinecap="round" />
          <line x1="145" y1="118" x2={lArmX} y2={lArmY} stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
          <circle cx={lArmX} cy={lArmY} r="5" fill="#8B5CF6" />

          <line x1="188" y1="190" x2="180" y2="270" stroke="#737373" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="212" y1="190" x2="220" y2="270" stroke="#737373" strokeWidth="4.5" strokeLinecap="round" />

          <text x="200" y="24" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            SCAPULAR & SHOULDER ROTATION
          </text>
        </svg>
      );
    }

    // ==========================================
    // 9. CAT-COW MOBILITY
    // ==========================================
    if (type === 'cat-cow') {
      const cycle = Math.sin(t * 1.5);
      const spineArch = cycle * 22;
      const headY = 125 - cycle * 12;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <rect x="50" y="235" width="300" height="8" rx="4" fill="#1C1C1C" stroke="#2E2E2E" strokeWidth="1.5" />

          <line x1="130" y1="150" x2="130" y2="235" stroke="#F5F5F5" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="270" y1="155" x2="270" y2="235" stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          <path
            d={`M 135,145 Q 200,${155 - spineArch} 265,150`}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />

          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
            const x = 135 + (265 - 135) * ratio;
            const y = 145 + Math.sin(ratio * Math.PI) * (10 - spineArch);
            return <circle key={i} cx={x} cy={y} r="3" fill="#FFFFFF" />;
          })}

          <line x1="135" y1="145" x2="105" y2={headY} stroke="#F5F5F5" strokeWidth="4" strokeLinecap="round" />
          <circle cx="95" cy={headY - 5} r="16" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2.5" />

          <text x="200" y="30" fill={cycle > 0 ? '#FFB547' : '#8B5CF6'} textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            {cycle > 0 ? 'CAT: THORACIC SPINAL ARCH (EXHALE)' : 'COW: PELVIC ANTERIOR TILT (INHALE)'}
          </text>
        </svg>
      );
    }

    // ==========================================
    // 10. SCAPULAR PULLS
    // ==========================================
    if (type === 'scap-pull') {
      const cycle = (Math.sin(t * 2) + 1) / 2;
      const scapY = cycle * 16;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="100" y1="50" x2="300" y2="50" stroke="#737373" strokeWidth="6" strokeLinecap="round" />
          <line x1="140" y1="50" x2="160" y2={100 + scapY} stroke="#F5F5F5" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="260" y1="50" x2="240" y2={100 + scapY} stroke="#F5F5F5" strokeWidth="4.5" strokeLinecap="round" />

          <circle cx="200" cy={90 + scapY} r="17" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2" />
          <rect x="165" y={110 + scapY} width="70" height="95" rx="10" fill="#181818" stroke="#C4B5FD" strokeWidth="2.5" />

          <circle cx="185" cy={135 + scapY} r="7" fill="#8B5CF6" opacity="0.8" filter="url(#neon-glow)" />
          <circle cx="215" cy={135 + scapY} r="7" fill="#8B5CF6" opacity="0.8" filter="url(#neon-glow)" />

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            ISOLATED SCAPULAR RETRACTION (ARMS STRAIGHT)
          </text>
        </svg>
      );
    }

    // ==========================================
    // 11. DOORWAY CHEST STRETCH
    // ==========================================
    if (type === 'chest-stretch') {
      const cycle = Math.sin(t * 1.2);
      const stretchOffset = cycle * 5;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <rect x="90" y="40" width="20" height="230" fill="#222" stroke="#404040" strokeWidth="2" />
          <line x1="110" y1="110" x2="110" y2="155" stroke="#C4B5FD" strokeWidth="6" strokeLinecap="round" />
          <line x1="110" y1="155" x2={165 - stretchOffset} y2="155" stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round" />

          <path
            d="M 165,145 Q 190,155 205,160"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="8"
            opacity="0.85"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />

          <rect x={180 - stretchOffset} y="130" width="55" height="85" rx="8" fill="#181818" stroke="#F5F5F5" strokeWidth="2.5" transform="rotate(10, 205, 170)" />
          <circle cx={205 - stretchOffset} cy="95" r="16" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2" />

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            FOREARM AT 90° • STEP THROUGH & ROTATE AWAY
          </text>
        </svg>
      );
    }

    // ==========================================
    // 12. OVERHEAD LAT STRETCH
    // ==========================================
    if (type === 'overhead-lat-stretch') {
      const breath = Math.sin(t * 1.2) * 3;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="100" y1="270" x2="300" y2="270" stroke="#262626" strokeWidth="2" />
          <circle cx="200" cy="85" r="17" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2" />

          <path d="M 185,110 Q 180,150 185,195 L 220,195 Q 225,150 215,110 Z" fill="#181818" stroke="#F5F5F5" strokeWidth="2.5" />
          <path d="M 215,115 Q 228,150 220,190" fill="none" stroke="#8B5CF6" strokeWidth="7" opacity="0.8" filter="url(#neon-glow)" />

          <line x1="215" y1="110" x2={220 + breath} y2="55" stroke="#F5F5F5" strokeWidth="4.5" strokeLinecap="round" />
          <line x1={220 + breath} y1="55" x2="195" y2="85" stroke="#F5F5F5" strokeWidth="4" strokeLinecap="round" />

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            GENTLE OVERHEAD ELBOW GUIDE • LENGTHEN LAT
          </text>
        </svg>
      );
    }

    // ==========================================
    // 13. STANDING QUAD STRETCH
    // ==========================================
    if (type === 'quad-stretch') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <line x1="80" y1="270" x2="320" y2="270" stroke="#262626" strokeWidth="2" />
          <line x1="120" y1="60" x2="120" y2="270" stroke="#333" strokeWidth="4" />

          <circle cx="195" cy="80" r="17" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2" />
          <rect x="180" y="100" width="35" height="85" rx="8" fill="#181818" stroke="#F5F5F5" strokeWidth="2.5" />

          <line x1="190" y1="185" x2="190" y2="270" stroke="#F5F5F5" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="205" y1="185" x2="205" y2="235" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" filter="url(#neon-glow)" />
          <line x1="205" y1="235" x2="235" y2="185" stroke="#F5F5F5" strokeWidth="4" strokeLinecap="round" />

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            KNEES ALIGNED TOGETHER • TUCK PELVIS
          </text>
        </svg>
      );
    }

    // ==========================================
    // 14. CHILD'S POSE & RECOVERY BREATHING
    // ==========================================
    if (type === 'childs-pose') {
      const breath = Math.sin(t * 1.0);
      const ribExpansion = breath * 4;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          {commonDefs}
          <rect x="60" y="235" width="280" height="8" rx="4" fill="#1C1C1C" stroke="#2E2E2E" strokeWidth="1.5" />
          <circle cx="255" cy="205" r="14" fill="#262626" stroke="#C4B5FD" strokeWidth="2" />

          <path
            d={`M 255,200 Q 200,${165 - ribExpansion} 150,210`}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />

          <circle cx="135" cy="225" r="14" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2" />
          <line x1="165" y1="190" x2="90" y2="235" stroke="#F5F5F5" strokeWidth="4" strokeLinecap="round" />

          <text x="200" y="25" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
            PARASYMPATHETIC RECOVERY • 4s INHALE / 6s EXHALE
          </text>
        </svg>
      );
    }

    // Default Fallback
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none">
        {commonDefs}
        <line x1="80" y1="260" x2="320" y2="260" stroke="#262626" strokeWidth="2" />
        <circle cx="200" cy="90" r="18" fill="#1C1C1C" stroke="#8B5CF6" strokeWidth="2" />
        <rect x="180" y="115" width="40" height="70" rx="6" fill="#1A1A1A" stroke="#C4B5FD" strokeWidth="2" />
        <text x="200" y="30" fill="#8B5CF6" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="1">
          BIOMECHANICAL FORM GUIDE
        </text>
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-[#0B0D14] border border-[#2A2F3F] rounded-2xl overflow-hidden shadow-2xl relative"
    >
      {/* Top Bar with Badge & View Tabs */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0B0D14] border-b border-[#2A2F3F] z-10">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
              exercise.phase === 'warmup'
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                : exercise.phase === 'stretch'
                ? 'bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/30'
                : 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30'
            }`}
          >
            {hasVideo ? <Film className="w-3 h-3" /> : <Compass className="w-3 h-3" />}
            {phaseLabel ||
              (exercise.phase === 'warmup'
                ? 'WARMUP MOBILITY'
                : exercise.phase === 'stretch'
                ? 'COOL-DOWN STRETCH'
                : 'MAIN COMPOUND')}
          </span>
          <span className="text-[11px] font-semibold text-[#A1A8B8] truncate max-w-[130px] hidden xs:inline">
            {exercise.category}
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-[#131826] p-0.5 rounded-lg border border-[#2A2F3F]">
          {hasVideo && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-bold'
                  : 'text-[#A1A8B8] hover:text-[#FFFFFF]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Real Video</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('biomechanical')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'biomechanical'
                ? 'bg-[#8B5CF6] text-white shadow-sm font-bold'
                : 'text-[#A1A8B8] hover:text-[#FFFFFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Biomechanical</span>
          </button>

          <button
            onClick={() => setActiveTab('muscles')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'muscles'
                ? 'bg-[#8B5CF6] text-white shadow-sm font-bold'
                : 'text-[#A1A8B8] hover:text-[#FFFFFF]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Muscles</span>
          </button>

          <button
            onClick={() => setActiveTab('technique')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'technique'
                ? 'bg-[#8B5CF6] text-white shadow-sm font-bold'
                : 'text-[#A1A8B8] hover:text-[#FFFFFF]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Technique</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display Area */}
      <div className="relative w-full h-[260px] sm:h-[300px] bg-black flex items-center justify-center overflow-hidden group">
        {/* TAB 1: Real Looping Video Demonstration */}
        {activeTab === 'video' && hasVideo && (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {!videoError ? (
              <video
                ref={videoRef}
                src={exercise.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => setVideoError(true)}
                onClick={togglePlayPause}
                className="w-full h-full object-contain cursor-pointer select-none"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <Film className="w-10 h-10 text-[#8B5CF6] mb-2 opacity-60" />
                <p className="text-sm font-medium text-white mb-1">Switch to Biomechanical Guide</p>
                <button
                  onClick={() => setActiveTab('biomechanical')}
                  className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] text-white text-xs font-bold mt-2"
                >
                  View Biomechanical Simulation
                </button>
              </div>
            )}

            {/* Subtle Gradient Overlays for HUD */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Top-Left: Live Movement Phase HUD */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
              <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
                </span>
                <span className={`text-[10px] font-black tracking-wider uppercase ${phaseInfo.color}`}>
                  {phaseInfo.label}
                </span>
              </div>
              <span className="text-[10px] font-medium text-white/70 pl-2 drop-shadow-md">
                {phaseInfo.sub}
              </span>
            </div>

            {/* Top-Right: Form Quality & Breathing Cadence */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
                <Wind className="w-3 h-3 text-[#8B5CF6]" />
                <span className="text-[10px] font-medium text-neutral-200">
                  {phaseInfo.breath}
                </span>
              </div>
            </div>

            {/* Center Play Indicator when Paused */}
            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-[#8B5CF6]/50 flex items-center justify-center text-[#8B5CF6] hover:scale-105 transition-transform shadow-2xl z-10"
              >
                <Play className="w-7 h-7 ml-1 fill-[#8B5CF6]" />
              </button>
            )}

            {/* Bottom Form Tip Ribbon */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 max-w-[85%] truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                <span className="text-[11px] font-medium text-neutral-200 truncate">
                  <strong className="text-[#8B5CF6] mr-1">Cue:</strong>
                  {exercise.formTip}
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 px-2 py-0.5 rounded-md shrink-0">
                PRO DEMO
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: Biomechanical Motion Model (Kinetic Simulation for all exercises) */}
        {activeTab === 'biomechanical' && (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0B0D14] via-[#0D121F] to-[#131826]">
            {/* Real Biomechanical Kinetic Canvas */}
            <div className="w-full h-full max-w-[420px] flex items-center justify-center p-2">
              {renderBiomechanicalVisual()}
            </div>

            {/* Top-Left: Live Movement Phase & Angle Readout */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
              <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
                </span>
                <span className={`text-[10px] font-black tracking-wider uppercase ${phaseInfo.color}`}>
                  {phaseInfo.label}
                </span>
              </div>
              <span className="text-[10px] font-medium text-white/70 pl-2 drop-shadow-md">
                {phaseInfo.sub}
              </span>
            </div>

            {/* Top-Right: Joint Degree Gauge Card */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
              {phaseInfo.elbowAngle && (
                <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#C4B5FD]/40 shadow-lg">
                  <Gauge className="w-3 h-3 text-[#C4B5FD]" />
                  <span className="text-[10px] font-mono font-bold text-[#C4B5FD]">
                    {phaseInfo.jointName}: {phaseInfo.elbowAngle}
                  </span>
                </div>
              )}
              {phaseInfo.kneeAngle && (
                <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#C4B5FD]/40 shadow-lg">
                  <Gauge className="w-3 h-3 text-[#C4B5FD]" />
                  <span className="text-[10px] font-mono font-bold text-[#C4B5FD]">
                    {phaseInfo.jointName}: {phaseInfo.kneeAngle}
                  </span>
                </div>
              )}
            </div>

            {/* Center Play Indicator when Paused */}
            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-[#8B5CF6]/50 flex items-center justify-center text-[#8B5CF6] hover:scale-105 transition-transform shadow-2xl z-10"
              >
                <Play className="w-7 h-7 ml-1 fill-[#8B5CF6]" />
              </button>
            )}

            {/* Bottom Floating Overlay Controls: Trajectory, Angles, Heatmap */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
              <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
                <button
                  onClick={() => setShowJointAngles(!showJointAngles)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    showJointAngles
                      ? 'bg-[#C4B5FD]/20 text-[#C4B5FD] border border-[#C4B5FD]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Toggle Joint Angle Gauges"
                >
                  <Gauge className="w-3 h-3" />
                  <span>Angles</span>
                </button>

                <button
                  onClick={() => setShowBarPath(!showBarPath)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    showBarPath
                      ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Toggle Bar Path Trajectory"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Bar Path</span>
                </button>

                <button
                  onClick={() => setShowMuscleHeatmap(!showMuscleHeatmap)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    showMuscleHeatmap
                      ? 'bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Toggle Muscle Activation Heatmap"
                >
                  <Flame className="w-3 h-3" />
                  <span>Tension</span>
                </button>
              </div>

              <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#C4B5FD]/20 text-[#C4B5FD] border border-[#C4B5FD]/40 px-2 py-1 rounded-md shrink-0 backdrop-blur-md">
                60 FPS KINETICS
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: Muscles Activation Tab */}
        {activeTab === 'muscles' && (
          <div className="w-full h-full p-5 flex flex-col justify-between bg-gradient-to-b from-[#0B0D14] to-[#131826] overflow-y-auto">
            <div>
              <div className="text-xs font-bold text-[#A1A8B8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Target Muscle Activation Map
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {exercise.targetMuscles.map((muscle, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] font-bold text-xs flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                    {muscle}
                  </span>
                ))}
              </div>

              <div className="space-y-2 mt-2">
                <div className="bg-[#131826] p-3 rounded-xl border border-[#2A2F3F] text-xs">
                  <span className="text-[#FFFFFF] font-semibold block mb-0.5">
                    Mind-Muscle Connection:
                  </span>
                  <span className="text-[#A1A8B8]">
                    Focus on initiating the movement strictly with your{' '}
                    <strong className="text-[#8B5CF6]">{exercise.targetMuscles[0]}</strong> before
                    engaging secondary stabilizers.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#131826] p-3 rounded-xl border border-[#2A2F3F] text-xs text-[#A1A8B8] flex items-center justify-between mt-3">
              <div>
                <span className="text-[#FFFFFF] font-semibold">Equipment: </span>
                <span>{exercise.equipmentNeeded}</span>
              </div>
              <span className="text-[10px] bg-[#222] text-[#8B5CF6] px-2 py-0.5 rounded font-mono">
                {exercise.category}
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: Technique & Steps Tab */}
        {activeTab === 'technique' && (
          <div className="w-full h-full p-4 overflow-y-auto space-y-2.5 bg-gradient-to-b from-[#0B0D14] to-[#131826]">
            <div className="text-xs font-bold text-[#FFFFFF] flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Step-by-Step Technique Breakdown
              </span>
              <span className="text-[10px] text-[#A1A8B8] font-mono">
                {exercise.steps.length} Steps
              </span>
            </div>
            {exercise.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-xs text-[#D1D5DB] bg-[#0B0D14] p-2.5 rounded-xl border border-[#2A2F3F]"
              >
                <span className="w-5 h-5 rounded-md bg-[#222] border border-[#2A2F3F] text-[#8B5CF6] font-black flex items-center justify-center shrink-0 text-[10px]">
                  0{idx + 1}
                </span>
                <p className="leading-relaxed pt-0.5 text-neutral-300">{step}</p>
              </div>
            ))}

            {exercise.alternative && (
              <div className="bg-[#131826] p-3 rounded-xl border border-[#8B5CF6]/25 mt-2">
                <div className="text-[11px] font-bold text-[#8B5CF6] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3" />
                  Beginner Modification / Alternative: {exercise.alternative.name}
                </div>
                <p className="text-[11px] text-[#A1A8B8] leading-snug">
                  {exercise.alternative.reason}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Playback & Slow-Mo Controls */}
      {(activeTab === 'video' || activeTab === 'biomechanical') && (
        <div className="px-3.5 py-2.5 bg-[#131826] border-t border-[#2A2F3F] flex flex-col gap-2">
          {/* Seek Scrubber (For Video mode) */}
          {activeTab === 'video' && hasVideo && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#A1A8B8] w-8">
                {currentTime.toFixed(1)}s
              </span>
              <input
                type="range"
                min="0"
                max={duration || 10}
                step="0.05"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                aria-label="Seek Video Timeline"
              />
              <span className="text-[10px] font-mono text-[#A1A8B8] w-8 text-right">
                {duration ? `${duration.toFixed(1)}s` : '0.0s'}
              </span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="p-1.5 rounded-lg bg-[#131826] hover:bg-[#2A2A2A] text-[#FFFFFF] transition-colors"
                aria-label={isPlaying ? 'Pause demonstration' : 'Play demonstration'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" />
                )}
              </button>

              {/* Replay Button */}
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg bg-[#131826] hover:bg-[#2A2A2A] text-[#A1A8B8] hover:text-[#FFFFFF] transition-colors"
                title="Restart Demonstration"
                aria-label="Restart Demonstration"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Switcher (Slow-Mo Form Study) */}
              <button
                onClick={cycleSpeed}
                className="px-2 py-1 rounded-lg bg-[#131826] text-[11px] font-bold text-[#8B5CF6] hover:bg-[#2A2A2A] border border-[#2A2F3F]"
                title="Toggle Slow-Mo Form Study"
              >
                {playbackRate}x {playbackRate < 1.0 && '(Slow-Mo)'}
              </button>
            </div>

            {/* Right utilities: Audio, Fullscreen */}
            <div className="flex items-center gap-1.5">
              {activeTab === 'video' && hasVideo && (
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-[#131826] hover:bg-[#2A2A2A] text-[#A1A8B8] hover:text-[#FFFFFF] transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                </button>
              )}

              <button
                onClick={handleFullscreen}
                className="p-1.5 rounded-lg bg-[#131826] hover:bg-[#2A2A2A] text-[#A1A8B8] hover:text-[#FFFFFF] transition-colors"
                title="Expand Fullscreen"
                aria-label="Expand Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Tip & Common Mistake Bottom Cards */}
      <div className="p-3 bg-[#131826] border-t border-[#2A2F3F] space-y-2">
        <div className="flex items-start gap-2 bg-[#0B0D14] p-2.5 rounded-xl border border-[#2A2F3F]">
          <ShieldCheck className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-black text-[#8B5CF6] mr-1.5 uppercase text-[10px] tracking-wide">
              KEY FORM CUE:
            </span>
            <span className="text-[#FFFFFF] leading-relaxed">{exercise.formTip}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-[#0B0D14] p-2.5 rounded-xl border border-[#2A2F3F]">
          <AlertTriangle className="w-4 h-4 text-[#FF5C5C] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-black text-[#FF5C5C] mr-1.5 uppercase text-[10px] tracking-wide">
              COMMON MISTAKE TO AVOID:
            </span>
            <span className="text-[#FFFFFF] leading-relaxed">{exercise.commonMistake}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
