import {
  Rocket,
  Lock,
  Link as LinkIcon,
  Users,
  Code,
  Globe,
  Zap,
  Shield,
} from "lucide-react";

export const features = [
  {
    icon: Rocket,
    title: "Easy Deployment",
    description: "Deploy your React projects with just a few clicks",
  },
  {
    icon: Lock,
    title: "Private Projects",
    description: "Keep your work secure with private project options",
  },
  {
    icon: LinkIcon,
    title: "Custom Slugs",
    description: "Get unique, memorable URLs for your projects",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Share your projects easily with team members and clients",
  },
];

export const steps = [
  {
    step: 1,
    title: "Connect Your Repo",
    description: "Link your GitHub repository to DeployIt",
  },
  {
    step: 2,
    title: "Configure Settings",
    description: "Set up your project preferences and access controls",
  },
  {
    step: 3,
    title: "Deploy & Share",
    description: "Launch your project and share it with the world",
  },
];

export const whyChoseUs = [
  {
    icon: Code,
    title: "Optimized for React",
    description:
      "Our platform is specifically designed to work seamlessly with React projects",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description:
      "Your projects are distributed across a global network for fast access worldwide",
  },
  {
    icon: Zap,
    title: "Instant Deployments",
    description: "See your changes live in seconds, not minutes",
  },
  {
    icon: Shield,
    title: "Built-in Security",
    description:
      "Automatic HTTPS, DDoS protection, and more to keep your projects safe",
  },
];

export const faqs = [
  {
    question: "Is DeployIt free to use?",
    answer:
      "We offer a generous free tier for personal projects. For more information on our pricing, please visit our pricing page.",
  },
  {
    question: "Can I use DeployIt with other frameworks?",
    answer:
      "While DeployIt is optimized for React, we also still working with support for other frameworks like Angular, Vue, and Svelte.",
  },
  {
    question: "How does DeployIt handle environment variables?",
    answer:
      "DeployIt provides a secure way to manage environment variables for your projects, ensuring your sensitive data stays protected.",
  },
];
