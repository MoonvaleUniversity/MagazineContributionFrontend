// components/MvCharts/index.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
  
  const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
  
  // Common Types
  interface ChartBaseProps {
    width?: number | string;
    height?: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    colors?: string[];
    className?: string;
  }
  
  interface AxisChartProps extends ChartBaseProps {
    xDataKey: string;
    yDataKey: string;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
  }
  
  // Bar Chart Component
  export const MvBarChart = ({
    data,
    xDataKey,
    yDataKey,
    colors = DEFAULT_COLORS,
    width = '100%',
    height = 300,
    showGrid = true,
    showTooltip = true,
    showLegend = true
  }: AxisChartProps) => (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xDataKey} />
        <YAxis />
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        <Bar dataKey={yDataKey}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
  
  // Line Chart Component
  export const MvLineChart = ({
    data,
    xDataKey,
    yDataKey,
    colors = DEFAULT_COLORS,
    width = '100%',
    height = 300,
    showGrid = true,
    showTooltip = true,
    showLegend = true
  }: AxisChartProps) => (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xDataKey} />
        <YAxis />
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        <Line
          type="monotone"
          dataKey={yDataKey}
          stroke={colors[0]}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
  
  // Pie Chart Component
  interface PieChartProps extends ChartBaseProps {
    dataKey: string;
    nameKey: string;
  }
  
  export const MvPieChart = ({
    data,
    dataKey,
    nameKey,
    colors = DEFAULT_COLORS,
    width = '100%',
    height = 300
  }: PieChartProps) => (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
  
  // Multi Series Bar Chart
  interface MultiBarProps extends AxisChartProps {
    bars: { dataKey: string; name: string }[];
  }
  
  export const MvMultiBarChart = ({
    data,
    xDataKey,
    bars,
    colors = DEFAULT_COLORS,
    width = '100%',
    height = 300,
    showGrid = true,
    showTooltip = true,
    showLegend = true
  }: MultiBarProps) => (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xDataKey} />
        <YAxis />
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={colors[index % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );