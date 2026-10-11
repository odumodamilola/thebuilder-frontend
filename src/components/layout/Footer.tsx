import Link from 'next/link'
import Wordmark from '../brand/Wordmark'
import NewsletterForm from '../ui/NewsletterForm'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 text-white py-16 px-6 overflow-hidden">
      <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        <div className="flex flex-col gap-6">
          <div>
            <Wordmark inverse />
            <p className="mt-2 text-slate-300 text-sm italic font-serif">Innovate · Connect · Grow.</p>
          </div>
          <div className="flex gap-4 text-slate-300">
            <a href="#" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-white">About</h4>
          <ul className="text-slate-300 text-sm space-y-3 flex flex-col">
            <Link href="/about" className="hover:text-white">Our Story</Link>
            <Link href="/team" className="hover:text-white">Team</Link>
            <Link href="/careers" className="hover:text-white">Careers</Link>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">Platform</h4>
          <ul className="text-slate-300 text-sm space-y-3 flex flex-col">
            <Link href="/stories" className="hover:text-white">Stories</Link>
            <Link href="/builders" className="hover:text-white">Builders Directory</Link>
            <Link href="/startups" className="hover:text-white">Startups Directory</Link>
            <Link href="/opportunities" className="hover:text-white">Opportunities</Link>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">Subscribe</h4>
          <p className="text-slate-300 text-sm mb-4">Get the latest stories and insights in your inbox.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="max-w-container mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-300 relative z-10">
        <div>© 2026 The Builder. Powered by Osun Tech Exchange.</div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none z-0 translate-y-1/4">
        <div className="font-display font-extrabold text-[15vw] leading-none text-navy-700 opacity-15 whitespace-nowrap text-center">
          THE BUILDER
        </div>
      </div>
    </footer>
  )
}
