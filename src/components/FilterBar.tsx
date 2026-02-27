interface Props {
  filterCondition: string;
  onFilterChange: (condition: string) => void;
  sortBy: 'name' | 'temperature' | 'snowy';
  onSortChange: (sort: 'name' | 'temperature' | 'snowy') => void;
}

export default function FilterBar({
  filterCondition,
  onFilterChange,
  sortBy,
  onSortChange,
}: Props) {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* Filter */}
      <select
        value={filterCondition}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="all">Tous les filtres</option>
        <option value="snowy">Conditions neigeuses</option>
        <option value="cold">Froid (&lt; 0°C)</option>
        <option value="clear">Dégagé</option>
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'name' | 'temperature' | 'snowy')}
        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="name">Trier par nom</option>
        <option value="temperature">Trier par température</option>
        <option value="snowy">Neige en premier</option>
      </select>
    </div>
  );
}
