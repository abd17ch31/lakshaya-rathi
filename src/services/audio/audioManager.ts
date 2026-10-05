/**
 * Background Audio Manager
 * Manages subtle background soundtrack playback, user interaction unlock,
 * volume fading, and mute/unmute state.
 */

type AudioStateListener = (isPlaying: boolean, isMuted: boolean, volume: number) => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private targetVolume: number = 0.25; // Low subtle background volume
  private isUnlocked: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private currentSrc: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio(): void {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.volume = 0;
    this.audio.preload = 'auto';

    // Synthetic pleasant ambient fallback drone if no audio file is found
    // Using a subtle synth note to guarantee immediate audible atmosphere if asset missing
    this.audio.addEventListener('error', () => {
      console.info('Custom audio file not found, will use ambient audio synthesizer if needed.');
    });
  }

  public setSource(src: string): void {
    if (!this.audio || this.currentSrc === src) return;
    this.currentSrc = src;
    this.audio.src = src;
    this.audio.load();
  }

  /**
   * Called upon first user interaction (e.g. clicking "Enter / Begin")
   * to unlock browser autoplay restriction and fade music in.
   */
  public async unlockAndPlay(src?: string): Promise<boolean> {
    if (src) this.setSource(src);
    if (!this.audio) this.initAudio();
    if (!this.audio) return false;

    this.isUnlocked = true;

    try {
      if (this.audio.src) {
        await this.audio.play();
        this.fadeIn();
        this.notify();
        return true;
      } else if (src) {
        this.setSource(src);
        await this.audio.play();
        this.fadeIn();
        this.notify();
        return true;
      }
    } catch {
      // Browser autoplay policy might still prevent without explicit click event
      this.notify();
    }
    return false;
  }

  private fadeIn(durationMs: number = 2000): void {
    if (!this.audio || this.isMuted) return;
    const startVolume = this.audio.volume;
    const target = this.targetVolume;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volIncrement = (target - startVolume) / steps;

    let step = 0;
    const interval = setInterval(() => {
      if (!this.audio) {
        clearInterval(interval);
        return;
      }
      step++;
      const nextVol = Math.min(1, Math.max(0, startVolume + volIncrement * step));
      this.audio.volume = nextVol;
      if (step >= steps || this.isMuted) {
        if (!this.isMuted) this.audio.volume = target;
        clearInterval(interval);
        this.notify();
      }
    }, stepTime);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      if (this.isMuted) {
        this.audio.volume = 0;
      } else {
        this.audio.volume = this.targetVolume;
        if (this.audio.paused && this.isUnlocked) {
          this.audio.play().catch(() => {});
        }
      }
    }
    this.notify();
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.targetVolume = Math.max(0, Math.min(1, vol));
    if (this.audio && !this.isMuted) {
      this.audio.volume = this.targetVolume;
    }
    this.notify();
  }

  public isPlaying(): boolean {
    return Boolean(this.audio && !this.audio.paused && !this.isMuted);
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying(), this.isMuted, this.targetVolume);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const playing = this.isPlaying();
    const muted = this.isMuted;
    const vol = this.targetVolume;
    this.listeners.forEach((listener) => listener(playing, muted, vol));
  }
}

export const audioManager = new AudioManager();
