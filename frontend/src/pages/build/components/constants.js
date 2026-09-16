export const AVAILABLE_COMPONENTS = [
  { id: "navbar", name: "Navbar", category: "LAYOUT" },
  { id: "hero", name: "Hero", category: "LAYOUT" },
  { id: "section", name: "Section", category: "LAYOUT" },
  { id: "features", name: "Features Grid", category: "LAYOUT" },
  { id: "pricing", name: "Pricing Table", category: "LAYOUT" },
  { id: "testimonials", name: "Testimonials", category: "LAYOUT" },
  { id: "faq", name: "FAQ Accordion", category: "LAYOUT" },
  { id: "footer", name: "Advanced Footer", category: "LAYOUT" },
  { id: "heading", name: "Heading", category: "ELEMENTS" },
  { id: "paragraph", name: "Paragraph / Rich Text", category: "ELEMENTS" },
  { id: "button", name: "Button", category: "ELEMENTS" },
  { id: "image", name: "Image", category: "ELEMENTS" },
  { id: "divider", name: "Divider", category: "ELEMENTS" },
  { id: "form", name: "Contact Form", category: "FORMS" },
  { id: "authForm", name: "Authentication Form", category: "FORMS" },
];

export const createDefaultComponent = (type) => {
  const base = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    width: type === "button" ? "auto" : "100%",
    minHeight: "",
    borderRadius: type === "button" ? 6 : 0,
    margin: 0,
    hoverEffect: "none",
  };

  switch (type) {
    case "navbar":
      return {
        ...base,
        brand: "CodeXel",
        brandColor: "#0f172a",
        navLinkColor: "#475569",
        navLinks: [
          { id: "link-1", label: "Home", targetPageId: "" },
          { id: "link-2", label: "About", targetPageId: "" },
          { id: "link-3", label: "Pricing", targetPageId: "" },
        ],
        showNavCta: false, // Removed by default
        navCtaText: "Get Started",
        navCtaPageId: "",
        navCtaBg: "#2563eb",
        navCtaColor: "#ffffff",
      };

    case "hero":
      return {
        ...base,
        heading: "Build Modern Web Experiences\nEffortlessly and Intuitively",
        description: "Design and export responsive interfaces visually in minutes.\nClean code output at your fingertips.",
        showHeroButton: true,
        buttonText: "Get Started",
        heroButtonBg: "#ffffff",
        heroButtonTextColor: "#2563eb",
        heroButtonLink: "#",
        heroButtonPageId: "",
        showSecondaryButton: true,
        secondaryButtonText: "Documentation",
        secondaryButtonLink: "#",
        secondaryButtonPageId: "",
      };

    case "paragraph":
      return {
        ...base,
        content: "CodeXel provides a fully responsive flexbox-first canvas.\nDesign cleanly across all device widths without breaking layout constraints.",
      };

    case "heading":
      return {
        ...base,
        title: "Interactive Web Interfaces\nBuilt for Speed",
        subtitle: "Customize layout primitives and structure in real time.",
      };

    case "features":
      return {
        ...base,
        boxHoverEffect: "lift",
        featuresList: [
          { id: "feat-1", title: "Blazing Fast", desc: "Minimal runtime overhead ensuring tiny bundles." },
          { id: "feat-2", title: "Tailwind Native", desc: "Clean atomic utility classes without messy inline CSS." },
          { id: "feat-3", title: "Multi-Page Ready", desc: "Export entire website architectures bundled into source trees." },
        ],
      };

    case "pricing":
      return {
        ...base,
        pricingPlan: "Pro Plan",
        pricingPrice: "$29",
        pricingPeriod: "/ month",
        pricingBadge: "Most Popular",
        pricingFeaturesList: [
          { id: "pf-1", text: "Unlimited Design Pages", included: true },
          { id: "pf-2", text: "Full ZIP Source Code Export", included: true },
          { id: "pf-3", text: "Custom Subdomain Hosting", included: true },
          { id: "pf-4", text: "Dedicated Support Specialist", included: false },
        ],
        pricingButtonText: "Choose Plan",
        pricingButtonBg: "#2563eb",
        pricingButtonTextColor: "#ffffff",
        pricingButtonPageId: "",
      };

    case "testimonials":
      return {
        ...base,
        testimonialsList: [
          {
            id: "t-1",
            author: "Sarah Jenkins",
            role: "Product Designer at Acme",
            quote: "CodeXel cut our landing page prototyping time in half. The multi-page linking is genius.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            rating: 5,
          },
          {
            id: "t-2",
            author: "Alex Rivera",
            role: "Founder at LaunchFast",
            quote: "The exported React and Tailwind code is exceptionally clean. Zero bloated CSS classes.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            rating: 5,
          },
        ],
      };

    case "faq":
      return {
        ...base,
        faqTitle: "Frequently Asked Questions",
        faqSubtitle: "Everything you need to know about building with CodeXel.",
        faqList: [
          {
            id: "faq-1",
            question: "Can I export the source code for free?",
            answer: "Yes, you can export fully modular React JSX and Tailwind CSS code anytime as a single file or a zipped multi-page directory.",
          },
          {
            id: "faq-2",
            question: "Is the exported code production ready?",
            answer: "Absolutely. The code uses standard React functional components with clean Tailwind v4 atomic classes and no third-party lock-in.",
          },
        ],
      };

    case "footer":
      return {
        ...base,
        brand: "CodeXel",
        footerAbout: "Empowering creators to design and export production-grade interfaces visually.",
        copyright: "© 2026 CodeXel Inc. All rights reserved.",
        footerColumns: [
          {
            id: "col-1",
            title: "Product",
            items: [
              { label: "Overview", link: "#", targetPageId: "" },
              { label: "Features", link: "#", targetPageId: "" },
            ],
          },
          {
            id: "col-2",
            title: "Resources",
            items: [
              { label: "Documentation", link: "#", targetPageId: "" },
              { label: "Privacy Policy", link: "#", targetPageId: "" },
            ],
          },
        ],
      };

    case "form":
      return {
        ...base,
        formTitle: "Get in Touch",
        submitButtonText: "Send Message",
        formFields: [
          { id: "f-1", label: "Full Name", type: "text", placeholder: "Jane Doe", required: true },
          { id: "f-2", label: "Email Address", type: "email", placeholder: "jane@company.com", required: true },
          { id: "f-3", label: "Message", type: "textarea", placeholder: "How can we help?", required: false },
        ],
      };

    case "authForm":
      return {
        ...base,
        authMode: "login",
        authTitle: "Welcome Back",
        authSubtitle: "Sign in to manage your projects and preferences.",
        showSocialLogin: true,
        showRememberMe: true,
        showForgotPassword: true,
        submitButtonText: "Sign In",
        authFields: [
          { id: "af-1", label: "Email Address", type: "email", placeholder: "you@domain.com", required: true },
          { id: "af-2", label: "Password", type: "password", placeholder: "••••••••", required: true },
        ],
      };

    case "button":
      return {
        ...base,
        text: "Explore Now",
        link: "#",
        targetPageId: "",
        btnBgColor: "#2563eb",
        btnTextColor: "#ffffff",
        btnAlign: "left",
        btnPaddingX: 20,
        btnPaddingY: 10,
      };

    case "image":
      return {
        ...base,
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000",
        alt: "Modern workspace visual",
        imageWidth: "100",
        imageHeight: "360",
        objectFit: "cover",
      };

    case "divider":
      return {
        ...base,
        dividerColor: "#e2e8f0",
        dividerThickness: "1",
      };

    default:
      return {
        ...base,
        heading: "Custom Section",
        content: "Add your text here.",
      };
  }
};