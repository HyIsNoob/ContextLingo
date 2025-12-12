// Simple synth for sound effects without external assets
let audioCtx: AudioContext | null = null;

const getCtx = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};

type SoundType = 'correct' | 'incorrect' | 'success' | 'click' | 'pop' | 'hover';

export const playSfx = (type: SoundType) => {
    try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'correct':
                // Happy chime (Upward arpeggio)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(500, now);
                osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                
                // Second tone overlap for chord effect
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'triangle';
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.frequency.setValueAtTime(800, now + 0.1);
                gain2.gain.setValueAtTime(0.05, now + 0.1);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc2.start(now + 0.1);
                osc2.stop(now + 0.4);
                break;

            case 'incorrect':
                // Sad buzzer (Sawtooth, pitch down)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'success':
                // Victory fanfare (Series of notes)
                const playNote = (freq: number, time: number, dur: number) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = 'square';
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0.05, time);
                    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
                    o.start(time);
                    o.stop(time + dur);
                };
                playNote(523.25, now, 0.1); // C5
                playNote(659.25, now + 0.1, 0.1); // E5
                playNote(783.99, now + 0.2, 0.4); // G5
                break;

            case 'click':
                // Simple blip
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            
            case 'pop':
                // Bubble pop sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'hover':
                // Very subtle high tick
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, now);
                gain.gain.setValueAtTime(0.01, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
                break;
        }

    } catch (e) {
        console.warn("Audio Context Error", e);
    }
};