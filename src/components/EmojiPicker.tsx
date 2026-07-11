import { useEffect, useRef, useState } from 'react';

/**
 * Emoji picker za admin panel — umesto ručnog kucanja emojija,
 * osoblje bira iz kategorija (piće, hrana, slatko, voće, žurka, razno).
 */

const EMOJI_CATEGORIES: Array<{ label: string; emoji: string; items: string[] }> = [
  {
    label: 'Piće',
    emoji: '🍹',
    items: ['🍹', '🍸', '🍺', '🍻', '🥂', '🍷', '🥃', '🍾', '🍶', '🫗', '☕', '🍵', '🧃', '🥤', '🧋', '🧉', '🥛', '🧊', '💧', '🫖', '🍋', '🫙'],
  },
  {
    label: 'Hrana',
    emoji: '🍔',
    items: ['🍔', '🍟', '🌭', '🍕', '🥪', '🌮', '🌯', '🥙', '🧆', '🫓', '🥗', '🍳', '🥓', '🥞', '🧇', '🍞', '🥐', '🥖', '🥨', '🥯', '🧀', '🥩', '🍗', '🍖', '🥟', '🍤', '🍣', '🍱', '🍜', '🍝', '🍲', '🥘', '🫕', '🍚', '🍙', '🍢', '🥚', '🍽️', '🥣', '🥫', '🌶️', '🫑', '🍅', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥔', '🥑', '🌽', '🥕', '🫒', '🌿'],
  },
  {
    label: 'Slatko',
    emoji: '🍰',
    items: ['🍰', '🎂', '🧁', '🥧', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🍨', '🍧', '🍦', '🥞', '🍯', '🥜', '🌰'],
  },
  {
    label: 'Voće',
    emoji: '🍓',
    items: ['🍓', '🍒', '🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🫐', '🍈', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🐉'],
  },
  {
    label: 'Žurka',
    emoji: '🎉',
    items: ['🎉', '🎊', '🎧', '🎸', '🎤', '🎵', '🎶', '🎺', '🎷', '🥁', '🪩', '💃', '🕺', '✨', '🌟', '⭐', '🔥', '💥', '🎆', '🎇', '😎', '😈', '🥳', '🍾', '🏆', '⚽', '🏀'],
  },
  {
    label: 'Plaža',
    emoji: '🏖️',
    items: ['🏖️', '🌊', '🌴', '⛱️', '🐚', '🏝️', '☀️', '🌅', '🌄', '🌙', '🦩', '🐬', '⚓', '🛥️', '🏄', '🩴', '🕶️', '🌸', '🌺', '🌼', '🌻', '🦌', '🌵', '🏴‍☠️'],
  },
  {
    label: 'Razno',
    emoji: '📌',
    items: ['📌', '💪', '⚡', '💙', '🖤', '💛', '❤️', '💚', '🤍', '🔝', '🆕', '💯', '✅', '⏰', '📞', '📸', '🎁', '💎', '👑', '🍀'],
  },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  /** Placeholder emoji kada ništa nije izabrano. */
  placeholder?: string;
}

export default function EmojiPicker({ value, onChange, placeholder = '🍽️' }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none focus:border-[#00a896]/60"
        aria-label="Izaberi emoji"
      >
        <span className="text-xl leading-none">{value || <span className="text-sm text-white/28">{placeholder}</span>}</span>
        <span className="text-white/35">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-72 rounded-2xl border border-white/12 bg-[#0b0f0e] p-3 shadow-2xl shadow-black/60">
          <div className="flex flex-wrap gap-1">
            {EMOJI_CATEGORIES.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setCategory(index)}
                title={item.label}
                className={`rounded-lg px-2 py-1.5 text-base transition-colors ${category === index ? 'bg-[#00a896]/30' : 'hover:bg-white/10'}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{EMOJI_CATEGORIES[category].label}</div>
          <div className="mt-2 grid max-h-44 grid-cols-8 gap-0.5 overflow-y-auto">
            {EMOJI_CATEGORIES[category].items.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onChange(emoji); setOpen(false); }}
                className={`rounded-lg p-1.5 text-lg leading-none transition-colors hover:bg-white/12 ${value === emoji ? 'bg-[#00a896]/30' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {value && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className="mt-2 w-full rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10"
            >
              Ukloni emoji
            </button>
          )}
        </div>
      )}
    </div>
  );
}
