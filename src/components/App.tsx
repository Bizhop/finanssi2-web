import React, { useState } from "react"
import { useSubscription } from "react-stomp-hooks"
import { z } from "zod"

const ChatMessageSchema = z.object({
    username: z.string(),
    message: z.string(),
    timestamp: z.number()
})

type ChatMessage = z.infer<typeof ChatMessageSchema>

const App = () =>
    <div>
        <h1>Finanssi 2</h1>
        <Chat />
    </div>

const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])

    const addMessage = (jsonString: string) => {
        const parsedObject = JSON.parse(jsonString)
        const safeParsed = ChatMessageSchema.safeParse(parsedObject)

        if(safeParsed.success) {
            setMessages(prevMessages => [...prevMessages, safeParsed.data])
        }
    }

    useSubscription("/topic/chat", message => addMessage(message.body))

    return <div>
        {messages.map(msg => <p>{msg.username} at {msg.timestamp}: {msg.message}</p>)}
    </div>
}

export default App
