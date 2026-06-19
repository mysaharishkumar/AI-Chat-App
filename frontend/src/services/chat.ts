import { api } from "./api"

export const sendChatMessage = async (
  message: string,
  userId: string,
  threadId: string
) => {

  const response =
    await api.post(
      "/chat",
      {
        user_id: userId,
        thread_id: threadId,
        message: message
      }
    )

  return response.data.reply

}