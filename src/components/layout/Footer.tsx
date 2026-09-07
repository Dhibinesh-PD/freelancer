import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Lock, Globe2, Award, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Escrow Protection</h4>
              <p className="text-xs text-slate-400">Funds released only upon milestone approval</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Vetted Talent</h4>
              <p className="text-xs text-slate-400">Identity and skills verification workflows</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Enterprise Security</h4>
              <p className="text-xs text-slate-400">OWASP Top 10 mitigation & audit logging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Mediation Support</h4>
              <p className="text-xs text-slate-400">Dedicated dispute arbitration team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Categories */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Top Categories</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services?categorySlug=it-software" className="hover:text-white transition">Web Development</Link></li>
              <li><Link href="/services?categorySlug=it-software" className="hover:text-white transition">AI & Machine Learning</Link></li>
              <li><Link href="/services?categorySlug=design-creative" className="hover:text-white transition">UI/UX & Product Design</Link></li>
              <li><Link href="/services?categorySlug=writing-content" className="hover:text-white transition">Technical Copywriting</Link></li>
              <li><Link href="/services?categorySlug=video-audio" className="hover:text-white transition">Video & Animation</Link></li>
              <li><Link href="/services?categorySlug=business-consulting" className="hover:text-white transition">Financial Modeling</Link></li>
              <li><Link href="/services?categorySlug=legal-contracts" className="hover:text-white transition">Legal & Compliance</Link></li>
            </ul>
          </div>

          {/* Col 2: For Clients */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">For Clients</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/how-it-works" className="hover:text-white transition">How to Hire</Link></li>
              <li><Link href="/dashboard/client/jobs/new" className="hover:text-white transition">Post a Job / Project</Link></li>
              <li><Link href="/freelancers" className="hover:text-white transition">Talent Search Engine</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Predefined Service Packages</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Payment Protection & Fees</Link></li>
              <li><Link href="/dashboard/client" className="hover:text-white transition">Client Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3: For Freelancers */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">For Freelancers</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/how-it-works" className="hover:text-white transition">How to Start Selling</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition">Search Open Jobs</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Create Freelancer Profile</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-white transition">Freelancer Workroom</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Earnings & Payouts</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-white transition">Top-Rated Criteria</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Trust */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Trust & Legal</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/how-it-works" className="hover:text-white transition">Escrow Protection Agreement</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">Privacy Policy (GDPR & DPDP)</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">Dispute Resolution Policy</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition">Cookie Preferences</Link></li>
              <li><Link href="/admin" className="hover:text-indigo-400 transition">Admin Portal Access</Link></li>
            </ul>
          </div>

          {/* Col 5: Company & Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">ApexLance</span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              The next-generation marketplace connecting world-class talent with leading companies.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Globe2 className="h-4 w-4 text-slate-400" />
              <span>Multi-Currency (USD, EUR, GBP, INR)</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ApexLance Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span>Built with Next.js 15 & PostgreSQL Architecture</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
