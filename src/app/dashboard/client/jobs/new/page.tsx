"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { ALL_SKILLS } from "@/lib/data/skills";
import { Briefcase, ArrowLeft, CheckCircle2, DollarSign } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState(CATEGORIES_DATA[0].slug);
  const [description, setDescription] = useState("");
  const [budgetType, setBudgetType] = useState<"FIXED" | "HOURLY">("FIXED");
  const [budgetMin, setBudgetMin] = useState("1000");
  const [budgetMax, setBudgetMax] = useState("3000");
  const [experienceLevel, setExperienceLevel] = useState<"ENTRY" | "INTERMEDIATE" | "EXPERT">("EXPERT");
  const [durationWeeks, setDurationWeeks] = useState("4");
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Next.js"]);
  const [skillInput, setSkillInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddSkill = (skillName: string) => {
    if (skillName && !skills.includes(skillName)) {
      setSkills([...skills, skillName]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter(s => s !== skillName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedCategory = CATEGORIES_DATA.find(c => c.slug === categorySlug);

    try {
      const res = await fetch("/api/v1/client/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category: selectedCategory?.name || "IT & Software Development",
          categorySlug,
          budgetType,
          budgetMin: Number(budgetMin),
          budgetMax: Number(budgetMax),
          experienceLevel,
          durationWeeks: Number(durationWeeks),
          isRemote: true,
          skills
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/client");
        }, 1200);
      } else {
        alert(data.error?.message || "Failed to post job");
      }
    } catch {
      alert("Error posting project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link
          href="/dashboard/client"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Project Posting Wizard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Create a New Job Listing
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Reach thousands of verified independent specialists. Specify your technical scope and milestones.
            </p>
          </div>

          {success ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white">Project Published Live to Marketplace!</h3>
              <p className="text-xs text-slate-400">Redirecting to your project page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-slate-800">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Real-Time Collaboration & Analytics Portal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Service Category *
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES_DATA.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Scope, Milestones & Detailed Description *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Describe your technical requirements, expected deliverables, milestones, and tech stack expectations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Budget Type & Range */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Contract Type
                  </label>
                  <select
                    value={budgetType}
                    onChange={(e) => setBudgetType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="FIXED">Fixed Escrow Milestones</option>
                    <option value="HOURLY">Hourly Billing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Min Budget ($)
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Duration & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Required Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ENTRY">Entry Level</option>
                    <option value="INTERMEDIATE">Intermediate (3-5 yrs)</option>
                    <option value="EXPERT">Expert / Lead (5+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Estimated Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Required Skills & Technologies (Press Enter or pick below)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type skill name..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(skillInput.trim());
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(skillInput.trim())}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                  >
                    Add
                  </button>
                </div>

                {/* Active skills pills */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-red-400 ml-1 text-slate-400"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                  <span>Quick Add:</span>
                  {["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma", "AWS", "Python"].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => handleAddSkill(s)}
                      className="text-slate-400 hover:text-indigo-400 underline ml-1"
                    >
                      +{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Link
                  href="/dashboard/client"
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
                >
                  <span>{isSubmitting ? "Publishing Project..." : "Publish Job to Marketplace"}</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
