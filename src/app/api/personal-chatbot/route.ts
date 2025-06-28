import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCachedPortfolioData } from "@/utils/cache";

interface PersonalInfo {
  fullName?: string;
  title?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
}
interface Experience {
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  currentlyWorking?: boolean;
}
interface Education {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  gradeOrPercentage?: string;
  location?: string;
  description?: string;
}
interface Skill {
  name?: string;
  level?: string;
  category?: string;
}
interface Project {
  title?: string;
  description?: string;
  techStack?: string[];
  githubLink?: string;
  liveLink?: string;
  isFeatured?: boolean;
}
interface Certification {
  name?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialUrl?: string;
}
interface ResumeFile {
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: string;
  isActive?: boolean;
}
interface SocialLink {
  platform?: string;
  url?: string;
  icon?: string;
  isActive?: boolean;
}

function filterPersonal(personal: unknown): PersonalInfo {
  if (!personal || typeof personal !== 'object') return {};
  const { fullName, title, bio, location, profileImage } = personal as PersonalInfo;
  return { fullName, title, bio, location, profileImage };
}

function filterExperience(experience: unknown): Experience[] {
  if (!Array.isArray(experience)) return [];
  return experience.map((exp) => {
    if (typeof exp !== 'object' || !exp) return {};
    const { title, company, startDate, endDate, location, description, currentlyWorking } = exp as Experience;
    return { title, company, startDate, endDate, location, description, currentlyWorking };
  });
}

function filterEducation(education: unknown): Education[] {
  if (!Array.isArray(education)) return [];
  return education.map((edu) => {
    if (typeof edu !== 'object' || !edu) return {};
    const { institution, degree, fieldOfStudy, startDate, endDate, gradeOrPercentage, location, description } = edu as Education;
    return { institution, degree, fieldOfStudy, startDate, endDate, gradeOrPercentage, location, description };
  });
}

function filterSkills(skills: unknown): Skill[] {
  if (!Array.isArray(skills)) return [];
  return skills.map((skill) => {
    if (typeof skill !== 'object' || !skill) return {};
    const { name, level, category } = skill as Skill;
    return { name, level, category };
  });
}

function filterProjects(projects: unknown): Project[] {
  if (!Array.isArray(projects)) return [];
  return projects.map((proj) => {
    if (typeof proj !== 'object' || !proj) return {};
    const { title, description, techStack, githubLink, liveLink, isFeatured } = proj as Project;
    return { title, description, techStack, githubLink, liveLink, isFeatured };
  });
}

function filterCertifications(certifications: unknown): Certification[] {
  if (!Array.isArray(certifications)) return [];
  return certifications.map((cert) => {
    if (typeof cert !== 'object' || !cert) return {};
    const { name, issuingOrganization, issueDate, expirationDate, credentialUrl } = cert as Certification;
    return { name, issuingOrganization, issueDate, expirationDate, credentialUrl };
  });
}

function filterResume(resume: unknown): ResumeFile[] {
  if (!Array.isArray(resume)) return [];
  return resume.map((r) => {
    if (typeof r !== 'object' || !r) return {};
    const { fileUrl, fileName, uploadedAt, isActive } = r as ResumeFile;
    return { fileUrl, fileName, uploadedAt, isActive };
  });
}

function filterSocial(social: unknown): SocialLink[] {
  if (!Array.isArray(social)) return [];
  return social.map((link) => {
    if (typeof link !== 'object' || !link) return {};
    const { platform, url, icon, isActive } = link as SocialLink;
    return { platform, url, icon, isActive };
  });
}

export const POST = async (req: NextRequest) => {
  try {
    const { userMessage } = await req.json();
    if (!userMessage) {
      return NextResponse.json(
        { error: "Missing user message" },
        { status: 400 }
      );
    }

    const {
      personal = {},
      projects = [],
      experience = [],
      education = [],
      skills = [],
      certifications = [],
      resume = [],
      social = [],
    } = (await getCachedPortfolioData()) as Record<string, unknown>;

    // Filter all data to exclude sensitive/private fields
    const safePersonal = filterPersonal(personal);
    const safeProjects = filterProjects(projects);
    const safeExperience = filterExperience(experience);
    const safeEducation = filterEducation(education);
    const safeSkills = filterSkills(skills);
    const safeCertifications = filterCertifications(certifications);
    const safeResume = filterResume(resume);
    const safeSocial = filterSocial(social);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format all data into a string to feed into Gemini as context
    const context = `
You are Akshay's personal AI assistant. Greet the user, introduce yourself as Akshay's assistant, and help answer questions about Akshay using the portfolio data below. Only introduce yourself in your first message of a conversation. For all follow-up answers, do not repeat your introduction or greeting—just answer the user's question concisely and directly.

This is Akshay's Portfolio Data:

Personal Info:
${JSON.stringify(safePersonal)}

Experience:
${safeExperience
  .map(
    (exp) =>
      `- ${exp.title} at ${exp.company} (${exp.startDate} to ${exp.endDate})`
  )
  .join("\n")}

Education:
${safeEducation
  .map((edu) => `- ${edu.degree} from ${edu.institution} (${edu.startDate})`)
  .join("\n")}

Skills:
${safeSkills.map((skill) => skill.name).join(", ")}

Projects:
${safeProjects.map((proj) => `- ${proj.title}: ${proj.description}`).join("\n")}

Certifications:
${safeCertifications
  .map((cert) => `- ${cert.name} from ${cert.issuingOrganization}`)
  .join("\n")}

Resume File:
${safeResume.length ? safeResume[0].fileUrl : "No resume uploaded."}

Social Links:
${safeSocial.map((link) => `${link.platform}: ${link.url}`).join("\n")}

---
Now respond to this user query based on this data only:
User: ${userMessage}
`;

    const result = await model.generateContent(context);
    const response = await result.response.text();
    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error("Gemini Chatbot Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
};
