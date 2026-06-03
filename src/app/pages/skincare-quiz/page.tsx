import type { Metadata } from "next";
import { SkincareQuizPage } from "@/components/quiz/SkincareQuizPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Personalized Skincare Quiz",
  description:
    "Take the Buudy skincare quiz to match your concerns with a personalized LED light therapy and daily skincare routine.",
  alternates: {
    canonical: "/pages/skincare-quiz",
  },
  openGraph: {
    title: "Personalized Skincare Quiz | Buudy",
    description:
      "Build a personalized LED light therapy and daily skincare routine in 60 seconds.",
    url: absoluteUrl("/pages/skincare-quiz"),
  },
};

export default function Page() {
  return <SkincareQuizPage />;
}
