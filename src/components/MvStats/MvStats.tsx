import { FiArrowUp, FiArrowDown, FiMinus } from "react-icons/fi";


type TrendType = "positive" | "negative" | "neutral";

interface MvStatsProps {
  title: string;
  value: number | string;
  trend?: TrendType;
  trendValue?: string;
  className?: string;
}

export const MvStats = ({ 
  title, 
  value, 
  trend = "neutral", 
  trendValue, 
  className = "" 
}: MvStatsProps) => {
  const trendConfig = {
    positive: {
      icon: FiArrowUp,
      color: "text-green-600 bg-green-100",
      textColor: "text-green-600",
    },
    negative: {
      icon: FiArrowDown,
      color: "text-red-600 bg-red-100",
      textColor: "text-red-600",
    },
    neutral: {
      icon: FiMinus,
      color: "text-gray-600 bg-gray-100",
      textColor: "text-gray-600",
    },
  };

  const Icon = trendConfig[trend].icon;

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
        {title}
      </dt>
      <dd className="mt-1 flex items-baseline">
        <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </div>
        {trend && trend !== "neutral" && (
          <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendConfig[trend].textColor}`}>
            <Icon
              className={`h-4 w-4 mr-1 p-0.5 rounded-full ${trendConfig[trend].color}`}
              aria-hidden="true"
            />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
        {trend === "neutral" && (
          <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-600 dark:text-gray-300">
            <Icon
              className="h-4 w-4 mr-1 p-0.5 rounded-full text-gray-600 bg-gray-100"
              aria-hidden="true"
            />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </dd>
    </div>
  );
};