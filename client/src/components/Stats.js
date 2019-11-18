import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Pie, Bar } from 'react-chartjs-2';
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

const Stats = ({
	prices: { prices, loading: pricesLoading },
	entries: { entries, loading: entriesLoading },
	getPrices,
	getEntriesForTimestamp
}) => {
	const [activeTab, setActiveTab] = useState('1');

	useEffect(() => {
		getPrices();
		getEntriesForTimestamp();
	}, [getPrices, getEntriesForTimestamp]);

	const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

	const top10 =
		prices &&
		prices.entries &&
		prices.entries.length > 0 &&
		[...prices.entries].sort((a, b) => a.sum > b.sum ? -1 : 1).slice(0, 10);

	const pieData = {
		labels: top10 && top10.length > 0 && top10.map(item => ({
			date: new Date(item.timestamp * 1000).toLocaleDateString('ru-Ru'),
			time: new Date(item.timestamp * 1000).toLocaleTimeString('ru-Ru')
		})),
		datasets: [{
			data: top10 && top10.length > 0 && top10.map(item => item.sum / 100),
			backgroundColor: ['#2fc32f', '#b0dc0b', '#eab404', '#de672c', '#ec2e2e', '#d5429b', '#6f52b8', '#1c7cd5', '#56b9f7', '#0ae8eb']
		}]
	};
		
	const sortedEntries = entries && entries.entries && entries.entries.length > 0 &&
		[...entries.entries]
		.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
		
	const barData = {
		labels: sortedEntries && sortedEntries
			.map((item => ({
				date: new Date(item.timestamp * 1000).toLocaleDateString('ru-Ru'),
				time: new Date(item.timestamp * 1000).toLocaleTimeString('ru-Ru')
			}))),
		datasets: [{
			label: 'дата',
			backgroundColor: '#1c7cd5',
			data: sortedEntries && sortedEntries.map(item => item.count)
		}]	
	};

	const fontColor = bgColor => {
		const hexToRgb = hex => {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		};
		
		const rgb = hexToRgb(bgColor);
		const threshold = 140;
		const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
		return luminance > threshold ? '#000' : '#fff';
	}

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
									<div className='chart-container'>
										<Pie
											data={pieData}
											options={{
												legend: {
													display: false,
													labels: {
														generateLabels: function(chart) {
															// https://github.com/chartjs/Chart.js/issues/3515
															// https://github.com/chartjs/Chart.js/blob/master/src/controllers/controller.polarArea.js#L48
															
															const meta = chart.getDatasetMeta(0);

															if (chart.width < 768) {
																chart.options.legend.display = false;
															}
															
															return chart.data.labels.map((item, i) => ({
																text: `${item.date}, ${item.time}`,
																fillStyle: meta.controller.getStyle(i).backgroundColor,
																strokeStyle: meta.controller.getStyle(i).borderColor,
																lineWidth: meta.controller.getStyle(i).borderWidth
															}));
														} 
													}	
												},
												responsive: true,
												onResize: function(newChart, newSize) {								
													if (newSize.width < 768) {
														newChart.options.legend.display = false;
													} else {
														// change to `true` to display legend when back to desktop size screen
														newChart.options.legend.display = false;
													}
												},
												animation: false,
												tooltips: {
													callbacks: {
														label: function(tooltipItem, data) {
															let value = data.datasets[0].data[tooltipItem.index];
															return `сумма: ${value} p.`;
														},
														afterLabel: function(tooltipItem, data) {
															return `${data.labels[tooltipItem.index].date}\n${data.labels[tooltipItem.index].time}`;
														} 
													}
												}
											}}
										/>
									</div>
									<div className='pie-legend-container'>
										{pieData && pieData.labels && pieData.labels.length > 0 && pieData.labels.map((item, index) => {
											return (
												<span
													className='pie-legend-container__legend-item'
													key={index}
													style={{
														backgroundColor: `${pieData.datasets[0].backgroundColor[index]}`,
														color: fontColor(`${pieData.datasets[0].backgroundColor[index]}`)
													}}
												>
													{item.date}, {item.time}
												</span>
											)
										})}
									</div>
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId='2'>
							<Row>
								<Col>
									<div className='chart-container'>
										<Bar
											data={barData}
											options={{
												responsive: true,
												onResize: function(newChart, newSize) {
													// console.log('newChart from Stats:', newChart);												
													if (newSize.width < 768) {
														newChart.options.scales.xAxes[0].ticks.display = false;
													} else {
														newChart.options.scales.xAxes[0].ticks.display = true;
													}
												},
												legend: {
													display: true,
													position: 'bottom',
													labels: {
														generateLabels: function(chart) {
															if (chart.width < 768) {
																chart.options.scales.xAxes[0].ticks.display = false;
															}
														} 
													}	
												},
												animation: false,
												tooltips: {
													callbacks: {
														title: () => null,
														label: function(tooltipItem, data) {
															let value = data.datasets[0].data[tooltipItem.index];
															return `кол-во: ${value}`;
														},
														afterLabel: function(tooltipItem, data) {
															return `${data.labels[tooltipItem.index].date}\n${data.labels[tooltipItem.index].time}`;
														} 
													}
												},
												scales: {
													xAxes: [{
														display: true,
														ticks: {
															display: true,
															callback: function(value, index, values) {
																return `${value.date}, ${value.time}`;
															}
														}
													}]
												}
											}}
										/>
									</div>
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
	prices: state.prices,
	entries: state.entries
});

const mapDispatchToProps = dispatch => ({
	getPrices: () => dispatch(getPrices()),
	getEntriesForTimestamp: () => dispatch(getEntriesForTimestamp())
});

Stats.propTypes = {
	prices: PropTypes.object.isRequired,
	entries: PropTypes.object.isRequired,
	getPrices: PropTypes.func.isRequired,
	getEntriesForTimestamp: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
