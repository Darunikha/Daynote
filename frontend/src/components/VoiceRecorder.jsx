import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Volume2, Sparkles } from 'lucide-react';

export default function VoiceRecorder({
  audioUrl,
  audioTranscript,
  onAudioChange,
  onTranscriptChange,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Convert blob to Base64 Data URL for standalone storage or submission
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          onAudioChange(base64Audio, audioBlob);
        };

        // Stop all tracks in stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start Speech Recognition if supported
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          let liveTranscript = audioTranscript || '';

          recognition.onresult = (e) => {
            let current = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              current += e.results[i][0].transcript;
            }
            if (current) {
              const updated = liveTranscript ? `${liveTranscript} ${current}` : current;
              onTranscriptChange(updated);
            }
          };

          recognition.onerror = (err) => {
            console.warn('Speech recognition error:', err);
          };

          recognition.start();
          recognitionRef.current = recognition;
          setIsTranscribing(true);
        } catch (err) {
          console.warn('Could not initialize speech recognition:', err);
        }
      }
    } catch (err) {
      alert('Microphone access is required to record voice notes.');
      console.error('Error accessing mic:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsTranscribing(false);
    }
  };

  const clearAudio = () => {
    onAudioChange('', null);
    setIsPlaying(false);
    setRecordingTime(0);
  };

  const togglePlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-300 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Voice Note & Audio Recording
        </label>
        {speechSupported && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-full font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" /> Speech-to-Text Ready
          </span>
        )}
      </div>

      {audioUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white dark:bg-stone-800 p-3 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors shadow"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-amber-500 transition-all ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{ width: isPlaying ? '100%' : '0%' }}
                />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {isPlaying ? 'Playing voice note...' : 'Voice note attached'}
              </p>
            </div>
            <button
              type="button"
              onClick={clearAudio}
              className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              title="Delete voice note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 bg-white dark:bg-stone-800 p-3.5 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center gap-2 text-sm shadow transition-colors"
            >
              <Mic className="w-4 h-4" /> Record Voice Note
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center gap-2 text-sm shadow transition-colors animate-pulse"
            >
              <Square className="w-4 h-4" /> Stop Recording ({formatTime(recordingTime)})
            </button>
          )}

          <div className="flex-1 text-xs text-stone-500 dark:text-stone-400">
            {isRecording ? (
              <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                Recording in progress... {isTranscribing && '(Transcribing...)'}
              </span>
            ) : (
              'Record audio up to 5 minutes. Live transcript will auto-populate.'
            )}
          </div>
        </div>
      )}

      {/* Audio Transcript Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Audio Transcript
          </label>
          <span className="text-[11px] text-stone-400">Editable</span>
        </div>
        <textarea
          value={audioTranscript || ''}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder={
            isRecording
              ? 'Transcribing your spoken words in real time...'
              : 'Voice note transcript will appear here (or type/paste custom transcript)...'
          }
          rows={2}
          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-all"
        />
      </div>
    </div>
  );
}
