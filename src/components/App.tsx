import React, { useEffect, useState } from "react"
import { useSubscription } from "react-stomp-hooks"
import { z } from "zod"

const ChatMessageSchema = z.object({
    username: z.string(),
    message: z.string(),
    timestamp: z.number()
})

const ChatMessageSchemaArray = z.array(ChatMessageSchema)

type ChatMessage = z.infer<typeof ChatMessageSchema>

const idToken = process.env.ID_TOKEN

const App = () =>
    <div>
        <h1>Finanssi 2</h1>
        <Chat />
    </div>

const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])

    useEffect(() => {
        fetch('http://localhost:8080/api/chat', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${idToken}`
            }
        })
            .then(response => response.json())
            .then(response => {
                const safeParsed = ChatMessageSchemaArray.parse(response)
                setMessages(safeParsed)
            })
            .catch(console.error)
    }, [])

    const sendChatMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.target as HTMLFormElement
        const message = (form.querySelector('input[name="message"]') as HTMLInputElement).value
        const messageData = {message}

        fetch('http://localhost:8080/api/chat', {
            method: 'POST',
            body: JSON.stringify(messageData),
            headers: {
                "Authorization": `Bearer ${idToken}`,
                "Content-Type": "application/json"
            }
        })

        form.reset()
    }

    const receiveMessage = (jsonString: string) => {
        const parsedObject = JSON.parse(jsonString)
        const safeParsed = ChatMessageSchema.safeParse(parsedObject)

        if (safeParsed.success) {
            setMessages(prevMessages => {
                const addedToMessageArray = [...prevMessages, safeParsed.data]
                return addedToMessageArray.length > 20 ? addedToMessageArray.slice(-20) : addedToMessageArray
            })
        }
    }

    useSubscription("/topic/chat", message => receiveMessage(message.body))

    return <div>
        <form onSubmit={sendChatMessage}>
            <input type="text" name="message"></input>
            <button type="submit">Send</button>
        </form>
        {messages.map((msg, index) => <p key={`chat-message-${index}`}>{index + 1} - <strong>{msg.username}:</strong> {msg.message}</p>)}
    </div>
}

export default App
