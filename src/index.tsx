import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./components/App"
import { StompSessionProvider } from "react-stomp-hooks"

const container = document.getElementById("app")!
const root = ReactDOM.createRoot(container)
root.render(
    <BrowserRouter>
        <StompSessionProvider url={"http://localhost:8080/ws"}>
            <App />
        </StompSessionProvider>
    </BrowserRouter>
)
