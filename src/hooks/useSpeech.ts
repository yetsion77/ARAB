import { useState, useEffect, useCallback } from 'react';

interface UseSpeechReturn {
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  isSupported: boolean;
  cancel: () => void;
}

export function useSpeech(): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          setVoicesLoaded(true);

          // Debug: log available Arabic voices
          const arabicVoices = availableVoices.filter(v =>
            v.lang.startsWith('ar')
          );
          console.log('🔊 קולות ערביים זמינים:', arabicVoices.length);
          if (arabicVoices.length > 0) {
            console.log('קול ערבי ראשון:', arabicVoices[0].name, arabicVoices[0].lang);
          } else {
            console.warn('⚠️ אין קולות ערביים! ישתמש בקול ברירת מחדל');
          }
        }
      };

      // Try to load voices immediately
      loadVoices();

      // Chrome needs onvoiceschanged event
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Fallback: try again after a short delay (Chrome workaround)
      const timeoutId = setTimeout(loadVoices, 100);

      return () => {
        clearTimeout(timeoutId);
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: string = 'ar-SA') => {
      if (!isSupported || !text) {
        console.error('❌ לא נתמך או אין טקסט');
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Wait a bit for cancel to complete (Chrome issue)
      setTimeout(() => {
        // Force resume if paused (Chrome bug fix)
        if (speechSynthesis.paused) {
          speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.85; // Slightly slower for learning
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Get fresh voices list (important for Chrome)
        const currentVoices = speechSynthesis.getVoices();

        // Try to find an Arabic voice
        const arabicVoices = currentVoices.filter((voice) =>
          voice.lang.startsWith('ar')
        );

        if (arabicVoices.length > 0) {
          utterance.voice = arabicVoices[0];
          console.log('✅ משתמש בקול:', arabicVoices[0].name);
        } else {
          console.warn('⚠️ לא נמצא קול ערבי, משתמש בברירת מחדל');
        }

        utterance.onstart = () => {
          console.log('▶️ התחלת הקראה:', text);
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('⏹️ סיום הקראה');
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          console.error('❌ שגיאה בהקראה:', event.error);
          setIsSpeaking(false);
        };

        console.log('🔊 מתחיל הקראה...', { text, lang, voiceCount: currentVoices.length });
        speechSynthesis.speak(utterance);
      }, 50);
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, isSpeaking, isSupported, cancel };
}
