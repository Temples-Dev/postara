import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import "./styles/globals.css"
import SignIn from "@/components/SignIn"
import SignUp from "@/components/SignUp"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const root = document.getElementById("root")

if (!root) {
  throw new Error("Missing #root element")
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
