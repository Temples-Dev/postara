import React from "react"
import ReactDOM from "react-dom/client"
import { Router, Route, Routes } from "react-router-dom"
import { HistoryRouter } from "react-router"

import "@/styles.css"
import SignIn from "@/components/SignIn"
import SignUp from "@/components/SignUp"
import Dashboard from "@/components/dashboard/ai"
import NewsletterEditor from "@/components/newsletter/newsletter-editor"
import SubscriptionForm from "@/components/newsletter/subscription-form"
import PostComposer from "@/components/social/post-composer"
import ScheduledPostsList from "@/components/social/scheduled-posts-list"
import ThemeProvider from "@/components/theme-provider"

const routes = (
  <Routes>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/dashboard/ai" element={<Dashboard />} />
    <Route path="/newsletter" element={<NewsletterEditor />} />
    <Route path="/subscription" element={<SubscriptionForm />} />
    <Route path="/post" element={<PostComposer />} />
    <Route path="/posts" element={<ScheduledPostsList />} />
    <Route path="/" element={<SignIn />} />
  </Routes>
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <HistoryRouter>
    <Router>
      {routes}
    </Router>
  </HistoryRouter>
)
