import { useState } from 'react';

interface TermData {
  id: string;
  term: string;
  frequency: number;
}

export const MostSearchedTerms = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const mockTerms: TermData[] = [
    { id: '1', term: 'Fretados', frequency: 90 },
    { id: '2', term: 'Calendário de Provas', frequency: 60 },
    { id: '3', term: 'Rematrícula', frequency: 20 },
  ];

  return (
    <div className="w-full max-w-2xl bg-[#F4F4F4] p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Termos mais buscados</h2>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-left text-gray-700 text-base">
            <th className="pb-2 font-bold pr-4 w-1/3">Termo:</th>
            <th className="pb-2 font-bold px-4 border-l border-gray-300 w-24">Freq.</th>
            <th className="pb-2 font-bold pl-4"></th>
          </tr>
        </thead>
        <tbody>
          {mockTerms.map((item) => {
            const isHovered = hoveredId === item.id;
            
            return (
              <tr 
                key={item.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Transição dinâmica do texto para negrito (font-semibold -> font-bold) */}
                <td className={`py-3 pr-4 text-gray-700 transition-all duration-150 ${
                  isHovered ? 'font-bold' : 'font-semibold'
                }`}>
                  {item.term}
                </td>
                
                <td className={`py-3 px-4 border-l border-gray-300 text-gray-700 transition-all duration-150 ${
                  isHovered ? 'font-bold' : 'font-semibold'
                }`}>
                  {item.frequency}%
                </td>
                
                <td className="py-3 pl-4 w-full">
                  <div className="w-full bg-transparent">
                    {/* Transição dinâmica da cor do verde (bg-[#91B899] -> bg-[#6F9A7B]) */}
                    <div 
                      className={`h-7 rounded-full transition-all duration-200 ease-in-out ${
                        isHovered 
                          ? 'bg-[#6F9A7B] shadow-sm' 
                          : 'bg-[#91B899]' 
                      }`}
                      style={{ width: `${item.frequency}%` }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};