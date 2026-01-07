import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: { label: string; icon: React.ReactNode }[];
  onStepClick?: (step: number) => void;
}

export const StepIndicator = ({
  currentStep,
  steps,
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center">
            <button
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${
                onStepClick ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow scale-110"
                    : isCompleted
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </button>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors duration-300 ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
