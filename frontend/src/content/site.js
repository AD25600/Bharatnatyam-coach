// All landing-page copy lives here so text can be edited (or new sections
// added) without touching any component markup.

export const site = {
  name: "Natya Drishti",
  tagline: "Bharatanatyam pose coach",
  hero: {
    eyebrow: "Computer vision × classical dance",
    title: "Practise with a second pair of eyes",
    body:
      "Upload a photo or strike a pose in front of your webcam. Natya Drishti identifies the pose, " +
      "measures your joint angles against reference data, and points out where to adjust.",
    cta: "Try the demo",
  },
  steps: [
    { title: "Strike a pose", body: "Upload a full-body photo or capture a frame from your webcam." },
    { title: "We read the angles", body: "MediaPipe finds your joints; a trained classifier names the pose." },
    { title: "Get feedback", body: "See your accuracy, focus areas, and joint-by-joint deviations." },
  ],
  about: {
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
    title: "Our Motivation",
    lead: "This project began with a simple idea: could technology offer a little extra support to someone learning Bharatanatyam?",
    paragraphs: [
      "We wanted to explore whether computer vision and machine learning could help learners practise more independently, recognise deviations in their poses, and gain a better understanding of their technique.",
      "We recognise that Bharatanatyam is an art form shaped by years of practice, tradition, and guidance from experienced gurus. Our aim isn't to replicate that experience, but to explore how technology might complement it and make practice a little more accessible.",
      "Through this project, we hope to take a small step towards bringing technology and traditional art closer together.",
    ],
  },
  footer:
    "A student project. Feedback is an aid to practice, not a substitute for a guru's guidance.",
};
