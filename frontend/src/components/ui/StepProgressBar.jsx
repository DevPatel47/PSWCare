function StepProgressBar({ currentStep, steps }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Step {currentStep}/{steps.length}
        </span>
        <span>{steps[currentStep - 1]}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-saas-primary transition-all"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
        {steps.map((step, index) => (
          <div
            key={step}
            className={index + 1 <= currentStep ? "text-saas-primary" : ""}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepProgressBar;
