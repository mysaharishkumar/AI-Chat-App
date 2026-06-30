import { useState, useRef, useEffect } from "react";

import {
  Plus,
  Mic,
  ArrowUp,
} from "lucide-react";

type Props = {
  threadId: string;
  onSend: (
    text: string,
    file?: File | null
  ) => void;
};

interface SpeechRecognitionResultEvent
  extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface RecognitionInstance {
  lang: string;
  start: () => void;
  onresult:
    | ((
        event: SpeechRecognitionResultEvent
      ) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface CustomWindow
  extends Window {
  SpeechRecognition?: {
    new (): RecognitionInstance;
  };
  webkitSpeechRecognition?: {
    new (): RecognitionInstance;
  };
}

export default function ChatInput({
  threadId,
  onSend,
}: Props) {

  const [message, setMessage] =
  useState("");

const [listening, setListening] =
  useState(false);

const [selectedFile, setSelectedFile] =
  useState<File | null>(null);

const [visible, setVisible] =
  useState(false);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (threadId) {

  queueMicrotask(() => {
    setVisible(true);
  });

}

    const guestStart = () => {

      setVisible(true);

    };

    const guestHome = () => {

      setVisible(false);

    };

    window.addEventListener(
      "guestStartChat",
      guestStart
    );

    window.addEventListener(
      "guestNewChat",
      guestHome
    );

    return () => {

      window.removeEventListener(
        "guestStartChat",
        guestStart
      );

      window.removeEventListener(
        "guestNewChat",
        guestHome
      );

    };

  }, [threadId]);

  if (!visible) {

    return null;

  }

  const sendMessage = (): void => {

    if (
      !message.trim() &&
      !selectedFile
    ) {
      return;
    }

    onSend(
      message,
      selectedFile
    );

    setMessage("");

    setSelectedFile(null);

    if (textareaRef.current) {

      textareaRef.current.style.height =
        "48px";

    }

  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {

    setMessage(
      e.target.value
    );

    e.target.style.height =
      "auto";

    e.target.style.height =
      `${Math.min(
        e.target.scrollHeight,
        180
      )}px`;

  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();

    }

  };

  const startVoiceInput = (): void => {

    const customWindow =
      window as CustomWindow;

    const SpeechRecognitionAPI =
      customWindow.SpeechRecognition ||
      customWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {

      alert(
        "Speech Recognition not supported"
      );

      return;

    }

    const recognition =
      new SpeechRecognitionAPI();

    recognition.lang =
      "en-US";

    recognition.start();

    setListening(true);

    recognition.onresult =
      (event) => {

        setMessage(
          event.results[0][0]
            .transcript
        );

      };

    recognition.onerror =
      () => setListening(false);

    recognition.onend =
      () => setListening(false);

  };

  return (

    <div
      className="
        sticky
        bottom-0
        bg-white
        dark:bg-zinc-900
        border-t
        border-zinc-300
        dark:border-zinc-800
        p-3
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
        "
      >

        {selectedFile && (

          <div
            className="
              mb-3
              flex
              flex-wrap
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                bg-zinc-800
                text-white
                px-3
                py-2
                rounded-full
                text-sm
              "
            >

              📄

              <span
                className="
                  max-w-[200px]
                  truncate
                "
              >
                {selectedFile.name}
              </span>

              <button
                onClick={() =>
                  setSelectedFile(null)
                }
                className="
                  text-red-400
                  hover:text-red-300
                "
              >
                ✕
              </button>

            </div>

          </div>

        )}

        <div
          className="
            flex
            items-end
            gap-2
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-300
            dark:border-zinc-700
            rounded-[32px]
            px-3
            py-1.5
            min-h-[52px]
            shadow-sm
          "
        >

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={(e) =>
              setSelectedFile(
                e.target.files?.[0] ||
                null
              )
            }
          />

          <button
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="
              p-2
              mb-1
              rounded-full
              text-zinc-600
              dark:text-zinc-400
              hover:bg-gray-200
              dark:hover:bg-zinc-800
            "
          >
            <Plus size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message AI..."
            className="
              flex-1
              resize-none
              bg-transparent
              text-black
              dark:text-white
              outline-none
              min-h-[20px]
              max-h-[180px]
              overflow-y-auto
              leading-6
              placeholder:text-zinc-400
            "
          />

          <button
            onClick={startVoiceInput}
            className={`
              p-2
              mb-1
              rounded-full
              hover:bg-gray-200
              dark:hover:bg-zinc-800
              ${
                listening
                  ? "text-red-500 animate-pulse"
                  : "text-zinc-600 dark:text-zinc-400"
              }
            `}
          >
            <Mic size={20} />
          </button>

          <button
            onClick={sendMessage}
            className="
              w-8
              h-8
              mb-1
              rounded-full
              bg-black
              dark:bg-white
              text-white
              dark:text-black
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <ArrowUp size={18} />
          </button>

        </div>

      </div>

    </div>

  );

}