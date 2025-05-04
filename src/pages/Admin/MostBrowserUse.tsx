import { useEffect, useState } from "react";
import { getMostBrowserUse } from "../../services/userService";
import { Browser } from "../../app/Types/objects/Browser";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define colors for the pie slices
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];

const MostBrowserUse = () => {
  const [browsers, setBrowsers] = useState<Browser[]>([]);
  useEffect(() => {
    getMostBrowserUse()
      .then((data) => setBrowsers(data))
      .catch((err) => console.error("Error fetching browser usage:", err));
  }, []);

  return (
    
      <div>

        {browsers.length > 0 ? (
          <ResponsiveContainer width="100%" height={300} >
            <PieChart>
              <Pie
                dataKey="total_visits"
                nameKey="browser_name"
                data={browsers}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={60}
                paddingAngle={5}
                label
              >
                {browsers.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No browser data available.</p>
        )}

      </div>

  );
};

export default MostBrowserUse;
