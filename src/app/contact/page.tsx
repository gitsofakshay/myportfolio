import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <section className="min-h-screen px-6 md:px-20 py-16 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Contact Me
      </h2>
      <ContactForm />
    </section>
  );
}
