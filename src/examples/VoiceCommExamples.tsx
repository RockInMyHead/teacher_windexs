/**
 * Примеры использования голосового общения (VoiceComm)
 * 
 * Этот файл содержит различные примеры для демонстрации
 * работы с TTS (Text-to-Speech) и STT (Speech-to-Text)
 */

import React, { useState } from 'react';
import { useVoiceComm } from '@/hooks/useVoiceComm';
import { VoiceComm, VoiceUtils } from '@/lib/voiceComm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

/**
 * Пример 1: Базовое использование хука useVoiceComm
 */
export const BasicVoiceExample: React.FC = () => {
  const {
    isListening,
    isPlaying,
    interimTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  } = useVoiceComm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Базовый пример голосового общения</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => startListening()}
            disabled={isListening || isPlaying}
            variant="outline"
          >
            {isListening ? '🎙️ Слушаю...' : '🎤 Начать запись'}
          </Button>

          <Button
            onClick={() => stopListening()}
            disabled={!isListening}
            variant="destructive"
          >
            🛑 Остановить запись
          </Button>

          <Button
            onClick={() => speak('Привет! Это голосовое сообщение!')}
            disabled={isPlaying}
            variant="outline"
          >
            {isPlaying ? '🔊 Воспроизведение...' : '🔊 Озвучить'}
          </Button>

          <Button
            onClick={() => stopSpeaking()}
            disabled={!isPlaying}
            variant="destructive"
          >
            ⏹️ Остановить воспроизведение
          </Button>
        </div>

        {interimTranscript && (
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-900">
              🔄 Слышу: <em>{interimTranscript}</em>
            </p>
          </div>
        )}

        {finalTranscript && (
          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm text-green-900">
              ✅ Распознано: <strong>{finalTranscript}</strong>
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 rounded">
            <p className="text-sm text-red-900">❌ Ошибка: {error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Пример 2: Чат с голосовым вводом
 */
export const VoiceChatExample: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputText, setInputText] = useState('');

  const {
    isListening,
    finalTranscript,
    startListening,
    stopListening,
    speak
  } = useVoiceComm({}, (text, isFinal) => {
    if (isFinal) {
      setInputText(text);
    }
  });

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Добавляем сообщение пользователя
    setMessages(prev => [...prev, { role: 'user', content: inputText }]);

    // Озвучиваем подтверждение
    await speak(`Вы сказали: ${inputText}`);

    setInputText('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Чат с голосовым вводом</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* История сообщений */}
        <div className="h-64 border rounded p-4 bg-gray-50 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">Нет сообщений</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Ввод текста */}
        <div className="flex gap-2">
          <Input
            placeholder={isListening ? 'Говорите...' : 'Введите текст или используйте микрофон'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={isListening}
          />
          <Button
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            variant={isListening ? 'destructive' : 'outline'}
          >
            {isListening ? '🎙️' : '🎤'}
          </Button>
          <Button onClick={handleSendMessage}>Отправить</Button>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Пример 3: Настройка параметров голоса
 */
export const VoiceSettingsExample: React.FC = () => {
  const [voice, setVoice] = useState<'nova' | 'shimmer' | 'alloy'>('nova');
  const [speed, setSpeed] = useState(1.0);

  const { speak, isPlaying, stopSpeaking } = useVoiceComm({
    ttsVoice: voice,
    ttsSpeed: speed
  });

  const testText = 'Это пример текста с различными параметрами голоса.';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройка параметров голоса</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Выбор голоса */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Выберите голос:</label>
          <div className="flex gap-2">
            {(['nova', 'shimmer', 'alloy'] as const).map((v) => (
              <Button
                key={v}
                onClick={() => setVoice(v)}
                variant={voice === v ? 'default' : 'outline'}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>

        {/* Выбор скорости */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Скорость: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-2">
          <Button
            onClick={() => speak(testText)}
            disabled={isPlaying}
          >
            🔊 Озвучить пример
          </Button>
          <Button
            onClick={() => stopSpeaking()}
            disabled={!isPlaying}
            variant="destructive"
          >
            ⏹️ Остановить
          </Button>
        </div>

        {/* Информация о поддержке */}
        <div className="p-3 bg-gray-50 rounded text-sm">
          <p><strong>Голоса TTS:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>nova</strong> - Женский, естественный (рекомендуется)</li>
            <li><strong>shimmer</strong> - Женский, бодрый</li>
            <li><strong>alloy</strong> - Мужской, нейтральный</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Пример 4: Проверка поддержки браузера
 */
export const BrowserSupportExample: React.FC = () => {
  const support = VoiceUtils.checkBrowserSupport();
  const languages = VoiceUtils.getSupportedLanguages();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Проверка поддержки браузера</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Поддерживаемые технологии */}
        <div>
          <h3 className="font-semibold mb-2">Поддержка технологий:</h3>
          <div className="space-y-1">
            <p className="text-sm">
              {support.speechRecognition ? '✅' : '❌'} Speech Recognition (STT)
            </p>
            <p className="text-sm">
              {support.audioAPI ? '✅' : '❌'} Web Audio API
            </p>
            <p className="text-sm">
              {support.mediaDevices ? '✅' : '❌'} MediaDevices (Microphone)
            </p>
          </div>
        </div>

        {/* Поддерживаемые языки */}
        <div>
          <h3 className="font-semibold mb-2">Поддерживаемые языки:</h3>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <p key={lang} className="text-sm">
                • {lang}
              </p>
            ))}
          </div>
        </div>

        {/* Рекомендация */}
        {!support.speechRecognition || !support.mediaDevices ? (
          <div className="p-3 bg-yellow-50 rounded">
            <p className="text-sm text-yellow-900">
              ⚠️ Ваш браузер не поддерживает все функции голосового общения.
              Обновите браузер до последней версии.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm text-green-900">
              ✅ Ваш браузер полностью поддерживает голосовое общение!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Пример 5: Обработка ошибок
 */
export const ErrorHandlingExample: React.FC = () => {
  const [customError, setCustomError] = useState<string | null>(null);

  const {
    error,
    speak,
    startListening
  } = useVoiceComm();

  const handleSpeakWithError = async () => {
    try {
      setCustomError(null);
      await speak('Озвучивание с обработкой ошибок');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setCustomError(message);
    }
  };

  const handleListenWithError = () => {
    try {
      setCustomError(null);
      const started = startListening();
      if (!started) {
        setCustomError('Не удалось начать запись. Проверьте разрешения браузера.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при запуске записи';
      setCustomError(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Обработка ошибок</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleSpeakWithError}>
            🔊 Озвучить (с обработкой ошибок)
          </Button>
          <Button onClick={handleListenWithError} variant="outline">
            🎤 Записать (с обработкой ошибок)
          </Button>
        </div>

        {/* Вывод ошибок */}
        {(error || customError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-900 font-semibold mb-1">❌ Ошибка:</p>
            <p className="text-sm text-red-700">{error || customError}</p>
          </div>
        )}

        {/* Советы по решению */}
        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm font-semibold text-blue-900 mb-2">💡 Советы:</p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Проверьте разрешения браузера на доступ к микрофону</li>
            <li>Убедитесь в наличии интернет соединения</li>
            <li>Обновите браузер до последней версии</li>
            <li>Очистите кэш браузера если проблема персистирует</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Главный компонент с примерами
 */
export const VoiceCommExamplesPage: React.FC = () => {
  const [activeExample, setActiveExample] = React.useState<string>('basic');

  const examples = [
    { id: 'basic', title: 'Базовый пример', component: BasicVoiceExample },
    { id: 'chat', title: 'Чат с голосом', component: VoiceChatExample },
    { id: 'settings', title: 'Настройки голоса', component: VoiceSettingsExample },
    { id: 'browser', title: 'Проверка браузера', component: BrowserSupportExample },
    { id: 'errors', title: 'Обработка ошибок', component: ErrorHandlingExample }
  ];

  const currentExample = examples.find(ex => ex.id === activeExample);
  const CurrentComponent = currentExample?.component;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Примеры голосового общения</h1>

      {/* Навигация */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {examples.map((example) => (
          <Button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            variant={activeExample === example.id ? 'default' : 'outline'}
          >
            {example.title}
          </Button>
        ))}
      </div>

      {/* Текущий пример */}
      {CurrentComponent && <CurrentComponent />}
    </div>
  );
};

