import { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  CheckCircle,
  Users,
  Mail,
  Star,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useGetAchivementsQuery } from "@/lib/store/api/companyInfo";

type IconVariant = "warm" | "cool" | "success" | "purple" | "rose" | "teal";

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  variant: IconVariant;
}


const iconMap: Record<string, React.ElementType> = {
  "Total Services": Briefcase,
  "Projects in Progress": Layers,
  "Completed Projects": CheckCircle,
  "Team Members": Users,
  "New Contacts": Mail,
  "Testimonials": Star,
};

const variantOrder: IconVariant[] = ["warm", "cool", "success", "purple", "rose", "teal"];

const AchievementsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data } = useGetAchivementsQuery();

  const stats: StatItem[] | undefined = data?.data.stats.map((stat, index) => ({
    label: stat.label,
    value: stat.value,
    icon: iconMap[stat.label] || Layers,
    variant: variantOrder[index % variantOrder.length],
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen container mx-auto  relative overflow-hidden py-24 px-4 bg-background"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl bg-primary/10 animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-3xl bg-accent/10 animate-float" style={{ animationDelay: "-10s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl bg-muted/50" />
      </div>

      <div className=" flex justify-center w-full flex-col items-centerrelative z-10">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="mb-6 flex justify-center w-full items-center">
            <span className="section-badge w-fit flex items-center p-2 shadow-md rounded-xl gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Our Journey</span>
            </span>
          </div>

          <h2 className="section-title mb-6">
            Our <span className="text-gradient italic">Achievements</span>
          </h2>

          <p className="section-subtitle">
            Celebrating milestones and the meaningful impact we've created together
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stats?.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  stat: StatItem;
  isVisible: boolean;
  delay: number;
}

const StatCard = ({ stat, isVisible, delay }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const Icon = stat.icon;

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = stat.value / steps;
    const stepDuration = duration / steps;

    const timer = setTimeout(() => {
      let current = 0;
      const counter = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, stat.value, delay]);

  return (
    <article
      className="stat-card group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
      }}
    >
      {/* Icon */}
      <div className="mb-6">
        <div className={`stat-icon stat-icon-${stat.variant}`}>
          <Icon className="w-7 h-7" strokeWidth={2} />
        </div>
      </div>

      {/* Counter */}
      <div className="mb-2">
        <span className="text-5xl font-display font-normal tracking-tight text-foreground">
          {count.toLocaleString()}
        </span>
        <span className="text-3xl font-display text-muted-foreground ml-1">+</span>
      </div>

      {/* Label */}
      <p className="text-base font-medium text-muted-foreground">
        {stat.label}
      </p>

      {/* Progress Bar */}
      <div className="progress-bar mt-6">
        <div
          className={`progress-fill progress-fill-${stat.variant}`}
          style={{
            width: isVisible ? "100%" : "0%",
            transitionDelay: `${delay + 500}ms`,
          }}
        />
      </div>
    </article>
  );
};

export default AchievementsSection;
