"use client"

import { JSX } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default  function ToastProvider():JSX.Element {
    return (
        <ToastContainer />
    )
}