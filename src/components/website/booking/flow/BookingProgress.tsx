
import { BookingProgressProps } from "../types";

export function BookingProgress({ currentStep, getStepTitle }: BookingProgressProps) {
  const steps = [
    { id: 0, label: "Serviço" },
    { id: 1, label: "Profissional" },
    { id: 2, label: "Data/Hora" },
    { id: 3, label: "Dados" },
    { id: 4, label: "Confirmar" }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">{getStepTitle()}</h2>
      
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            
            <span
              className={`text-xs mt-2 hidden sm:block ${
                currentStep >= step.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            
            {index < steps.length - 1 && (
              <div
                className={`absolute left-0 h-0.5 top-4 -z-10 ${
                  currentStep > index ? "bg-primary" : "bg-muted"
                }`}
                style={{
                  width: `${100 / (steps.length - 1)}%`,
                  transform: `translateX(${index * (100 / (steps.length - 1))}%)`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
