"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Chat {
  _id: string
  title: string
}

interface Message {
  _id: string
  content: string
  role: "user" | "assistant"
}

export default function Home() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchChats()
    }
  }, [session])

  const fetchChats = async () => {
    const response = await fetch("/api/chats")
    const data = await response.json()
    setChats(data)
  }

  const fetchMessages = async (chatId: string) => {
    const response = await fetch(`/api/messages?chatId=${chatId}`)
    const data = await response.json()
    setMessages(data)
    setSelectedChatId(chatId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !session) return

    setMessages((prev) => [...prev, { _id: Date.now().toString(), role: "user", content: input }])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          chatId: selectedChatId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch response")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { _id: Date.now().toString(), role: "assistant", content: data.response }])
      setSelectedChatId(data.chatId)
      fetchChats()
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { _id: Date.now().toString(), role: "assistant", content: "Sorry, an error occurred. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Button onClick={() => signIn()}>Sign in</Button>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">ChatterMind</h1>
        <Button onClick={() => signOut()} className="mb-4">Sign out</Button>
        <div className="flex">
          <div className="w-1/4 pr-4">
            <h2 className="text-2xl font-bold mb-4">Chats</h2>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat._id}
                  className={`cursor-pointer p-2 ${selectedChatId === chat._id ? 'bg-gray-200' : ''}`}
                  onClick={() => fetchMessages(chat._id)}
                >
                  {chat.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-3/4">
            <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`${message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                        } rounded-lg p-2 max-w-xs`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t flex">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow mr-2"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}