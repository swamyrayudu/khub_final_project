/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Linkedin, Github, Globe } from "lucide-react"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ModeToggle } from "@/components/theme/toggle"

type MemberLevel = "mentor" | "lead" | "sd" | "jd"

type Member = {
  name: string
  role: string
  level: MemberLevel
  imageUrl?: string
  linkedin?: string
  email?: string
  github?: string
  portfolio?: string
}

const team: Member[] = [
  // Mentor (1)
  {
    name: "Praveen kumar kolli",
    role: "Project Mentor",
    level: "mentor",
    imageUrl: "/profilepic/mentor.jpg",
    email: "pavankumarkolli753@gmail.com",
    github: "https://github.com/praveen-kolli753",
    linkedin: "https://www.linkedin.com/in/praveen-kumar-kolli-a2329823b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  // Team Lead (1)
  {
    name: "Mohan Sunkara",
    role: "Team Lead & Full-stack Developer",
    level: "lead",
    imageUrl: "/teamimg/m.png",
    email: "mohanchowdary963@gmail.com",
    github: "https://github.com/Mohanchowdary1223",
    linkedin: "https://www.linkedin.com/in/mohan-sunkara/",
    portfolio: "https://mohansunkara.vercel.app", // ✅ WORKS
  },
  // Senior Developers (3) - ✅ FIXED PORTFOLIOS
  {
    name: "G.Sai Varshitha",
    role: "Senior Backend Developer",
    level: "sd",
    imageUrl: "/teamimg/sv.jpeg",
    email: "saivarshithaguddanti2004@gmail.com",
    github: "https://github.com/Saivarshita123",
    linkedin: "https://www.linkedin.com/in/sai-varshitha-guddanti-70b40b286/",
    portfolio: "https://varshiportfoilo.netlify.app/", // ✅ NOW WORKS
  },
  {
    name: "K.Lakshmi Prasanna",
    role: "Senior Frontend Developer",
    level: "sd",
    imageUrl: "/teamimg/prasanna.png",
    email: "lakshmiprasannakanuri@gmail.com",
    github: "https://github.com/KanuriLakshmiPrasanna",
    linkedin: "https://www.linkedin.com/in/kanuri-lakshmi-prasanna9642104868",
    // portfolio: "add if available"
  },
  {
    name: "Ch.Lakshmi Pavani",
    role: "Senior Frontend Developer",
    level: "sd",
    imageUrl: "/teamimg/pavani.jpeg",
    email: "challalakshmipavani90143@gmail.com",
    github: "https://github.com/Lakshmi-19pavani",
    linkedin: "https://www.linkedin.com/in/lakshmi-pavani-challa-04b654286",
    // portfolio: "add if available"
  },
  // Junior Developers (4) - ✅ FIXED PORTFOLIOS
  {
    name: "R.V.V.Swamy",
    role: "Junior Full-stack Developer",
    level: "jd",
    imageUrl: "/teamimg/rs.jpeg",
    email: "swamyrayudu7288@gmail.com",
    github: "https://github.com/swamyrayudu/",
    linkedin: "https://www.linkedin.com/in/rayudu-veera-venkata-swamy/",
    portfolio: "https://swamyrayudu.vercel.app/", // ✅ NOW WORKS
  },
  {
    name: "P.Devi",
    role: "Junior Frontend Developer",
    level: "jd",
    imageUrl: "/teamimg/devi.jpeg",
    email: "devipaidikondala3@gmail.com",
    github: "https://github.com/devipaidikondala",
    linkedin: "https://www.linkedin.com/in/pydikondala-devi-07676131b"
  },
  {
    name: "G.Satyanarayana",
    role: "Junior Backend Developer",
    level: "jd",
    imageUrl: "/teamimg/sn.png",
    email: "satyanarayanag904@gmail.com",
    github: "https://github.com/Gadisatyanarayana",
    linkedin: "https://www.linkedin.com/in/gadi-satya-narayana-270b31296?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  {
    name: "B. Ashwini Durga ",
    role: "Junior Frontend Developer",
    level: "jd",
    imageUrl: "/teamimg/ad.jpeg",
    email: "bashwinidurga@gmail.com",
    github: "https://github.com/Ashwinidurga7",
    linkedin: "https://www.linkedin.com/in/ashwini-durga-335bb7306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
]

const sectionOrder: { id: MemberLevel; title: string; subtitle: string }[] = [
  {
    id: "mentor",
    title: "Team Mentor",
    subtitle: "Guiding the technical and product direction for LocalHunt.",
  },
  {
    id: "lead",
    title: "Team Lead",
    subtitle: "Coordinating the LocalHunt roadmap and architecture.",
  },
  {
    id: "sd",
    title: "Senior Developers",
    subtitle: "Owning core features, reviews, and engineering standards.",
  },
  {
    id: "jd",
    title: "Junior Developers",
    subtitle: "Driving implementation, testing, and UI refinements.",
  },
]

function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      className="group bg-card border border-border/50 rounded-xl p-6 h-[400px] w-full max-w-xs flex flex-col justify-between hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 backdrop-blur-sm"
    >
      {/* Taller RECTANGULAR Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32 md:w-36 md:h-40 overflow-hidden rounded-xl border-4 border-background/20 group-hover:border-primary/50 transition-all duration-300 shadow-lg">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover"
              suppressHydrationWarning
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center rounded-xl">
              <span className="text-xl font-bold text-primary">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name & Role */}
      <div className="text-center space-y-1 flex-1 flex flex-col justify-center">
        <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent leading-tight">
          {member.name}
        </h3>
        <p className="text-sm md:text-base text-muted-foreground font-medium tracking-wide">
          {member.role}
        </p>
      </div>

      {/* Social Links - ✅ ALL PORTFOLIOS WORK */}
      <div className="flex justify-center gap-3 pt-4 border-t border-border/50">
        {member.email && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 group-hover:scale-105"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="h-4 w-4" suppressHydrationWarning />
              </a>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Email</TooltipContent>
          </Tooltip>
        )}
        {member.linkedin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 group-hover:scale-105"
                aria-label={`${member.name} LinkedIn`}
              >
                <Linkedin className="h-4 w-4" suppressHydrationWarning />
              </a>
            </TooltipTrigger>
            <TooltipContent className="text-xs">LinkedIn</TooltipContent>
          </Tooltip>
        )}
        {member.github && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 group-hover:scale-105"
                aria-label={`${member.name} GitHub`}
              >
                <Github className="h-4 w-4" suppressHydrationWarning />
              </a>
            </TooltipTrigger>
            <TooltipContent className="text-xs">GitHub</TooltipContent>
          </Tooltip>
        )}
        {member.portfolio && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={member.portfolio}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 group-hover:scale-105"
                aria-label={`${member.name} Portfolio`}
              >
                <Globe className="h-4 w-4" suppressHydrationWarning />
              </a>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Portfolio</TooltipContent>
          </Tooltip>
        )}
      </div>
    </motion.article>
  )
}

