import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  StopCircle,
  Volume2,
  RotateCcw,
  Zap,
  Copy,
  Trash2,
} from "lucide-react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState("pt-BR");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Função para iniciar a fala
  const handleSpeak = () => {
    if (!text.trim()) {
      alert("Por favor, digite algum texto!");
      return;
    }

    // Cancelar qualquer fala anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = language;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Função para pausar/retomar
  const handlePauseResume = () => {
    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  // Função para parar
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Função para resetar
  const handleReset = () => {
    window.speechSynthesis.cancel();
    setText("");
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeed(1);
  };

  // Função para copiar texto
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Texto copiado!");
    } catch {
      alert("Erro ao copiar!");
    }
  };

  // Função para limpar texto
  const handleClear = () => {
    setText("");
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Efeito para parar ao desmontar
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="app-container">
      <div className="glass-card">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <Volume2 className="header-icon" size={32} />
            <h1 className="title">Text to Speech</h1>
            <p className="subtitle">Converta seu texto em fala</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="control-group">
          <label className="label">Idioma</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select-input"
            disabled={isSpeaking}
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="pt-PT">Português (Portugal)</option>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Español (España)</option>
            <option value="es-MX">Español (México)</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
            <option value="it-IT">Italiano</option>
            <option value="ja-JP">日本語</option>
            <option value="zh-CN">中文 (简体)</option>
          </select>
        </div>

        {/* Text Input */}
        <div className="control-group">
          <label className="label">Seu Texto</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="textarea-input"
            placeholder="Digite ou cole seu texto aqui..."
            disabled={isSpeaking}
            rows={6}
          />
          <div className="char-count">{text.length} caracteres</div>
        </div>

        {/* Speed Control */}
        <div className="control-group">
          <label className="label">
            Velocidade: <span className="speed-value">{speed.toFixed(1)}x</span>
          </label>
          <div className="speed-slider-container">
            <span className="speed-label">0.5x</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="speed-slider"
              disabled={isSpeaking}
            />
            <span className="speed-label">2x</span>
          </div>
        </div>

        {/* Status */}
        {isSpeaking && (
          <div className={`status-message ${isPaused ? "paused" : "speaking"}`}>
            <div className="status-indicator"></div>
            {isPaused ? "Pausado" : "Falando..."}
          </div>
        )}

        {/* Control Buttons */}
        <div className="button-group">
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="btn btn-primary"
            title="Iniciar leitura"
          >
            <Play size={20} />
            Falar
          </button>

          <button
            onClick={handlePauseResume}
            disabled={!isSpeaking}
            className="btn btn-secondary"
            title={isPaused ? "Retomar" : "Pausar"}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
            {isPaused ? "Retomar" : "Pausar"}
          </button>

          <button
            onClick={handleStop}
            disabled={!isSpeaking}
            className="btn btn-danger"
            title="Parar leitura"
          >
            <StopCircle size={20} />
            Parar
          </button>
        </div>

        {/* Utility Buttons */}
        <div className="button-group">
          <button
            onClick={handleCopy}
            disabled={!text.trim()}
            className="btn btn-utility"
            title="Copiar texto"
          >
            <Copy size={18} />
            Copiar
          </button>

          <button
            onClick={handleClear}
            disabled={!text.trim()}
            className="btn btn-utility"
            title="Limpar texto"
          >
            <Trash2 size={18} />
            Limpar
          </button>

          <button
            onClick={handleReset}
            className="btn btn-utility"
            title="Resetar tudo"
          >
            <RotateCcw size={18} />
            Resetar
          </button>
        </div>

        {/* Footer Info */}
        <div className="footer-info">
          <Zap size={16} />
          <p>
            Dica: Use qualquer idioma disponível para ouvir o texto em
            diferentes línguas
          </p>
        </div>
      </div>
    </div>
  );
}
