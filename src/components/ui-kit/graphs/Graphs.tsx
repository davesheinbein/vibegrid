import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	PieChart,
	Pie,
	Cell,
	Legend,
	LineChart,
	Line,
	AreaChart,
	Area,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	ComposedChart,
} from 'recharts';

export type GraphShape =
	| 'bar'
	| 'horizontalBar'
	| 'pie'
	| 'line'
	| 'area'
	| 'radar'
	| 'composed';

interface GraphsProps {
	data: any[];
	shape?: GraphShape;
	dataKey?: string;
	labelKey?: string;
	title?: string;
	colors?: string[];
	style?: React.CSSProperties;
	height?: number;
}

const COLORS = [
	'#2563eb',
	'#38bdf8',
	'#a78bfa',
	'#fbbf24',
	'#ef4444',
	'#10b981',
	'#f472b6',
	'#6366f1',
	'#f59e42',
	'#0ea5e9',
	'#64748b',
	'#eab308',
	'#f43f5e',
	'#14b8a6',
	'#f87171',
	'#a3e635',
];

// DRY helper for axis
const renderAxes = (
	labelKey: string,
	isVertical = false
) => [
	isVertical ? (
		<XAxis
			type='number'
			fontSize={12}
			tickLine={false}
			axisLine={false}
			key='x'
		/>
	) : (
		<XAxis
			dataKey={labelKey}
			fontSize={12}
			tickLine={false}
			axisLine={false}
			key='x'
		/>
	),
	isVertical ? (
		<YAxis
			dataKey={labelKey}
			type='category'
			fontSize={12}
			tickLine={false}
			axisLine={false}
			key='y'
		/>
	) : (
		<YAxis
			fontSize={12}
			tickLine={false}
			axisLine={false}
			key='y'
		/>
	),
];

// DRY helper for grid, tooltip, legend
const renderCommon = (withLegend = false) => [
	<CartesianGrid strokeDasharray='3 3' key='grid' />,
	<Tooltip key='tooltip' />,
	withLegend ? <Legend key='legend' /> : null,
];

const Graphs: React.FC<GraphsProps> = ({
	data,
	shape = 'bar',
	dataKey = 'score',
	labelKey = 'match',
	title = '',
	colors = COLORS,
	style = {},
	height = 140,
}) => {
	const chartProps = {
		data,
		margin: { left: -18, right: 8 },
	};
	return (
		<div
			style={{
				width: '100%',
				height: height + 40,
				margin: '1.2em 0 0.5em 0',
				...style,
			}}
		>
			{title && (
				<h4
					style={{
						margin: '0 0 0.5em 0',
						fontSize: '1em',
						color: '#0ea5e9',
					}}
				>
					{title}
				</h4>
			)}
			<ResponsiveContainer width='100%' height={height}>
				{(() => {
					switch (shape) {
						case 'bar':
							return (
								<BarChart {...chartProps}>
									{renderAxes(labelKey)}
									{renderCommon()}
									<Bar
										dataKey={dataKey}
										fill={colors[0]}
										radius={[6, 6, 0, 0]}
									/>
								</BarChart>
							);
						case 'horizontalBar':
							return (
								<BarChart
									{...chartProps}
									layout='vertical'
									margin={{
										top: 8,
										right: 8,
										left: 8,
										bottom: 8,
									}}
								>
									{renderAxes(labelKey, true)}
									{renderCommon()}
									<Bar
										dataKey={dataKey}
										fill={colors[0]}
										radius={[0, 6, 6, 0]}
									/>
								</BarChart>
							);
						case 'pie':
							return (
								<PieChart>
									<Pie
										data={data}
										dataKey={dataKey}
										nameKey={labelKey}
										cx='50%'
										cy='50%'
										outerRadius={height / 2 - 10}
										fill={colors[0]}
										label
									>
										{data.map((entry, idx) => (
											<Cell
												key={`cell-${idx}`}
												fill={colors[idx % colors.length]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							);
						case 'line':
							return (
								<LineChart {...chartProps}>
									{renderAxes(labelKey)}
									{renderCommon()}
									<Line
										type='monotone'
										dataKey={dataKey}
										stroke={colors[0]}
										strokeWidth={2}
										dot={{ r: 3 }}
									/>
								</LineChart>
							);
						case 'area':
							return (
								<AreaChart {...chartProps}>
									{renderAxes(labelKey)}
									{renderCommon()}
									<Area
										type='monotone'
										dataKey={dataKey}
										stroke={colors[0]}
										fill={colors[1] || colors[0]}
										fillOpacity={0.5}
									/>
								</AreaChart>
							);
						case 'radar':
							return (
								<RadarChart
									cx='50%'
									cy='50%'
									outerRadius={height / 2 - 10}
									data={data}
								>
									<PolarGrid />
									<PolarAngleAxis dataKey={labelKey} />
									<PolarRadiusAxis />
									<Radar
										name={dataKey}
										dataKey={dataKey}
										stroke={colors[0]}
										fill={colors[1] || colors[0]}
										fillOpacity={0.6}
									/>
									<Legend />
									<Tooltip />
								</RadarChart>
							);
						case 'composed':
							return (
								<ComposedChart {...chartProps}>
									{renderAxes(labelKey)}
									{renderCommon(true)}
									<Bar
										dataKey={dataKey}
										fill={colors[0]}
										radius={[6, 6, 0, 0]}
									/>
									<Line
										type='monotone'
										dataKey={dataKey}
										stroke={colors[1] || colors[0]}
										strokeWidth={2}
									/>
								</ComposedChart>
							);
						default:
							return null;
					}
				})()}
			</ResponsiveContainer>
		</div>
	);
};

export default Graphs;
