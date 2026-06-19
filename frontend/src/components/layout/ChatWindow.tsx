import { useState, useEffect } from "react";

import TopBar from "./TopBar";
import ChatInput from "../chat/ChatInput";
import MessageBubble from "../chat/MessageBubble";

import { sendChatMessage } from "../../services/chat";
import { getChatHistory } from "../../services/history";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
};

type HistoryItem = {
  user_message: string;
  ai_response: string;
};

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function ChatWindow({
  sidebarOpen,
  setSidebarOpen,
}: Props) {

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(false);

  const getCurrentTime =
    (): string => {
      return new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    };

  useEffect(() => {

    const loadHistory =
      async (): Promise<void> => {

        try {

          const userId =
            localStorage.getItem(
              "user_id"
            ) || "";

          const threadId =
            localStorage.getItem(
              "thread_id"
            ) || "";

          if (
            !userId ||
            !threadId
          ) {
            setMessages([]);
            return;
          }

          const history =
            await getChatHistory(
              userId,
              threadId
            );

          const formatted: Message[] =
            [];

          history.forEach(
            (
              msg: HistoryItem,
              index: number
            ) => {

              formatted.push({
                id:
                  index * 2 + 1,
                sender: "user",
                text:
                  msg.user_message,
                time:
                  getCurrentTime(),
              });

              formatted.push({
                id:
                  index * 2 + 2,
                sender: "ai",
                text:
                  msg.ai_response,
                time:
                  getCurrentTime(),
              });

            }
          );

          setMessages(
            formatted
          );

        } catch (error) {

          console.error(
            error
          );

        }

      };

    void loadHistory();

    const handleThreadChange =
      () => {
        void loadHistory();
      };

    window.addEventListener(
      "threadChanged",
      handleThreadChange
    );

    return () => {

      window.removeEventListener(
        "threadChanged",
        handleThreadChange
      );

    };

  }, []);

  const sendMessage =
    async (
      text: string,
      file?: File | null
    ): Promise<void> => {

      if (
        !text.trim() &&
        !file
      ) {
        return;
      }

      const userMessage: Message =
        {
          id: Date.now(),
          sender: "user",
          text: file
            ? `${text}\n📄 ${file.name}`
            : text,
          time:
            getCurrentTime(),
        };

      setMessages(
        (prev) => [
          ...prev,
          userMessage,
        ]
      );

      try {

        setLoading(true);

        const userId =
          localStorage.getItem(
            "user_id"
          ) || "";

        const threadId =
          localStorage.getItem(
            "thread_id"
          ) || "";

        const reply =
          await sendChatMessage(
            text,
            userId,
            threadId
          );

        const aiMessage: Message =
          {
            id:
              Date.now() + 1,
            sender: "ai",
            text:
              String(reply),
            time:
              getCurrentTime(),
          };

        setMessages(
          (prev) => [
            ...prev,
            aiMessage,
          ]
        );

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);

      }

    };

  const deleteMessage = (
    id: number
  ): void => {

    setMessages(
      (prev) =>
        prev.filter(
          (msg) =>
            msg.id !== id
        )
    );

  };

  const editMessage = (
    id: number
  ): void => {

    const msg =
      messages.find(
        (m) =>
          m.id === id
      );

    if (!msg) {
      return;
    }

    const updated =
      prompt(
        "Edit Message",
        msg.text
      );

    if (!updated) {
      return;
    }

    setMessages(
      (prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                text: updated,
              }
            : m
        )
    );

  };

  return (
    <div
  className="
    h-screen
    flex
    flex-col
    bg-white
    dark:bg-zinc-900
  "
>

      <TopBar
        sidebarOpen={
          sidebarOpen
        }
        setSidebarOpen={
          setSidebarOpen
        }
      />

      <div
  className="
    flex-1
    overflow-y-auto
    px-4
    py-6
    space-y-3
    message-scroll
    bg-gray-50
    dark:bg-zinc-900
  "
>

        {!localStorage.getItem("thread_id") && (
          <div
  className="
    flex
    flex-col
    items-center
    justify-center
    h-full
    text-center
    px-6
  "
>
  <h1
    className="
      text-3xl
      md:text-4xl
      font-bold
      mb-3
      bg-gradient-to-r
      from-cyan-400
      via-blue-400
      to-fuchsia-500
      bg-clip-text
      text-transparent
    "
  >
    Your AI Assistant is Ready
  </h1>

  <p
    className="
      text-base
      md:text-lg
      text-zinc-400
    "
  >
    Ask anything and get instant answers.
  </p>
</div>
        )}

        {messages.map(
          (msg) => (
            <MessageBubble
              key={msg.id}
              id={msg.id}
              sender={msg.sender}
              text={msg.text}
              time={msg.time}
              onDelete={
                deleteMessage
              }
              onEdit={
                editMessage
              }
            />
          )
        )}

        {loading && (
          <div
  className="
    text-zinc-600
    dark:text-zinc-400
  "
>
            AI is typing...
          </div>
        )}

      </div>

      <ChatInput
  threadId={
    localStorage.getItem(
      "thread_id"
    ) || ""
  }
  onSend={sendMessage}
/>

    </div>
  );
}