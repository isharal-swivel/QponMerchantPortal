import React, { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Overview } from "./components/Overview";
import { CreateDeal } from "./components/CreateDeal";
import { Scanner } from "./components/Scanner";
import { Analytics } from "./components/Analytics";
import { Profile } from "./components/Profile";
import { MyDeals } from "./components/MyDeals";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { WelcomeVideoModal } from "./components/WelcomeVideoModal";
import { OnboardingGuide } from "./components/OnboardingGuide";
import { Toaster } from "./components/ui/sonner";

// Placeholder for Supabase connection logic (if we were to implement it)
const SupabaseConnectionBanner = () => null;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for auth state to persist session
    const storedAuth = localStorage.getItem("qp_merchant_auth");
    return storedAuth === "true";
  });
  const [authView, setAuthView] = useState<
    "signin" | "signup" | "forgotpassword"
  >("signin");
  const [currentView, setCurrentView] = useState("dashboard");
  const [showWelcomeVideo, setShowWelcomeVideo] =
    useState(false);
  const [showWelcomeModal, setShowWelcomeModal] =
    useState(false);

  const handleLoginSuccess = () => {
    localStorage.setItem("qp_merchant_auth", "true");
    setIsAuthenticated(true);
    setShowWelcomeModal(true); // Show welcome details modal first
  };

  // If not authenticated, show Auth pages
  if (!isAuthenticated) {
    return (
      <>
        {authView === "signin" ? (
          <SignIn
            onSignIn={handleLoginSuccess}
            onNavigateToSignUp={() => setAuthView("signup")}
            onNavigateToForgotPassword={() =>
              setAuthView("forgotpassword")
            }
          />
        ) : authView === "signup" ? (
          <SignUp
            onSignUp={handleLoginSuccess}
            onNavigateToSignIn={() => setAuthView("signin")}
          />
        ) : (
          <ForgotPassword
            onNavigateToSignIn={() => setAuthView("signin")}
          />
        )}
        <Toaster position="top-center" />
        <SupabaseConnectionBanner />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Overview onNavigate={setCurrentView} />;
      case "create":
        return <CreateDeal />;
      case "my-deals":
        return <MyDeals />;
      case "scan":
        return <Scanner />;
      case "analytics":
        return <Analytics />;
      case "profile":
        return <Profile />;
      default:
        return <Overview onNavigate={setCurrentView} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("qp_merchant_auth");
    setIsAuthenticated(false);
    setAuthView("signin");
    setCurrentView("dashboard"); // Reset view
  };

  return (
    <>
      <Layout
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenVideo={() => setShowWelcomeVideo(true)}
        onLogout={handleLogout}
      >
        {renderView()}
      </Layout>
      <OnboardingGuide
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onWatchVideo={() => {
          setShowWelcomeModal(false);
          setShowWelcomeVideo(true);
        }}
      />
      <WelcomeVideoModal
        isOpen={showWelcomeVideo}
        onClose={() => setShowWelcomeVideo(false)}
      />
      <Toaster position="top-center" />
      <SupabaseConnectionBanner />
    </>
  );
}