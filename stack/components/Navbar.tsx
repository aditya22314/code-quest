"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Menu, SearchIcon, X } from "lucide-react"
import { useState } from "react"


export const Navbar = () => {
    const [isOpen,setIsOpen] = useState(false)
    const User = {
        _id:"1",
        name:"Aditya Tejus",
        email:"adityatejus@gmail.com",
        image:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }

    const handleLogout = () => {
        
    }
    return (
        <header className="top-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center border-2 border-t-orange-500 border-b-3 border-b-grey-500" >
            <section className="container flex items-center mx-auto justify-between gap-3 w-full h-full">
                <section className="flex items-center gap-4">
                     <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                    <Link href="/" className="flex items-center">
                       <img src={"/logo.png"} />
                    </Link>
                   
                     <section className="hidden lg:flex items-center gap-4">
                        {["About", "Products", "For Teams"].map((item, index) => (
                            <Link href="/" key={index} className="flex items-center whitespace-nowrap hover:text-orange-500 transition-colors">
                                {item}
                            </Link>
                        ))}
                    </section>
                    <div className="flex-1 max-w-sm hidden sm:block">
                        <Input icon={<SearchIcon />} className="w-full" name="search" placeholder="Search" />
                    </div>
                </section>
                <section className="flex gap-3 items-center">
                    <img src={User.image} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200" alt="User avatar" />
                    <Button className="hidden sm:flex bg-white border black text-black hover:bg-orange-100 hover:text-orange-600 border-gray-200" onClick={handleLogout}>
                        Logout
                    </Button>
                </section>
            </section>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-[64px] left-0 right-0 z-40 bg-white border-b-2 border-orange-500 shadow-xl lg:hidden animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col p-4 gap-4">
                        <div className="block sm:hidden pb-2">
                             <Input icon={<SearchIcon />} className="w-full" name="search" placeholder="Search" />
                        </div>
                        {["About", "Products", "For Teams"].map((item, index) => (
                            <Link 
                                href="/" 
                                key={index} 
                                className="text-lg font-medium py-2 border-b border-gray-100 last:border-0"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <Button className="w-full mt-2 bg-orange-500 text-white hover:bg-orange-600 border-none" onClick={handleLogout}>
                            Logout
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    )
}