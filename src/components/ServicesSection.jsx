// src/components/ServicesSection.jsx

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Client Management & CRM",
    description:
      "Streamline client onboarding, communication, and project tracking with intuitive dashboards.",
  },
  {
    id: "02",
    title: "Secure Payment Tracking",
    description:
      "Automate invoices, track payments, and manage financial reporting with integrated tools.",
  },
  {
    id: "03",
    title: "Project Workflow Optimization",
    description:
      "Organize tasks, set milestones, and collaborate efficiently with built-in project management features.",
  },
  {
    id: "04",
    title: "Showcase & Portfolio Building",
    description:
      "Craft stunning online portfolios with integrated media management for video and web projects.",
  },
  {
    id: "05",
    title: "Feedback & Revision Cycles",
    description:
      "Simplify client feedback with annotation tools and revision tracking for faster project completion.",
  },
];

// Desktop base values
const CARD_WIDTH_DESKTOP = 350;
const CARD_HEIGHT_DESKTOP = 460;
const STACK_OFFSET_X_DESKTOP = 150;
const STACK_OFFSET_Y_DESKTOP = 40;
const SCROLL_DISTANCE_PER_CARD_DESKTOP = 700;

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const serviceCardRefs = useRef([]);
  serviceCardRefs.current = [];

  const [currentCardWidth, setCurrentCardWidth] = useState(CARD_WIDTH_DESKTOP);
  const [currentCardHeight, setCurrentCardHeight] = useState(CARD_HEIGHT_DESKTOP);
  const [currentStackOffsetX, setCurrentStackOffsetX] = useState(STACK_OFFSET_X_DESKTOP);
  const [currentStackOffsetY, setCurrentStackOffsetY] = useState(STACK_OFFSET_Y_DESKTOP);
  const [currentScrollDistancePerCard, setCurrentScrollDistancePerCard] = useState(SCROLL_DISTANCE_PER_CARD_DESKTOP);
  const [cardsContainerTop, setCardsContainerTop] = useState('10vh');
  const [cardsContainerLeft, setCardsContainerLeft] = useState('50%');
  const [cardsContainerTransform, setCardsContainerTransform] = useState('translateX(-50%)');

  const updateResponsiveValues = () => {
    const vw = window.innerWidth;

    if (vw < 768) {
      const MOBILE_PADDING = 20;
      const mobileCardWidth = vw - 2 * MOBILE_PADDING;

      setCurrentCardWidth(Math.min(CARD_WIDTH_DESKTOP, mobileCardWidth));
      setCurrentCardHeight(
        Math.min(CARD_HEIGHT_DESKTOP, mobileCardWidth * (CARD_HEIGHT_DESKTOP / CARD_WIDTH_DESKTOP))
      );

      setCurrentStackOffsetX(5);
      setCurrentStackOffsetY(20);
      setCurrentScrollDistancePerCard(300);
      setCardsContainerTop('15vh');
      setCardsContainerLeft(`${MOBILE_PADDING}px`);
      setCardsContainerTransform('none');
    } else if (vw < 1024) {
      const cardWidth = Math.min(CARD_WIDTH_DESKTOP, vw * 0.6);
      const totalStackWidth = cardWidth + (services.length - 1) * 50;

      setCurrentCardWidth(cardWidth);
      setCurrentCardHeight(cardWidth * (CARD_HEIGHT_DESKTOP / CARD_WIDTH_DESKTOP));
      setCurrentStackOffsetX(50);
      setCurrentStackOffsetY(25);
      setCurrentScrollDistancePerCard(500);
      setCardsContainerTop('10vh');
      setCardsContainerLeft(`calc(50% - ${totalStackWidth / 2}px)`);
      setCardsContainerTransform('none');
    } else {
      const totalStackWidth = CARD_WIDTH_DESKTOP + (services.length - 1) * STACK_OFFSET_X_DESKTOP;

      setCurrentCardWidth(CARD_WIDTH_DESKTOP);
      setCurrentCardHeight(CARD_HEIGHT_DESKTOP);
      setCurrentStackOffsetX(STACK_OFFSET_X_DESKTOP);
      setCurrentStackOffsetY(STACK_OFFSET_Y_DESKTOP);
      setCurrentScrollDistancePerCard(SCROLL_DISTANCE_PER_CARD_DESKTOP);
      setCardsContainerTop('10vh');
      setCardsContainerLeft(`calc(50% - ${totalStackWidth / 2}px)`);
      setCardsContainerTransform('none');
    }
  };

  useEffect(() => {
    updateResponsiveValues();
    window.addEventListener('resize', updateResponsiveValues);
    return () => window.removeEventListener('resize', updateResponsiveValues);
  }, []);

  const TOTAL_SCROLL = services.length * currentScrollDistancePerCard;

  const addToCardRefs = (el) => {
    if (el && !serviceCardRefs.current.includes(el)) {
      serviceCardRefs.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      serviceCardRefs.current.sort((a, b) => parseInt(a.dataset.id) - parseInt(b.dataset.id));

      gsap.fromTo(
        ".services-headline",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${TOTAL_SCROLL}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const numCards = serviceCardRefs.current.length;

          serviceCardRefs.current.forEach((card, i) => {
            const segment = 1 / numCards;
            const cardStart = i * segment;
            const cardEnd = (i + 1) * segment;
            let cardProgress = (progress - cardStart) / segment;
            cardProgress = Math.max(0, Math.min(1, cardProgress));

            gsap.to(card, {
              x: currentStackOffsetX * i,
              y: currentStackOffsetY * i,
              opacity: cardProgress,
              scale: 0.95 + 0.05 * cardProgress,
              rotate: 5 * (1 - cardProgress),
              zIndex: i + 1,
              duration: 0.2,
              overwrite: true,
              ease: "power2.out",
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [currentStackOffsetX, currentStackOffsetY, currentScrollDistancePerCard]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-black overflow-hidden"
      style={{ minHeight: '110vh' }}
    >
      <div className="container mx-auto px-6 max-w-7xl pt-8 pb-12 relative z-20">
        <h2 className="services-headline text-4xl md:text-6xl font-extrabold text-center mb-12 md:mb-24">
          <span className="text-[#F4A100] pacifico-regular">Botfolio</span>{" "}
          <span className="text-black">SERVICES</span>{" "}
          <span className="text-gray-400 font-light">ELEVATE YOUR WORK</span>
        </h2>
      </div>

      <div
        className="absolute z-20 overflow-visible w-full mt-4 ml-6 md:mt-12 md:mb-40 mb-24"
        style={{
          top: cardsContainerTop,
          left: cardsContainerLeft,
          transform: cardsContainerTransform,
        }}
      >
        {services.map((service) => (
          <div
            key={service.id}
            data-id={service.id}
            ref={addToCardRefs}
            className="service-card absolute rounded-sm shadow-xl p-6 md:p-12 text-left flex flex-col justify-between opacity-0 border border-white/30"
            style={{
              width: `${currentCardWidth}px`,
              height: `${currentCardHeight}px`,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
            }}
          >
            <div className="text-[#F4A100] text-[100px] md:text-[110px] font-bold absolute -top-5 -left-3 opacity-70 pointer-events-none">
              {service.id}
            </div>
            <div className="mt-auto z-10 relative">
              <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                {service.title}
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
