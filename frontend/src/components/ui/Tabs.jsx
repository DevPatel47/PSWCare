function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex flex-wrap gap-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`border-b-2 pb-2 text-sm font-medium transition ${
              activeTab === tab
                ? "border-saas-primary text-saas-primary"
                : "border-transparent text-slate-500 hover:text-saas-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Tabs;
