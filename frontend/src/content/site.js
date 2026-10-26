// All landing-page copy lives here so text can be edited (or new sections
// added) without touching any component markup. `icon` values refer to
// names in components/Icon.jsx.

export const site = {
  name: "Natya Drishti",
  tagline: "Bharatanatyam pose coach",
  hero: {
    eyebrow: ["Practise", "Learn", "Refine"],
    title: ["Natya", "Drishti"],
    lead: "A computer-vision companion for your Bharatanatyam practice.",
    body:
      "Upload a photo or strike a pose in front of your webcam. Natya Drishti identifies the pose, " +
      "compares your joint angles with reference data, and shows you exactly where to adjust.",
    cta: "Try the demo",
    secondary: "How it works",
    note: "Free to try — no sign-up, nothing stored.",
    tags: [
      { kicker: "Pose classification", title: "Know which pose you're in" },
      { kicker: "Joint-angle feedback", title: "See what to adjust", small: "Joint by joint" },
    ],
  },
  highlights: [
    { icon: "target", title: "Pose Recognition" },
    { icon: "joints", title: "Joint-Angle Analysis" },
    { icon: "feedback", title: "Corrective Feedback" },
    { icon: "camera", title: "Upload or Webcam" },
  ],
  howItWorks: {
    eyebrow: "A thoughtful practice companion",
    title: "How It Works",
    body: "From a single frame to clear, joint-by-joint guidance in a few seconds.",
    steps: [
      { icon: "upload", title: "Upload or capture", body: "Choose a full-body photo, or use your webcam with a 3-second timer." },
      { icon: "joints", title: "Landmarks detected", body: "MediaPipe locates your shoulders, elbows, wrists, hips, knees and ankles." },
      { icon: "target", title: "Pose classified", body: "A trained Random Forest model recognises the pose from your joint angles." },
      { icon: "feedback", title: "Feedback returned", body: "See your accuracy, focus areas and how far each joint is from the reference." },
    ],
  },
  preview: {
    eyebrow: "See your movement differently",
    title: "Instant, visual feedback",
    body:
      "Every reading highlights the joints that need attention right on your photo, alongside an accuracy " +
      "score, the body parts to focus on, and a per-joint deviation breakdown.",
    cta: "Analyse a pose",
    caption: "Preview is illustrative — scores and labels in the demo come from your own photo.",
  },
  about: {
    eyebrow: "The people behind it",
    title: "About Us",
    team: ["Parv Gupta", "Aakanksha Desai", "Mansi Bansal"],
    mentor: { name: "Dr. Supriya Agrawal", role: "Mentor" },
    paragraphs: [
      "We are Parv Gupta, Aakanksha Desai, and Mansi Bansal, the team behind this project, brought together by a shared interest in technology, innovation, and traditional art forms.",
      "Our project explores how computer vision and machine learning can make Bharatanatyam practice more interactive and accessible. By combining pose classification with corrective feedback, we aim to help learners better understand their movements and identify areas for improvement.",
      "With the guidance and mentorship of Dr. Supriya Agrawal, we are working towards bringing traditional dance and modern technology together, developing a tool that complements the guidance of dance teachers rather than replacing it.",
    ],
  },
  motivation: {
    eyebrow: "Why we built this",
    title: "Our Motivation",
    lead: "This project began with a simple idea: could technology offer a little extra support to someone learning Bharatanatyam?",
    paragraphs: [
      "We wanted to explore whether computer vision and machine learning could help learners practise more independently, recognise deviations in their poses, and gain a better understanding of their technique.",
      "We recognise that Bharatanatyam is an art form shaped by years of practice, tradition, and guidance from experienced gurus. Our aim isn't to replicate that experience, but to explore how technology might complement it and make practice a little more accessible.",
      "Through this project, we hope to take a small step towards bringing technology and traditional art closer together.",
    ],
  },
  cta: {
    eyebrow: "Tradition · Practice · Progress",
    title: ["Let every movement", "tell a story"],
    body: "Try Natya Drishti on your next practice pose — upload a photo or use your webcam.",
    button: "Start practising",
  },
  footer: {
    note: "A student project. Feedback is an aid to practice, not a substitute for a guru's guidance.",
    motto: "Made with respect for the art.",
  },
};