export default function OurTeamPage() {
  const router = useRouter()

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50" suppressHydrationWarning>
        {/* Back Button + Theme Toggle */}
        <div className="pt-8 pb-4 px-6 max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 max-w-max"
            suppressHydrationWarning
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" suppressHydrationWarning />
            <span className="text-base font-semibold text-foreground">Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>

        {/* Hero Header */}
        <header className="px-6 pb-20 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6 max-w-max mx-auto">
                LocalHunt Core Team
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6 leading-tight">
                Meet Our Team
              </h1>
            </motion.div>
          </div>
        </header>

        {/* Team Sections */}
        <main className="px-6 pb-24">
          <div className="max-w-4xl mx-auto space-y-16">
            {sectionOrder.map((section, sectionIndex) => {
              const members = team.filter((m) => m.level === section.id)
              if (!members.length) return null

              const isSingleItem = members.length === 1
              const showTwoCol = members.length >= 2 && section.id !== "mentor" && section.id !== "lead"

              return (
                <section key={section.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.2 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                  >
                    <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                      {section.title}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      {section.subtitle}
                    </p>
                  </motion.div>

                  <div className={`w-full ${isSingleItem ? 'flex justify-center' : showTwoCol ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'grid grid-cols-1 gap-6'}`}>
                    {members.map((member, index) => (
                      <div key={member.email || member.name} className="w-full max-w-xs flex justify-center">
                        <MemberCard member={member} index={index} />
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
