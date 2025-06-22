import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCachedPortfolioData } from "@/utils/cache";

function filterPersonal(personal: any) {
  if (!personal) return {};
  const { fullName, title, bio, location, profileImage } = personal;
  return { fullName, title, bio, location, profileImage };
}

function filterExperience(experience: any[]) {
  return (experience || []).map((exp) => ({
    title: exp.title,
    company: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    location: exp.location,
    description: exp.description,
    currentlyWorking: exp.currentlyWorking,
  }));
}

function filterEducation(education: any[]) {
  return (education || []).map((edu) => ({
    institution: edu.institution,
    degree: edu.degree,
    fieldOfStudy: edu.fieldOfStudy,
    startDate: edu.startDate,
    endDate: edu.endDate,
    gradeOrPercentage: edu.gradeOrPercentage,
    location: edu.location,
    description: edu.description,
  }));
}

function filterSkills(skills: any[]) {
  return (skills || []).map((skill) => ({
    name: skill.name,
    level: skill.level,
    category: skill.category,
  }));
}

function filterProjects(projects: any[]) {
  return (projects || []).map((proj) => ({
    title: proj.title,
    description: proj.description,
    techStack: proj.techStack,
    githubLink: proj.githubLink,
    liveLink: proj.liveLink,
    isFeatured: proj.isFeatured,
  }));
}

function filterCertifications(certifications: any[]) {
  return (certifications || []).map((cert) => ({
    name: cert.name,
    issuingOrganization: cert.issuingOrganization,
    issueDate: cert.issueDate,
    expirationDate: cert.expirationDate,
    credentialUrl: cert.credentialUrl,
  }));
}

function filterResume(resume: any[]) {
  return (resume || []).map((r) => ({
    fileUrl: r.fileUrl,
    fileName: r.fileName,
    uploadedAt: r.uploadedAt,
    isActive: r.isActive,
  }));
}

function filterSocial(social: any[]) {
  return (social || []).map((link) => ({
    platform: link.platform,
    url: link.url,
    icon: link.icon,
    isActive: link.isActive,
  }));
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
    } = await getCachedPortfolioData();

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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format all data into a string to feed into Gemini as context
    const context = `
You are Akshay's personal AI assistant. Greet the user, introduce yourself as Akshay's assistant, and help answer questions about Akshay using the portfolio data below.

This is Akshay's Portfolio Data:

Personal Info:
${JSON.stringify(safePersonal)}

Experience:
${safeExperience
  .map(
    (exp: any) =>
      `- ${exp.title} at ${exp.company} (${exp.startDate} to ${exp.endDate})`
  )
  .join("\n")}

Education:
${safeEducation
  .map((edu: any) => `- ${edu.degree} from ${edu.institution} (${edu.startDate})`)
  .join("\n")}

Skills:
${safeSkills.map((skill: any) => skill.name).join(", ")}

Projects:
${safeProjects.map((proj: any) => `- ${proj.title}: ${proj.description}`).join("\n")}

Certifications:
${safeCertifications
  .map((cert: any) => `- ${cert.name} from ${cert.issuingOrganization}`)
  .join("\n")}

Resume File:
${safeResume.length ? safeResume[0].fileUrl : "No resume uploaded."}

Social Links:
${safeSocial.map((link: any) => `${link.platform}: ${link.url}`).join("\n")}

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
