import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell
} from 'recharts';
import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Row,
	Col
} from 'reactstrap';
import Header from './Header';
import Loader from './Loader';
import { getEntriesForTimestamp } from '../actions/timestamps';
import { getPrices } from '../actions/prices';
import { logout } from '../actions/auth';

const Stats = ({
	prices: { prices, loading: pricesLoading },
	entries: { entries, loading: entriesLoading },
	getPrices,
	getEntriesForTimestamp,
	logout
}) => {
	console.log('Stats prices:', prices);
	console.log('Stats entries:', entries);
	console.log('Stats pricesLoading:', pricesLoading);
	console.log('Stats entriesLoading:', entriesLoading);

	const [activeTab, setActiveTab] = useState('1');

	useEffect(() => {
		getPrices();
		getEntriesForTimestamp();
	}, [getPrices, getEntriesForTimestamp]);

	const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

	const onLogoutClick = () => {
		logout();
	};

	const top10 = prices && prices.entries && prices.entries.length > 0 && [...prices.entries].sort((a, b) => a.sum > b.sum ? -1 : 1).slice(0, 10);
	console.log('top10:', top10);
	
	const radialChartData = [];
	top10 && top10.length > 0 && top10.map(item => radialChartData.push({
		angle: item.timestamp,
		radius: item.sum,
		label: new Date(item.timestamp).toLocaleTimeString('ru-Ru'),
		subLabel: `sum: ${item.sum}`
	}));
	console.log('radialChartData:', radialChartData);

	const pieChartData = [];
	top10 && top10.length > 0 && top10.map(item => pieChartData.push({
		name: `${new Date(item.timestamp).toLocaleDateString('ru-Ru')}, ${new Date(item.timestamp).toLocaleTimeString('ru-Ru')}`,
		value: item.sum
	}));

	const COLORS = ['#2fc32f', '#b0dc0b', '#eab404', '#de672c', '#ec2e2e', '#d5429b', '#6f52b8', '#1c7cd5', '#56b9f7', '#0ae8eb'];
	const RADIAN = Math.PI / 180;

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
		console.log('renderCustomizedLabel fired.');
		const radius = outerRadius * 1.15;
  	const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);
		const radiusInner = innerRadius + (outerRadius - innerRadius) * 0.7;
		const xInner = cx + radiusInner * Math.cos(-midAngle * RADIAN);
		const yInner = cy + radiusInner * Math.sin(-midAngle * RADIAN);

		const setTextAnchorPlacement = x => {
			if (x > cx && x < 1.3 * cx) {
				return 'middle';
			} else if (x > 1.3 * cx) {
				return 'start';
			} else if (x > -1.3 * cx && x < cx) {
				return 'middle';
			} else {
				return 'end';
			}
		};

		const setToMiddle = (x, y) => {
			if (x > cx && x < 1.1 * cx && y > cy) {
				return true;
			} else {
				return false;
			}
		};

		const setFillColor = index => {
			if (
				COLORS[index % COLORS.length] === '#6f52b8' ||
				COLORS[index % COLORS.length] === '#1c7cd5'
			) {
				return '#fff';
			} else {
				return '#000';
			}
		};

		return (
			<Fragment>
				<text fill='#000' x={x} y={setToMiddle(x, y) ? y + 5 : y} textAnchor={setToMiddle(x, y) ? 'middle' : x > cx ? 'start' : 'end'}	dominantBaseline='central'>
					дата: {`${name}`}
				</text>
				<text fill='#000' x={x} y={setToMiddle(x, y) ? y + 20 : y + 15} textAnchor={setToMiddle(x, y) ? 'middle' : x > cx ? 'start' : 'end'} dominantBaseline='central'>
					сумма: {`${(value / 100).toLocaleString('ru-Ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} руб.`}
				</text>
				<text fill={setFillColor(index)} x={xInner} y={yInner} textAnchor={setTextAnchorPlacement(x)} dominantBaseline='central'>
					{`${(percent * 100).toLocaleString('ru-Ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
				</text>
			</Fragment>
		);
	};
	
	const barSeriesData = [];
	entries && entries.entries && entries.entries.length > 0 && entries.entries.map(item => barSeriesData.push({
		x: new Date(item.timestamp).toLocaleTimeString('ru-Ru'),
		y: item.count
	}));
	console.log('barSeriesData:', barSeriesData);

	const CustomTooltip = ({ label, payload }) => {
		// console.log('label:', label);
		// console.log('payload:', payload);

		return (
			<Fragment>
				<p className='tooltip-text'>время: {label}</p>
				<p className='tooltip-text'>кол-во: {payload && payload.length > 0 && payload[0].value}</p>
			</Fragment>
		);
	};

	if (pricesLoading || entriesLoading) {
		return <Loader />;
	} else {
		return (
			<Fragment>
				<h3 className='page-name'>Статистика</h3>
				<Header
					text='В Записи'
					goto='/'
				/>
				<div>
					<Nav tabs>
						<NavItem className='stats-nav-item'>
							<NavLink
								className={activeTab === '1' ? 'active' : ''}
								onClick={() => {toggle('1')}}
							>
								Топ 10 по выручке
							</NavLink>
						</NavItem>
						<NavItem className='stats-nav-item'>
							<NavLink
								className={activeTab === '2' ? 'active' : ''}
								onClick={() => {toggle('2')}}
							>
								Количество идентификаторов
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent activeTab={activeTab}>
						<TabPane tabId='1'>
							<Row>
								<Col>
									<PieChart width={1000} height={600}>
										<Pie
											data={pieChartData}
											dataKey='value'
											nameKey='name'
											cx='50%'
											cy='50%'
											fill='#8884d8'
											label={renderCustomizedLabel}
											isAnimationActive={false}
										>
											{pieChartData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
										</Pie>
									</PieChart>
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId='2'>
							<Row>
								<Col>
									<BarChart
										width={1000}
										height={300}
										data={barSeriesData}
										margin={{top: 20, right: 30, left: 20, bottom: 5}}
									>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='x' />
										<YAxis label={{ value: 'кол-во', angle: -90, position: 'insideLeft' }} />
										<Tooltip content={<CustomTooltip />} />
										<Legend />
										<Bar
											dataKey='y'
											fill='#8884d8'
											isAnimationActive={false}
											name='время'
										/>
									</BarChart>
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</Fragment>
		);
	};
};

const mapStateToProps = state => ({
	records: state.records,
	prices: state.prices,
	entries: state.entries
});

const mapDispatchToProps = dispatch => ({
	getPrices: () => dispatch(getPrices()),
	getEntriesForTimestamp: () => dispatch(getEntriesForTimestamp()),
	logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
