interface TermData {
  title: string;
  count: number;
}

interface MostSearchedTermsProps {
  terms: TermData[];
}

export const MostSearchedTerms = ({ terms }: MostSearchedTermsProps) => {
  const maxCount = terms.length > 0 ? Math.max(...terms.map(t => t.count)) : 100;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm h-full">
      <div className="mb-6">
        <h3 className="font-bold text-gray-800">Termos Populares</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Frequência de interações</span>
      </div>
      
      <div className="space-y-4">
        {terms.length === 0 ? (
          <p className="py-10 text-center text-gray-400 italic text-xs">Sem dados disponíveis.</p>
        ) : (
          terms.map((item, idx) => {
            const percentage = Math.round((item.count / maxCount) * 100);
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-600">{item.title}</span>
                  <span className="text-[10px] font-bold text-gray-400">{item.count}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#8B0000] rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};