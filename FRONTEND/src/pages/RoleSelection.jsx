import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="min-h-[85vh] bg-surface flex flex-col items-center justify-center px-6 py-20 font-sans">
      <div className="max-w-2xl mb-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl text-ink-MAIN">
          Join House Help Connect
        </h1>
        <p className="text-lg text-ink-MUTED">
          How would you like to use our platform today?
        </p>
      </div>

      <div className="flex flex-col justify-center w-full max-w-5xl gap-8 md:flex-row">
        {/* Client / Hire Card */}
        <button
          onClick={() => handleSelection('client')}
          className="group relative flex flex-col items-center w-full md:w-1/2 p-12 bg-surface-card rounded-[2rem] border border-surface-BORDER shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden text-center"
        >
          {/* Subtle hover gradient ring */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-[2rem] transition-colors duration-300"></div>
          
          <div className="flex items-center justify-center mb-8 text-5xl transition-all duration-300 w-28 h-28 bg-brand-LIGHT rounded-3xl group-hover:scale-110 group-hover:bg-blue-100">
            🧑‍💼
          </div>
          <h2 className="mb-4 text-2xl font-bold text-ink-MAIN">I Want to Hire</h2>
          <p className="leading-relaxed text-ink-MUTED">
            Find trusted, verified helpers and professionals for your home quickly and securely.
          </p>
        </button>

        {/* Worker / Service Provider Card */}
        <button
          onClick={() => handleSelection('worker')}
          className="group relative flex flex-col items-center w-full md:w-1/2 p-12 bg-surface-card rounded-[2rem] border border-surface-BORDER shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-900/10 hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden text-center"
        >
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 rounded-[2rem] transition-colors duration-300"></div>
          
          <div className="flex items-center justify-center mb-8 text-5xl transition-all duration-300 w-28 h-28 bg-indigo-50 rounded-3xl group-hover:scale-110 group-hover:bg-indigo-100">
            🛠️
          </div>
          <h2 className="mb-4 text-2xl font-bold text-ink-MAIN">I Want to Work</h2>
          <p className="leading-relaxed text-ink-MUTED">
            Find local jobs, manage your schedule, and grow your independent service business.
          </p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;