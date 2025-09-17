import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BaseChartProps {
  data: any[];
  height?: number;
  className?: string;
}

interface LineChartProps extends BaseChartProps {
  type: 'line';
  xKey: string;
  yKey: string;
  lineColor?: string;
}

interface AreaChartProps extends BaseChartProps {
  type: 'area';
  xKey: string;
  yKey: string;
  fillColor?: string;
}

interface BarChartProps extends BaseChartProps {
  type: 'bar';
  xKey: string;
  yKey: string;
  barColor?: string;
}

interface PieChartProps extends BaseChartProps {
  type: 'pie';
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

type ChartProps = LineChartProps | AreaChartProps | BarChartProps | PieChartProps;

const DEFAULT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
];

const Chart: React.FC<ChartProps> = (props) => {
  const { data, height = 300, className = '' } = props;

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      return [value.toLocaleString(), name];
    }
    return [value, name];
  };

  const formatAxisTick = (value: any) => {
    if (typeof value === 'number' && value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value;
  };

  if (props.type === 'line') {
    return (
      <div className={`w-full ${className}`}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={props.xKey} 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
              tickFormatter={formatAxisTick}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelClassName="text-sm font-medium"
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line 
              type="monotone" 
              dataKey={props.yKey} 
              stroke={props.lineColor || DEFAULT_COLORS[0]}
              strokeWidth={2}
              dot={{ fill: props.lineColor || DEFAULT_COLORS[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: props.lineColor || DEFAULT_COLORS[0], strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (props.type === 'area') {
    return (
      <div className={`w-full ${className}`}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={props.xKey} 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
              tickFormatter={formatAxisTick}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelClassName="text-sm font-medium"
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey={props.yKey} 
              stroke={props.fillColor || DEFAULT_COLORS[0]}
              fill={props.fillColor || DEFAULT_COLORS[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (props.type === 'bar') {
    return (
      <div className={`w-full ${className}`}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={props.xKey} 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
              tickFormatter={formatAxisTick}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelClassName="text-sm font-medium"
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar 
              dataKey={props.yKey} 
              fill={props.barColor || DEFAULT_COLORS[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (props.type === 'pie') {
    const colors = props.colors || DEFAULT_COLORS;
    
    return (
      <div className={`w-full ${className}`}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height * 0.35, 120)}
              fill="#8884d8"
              dataKey={props.dataKey}
              nameKey={props.nameKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default Chart;