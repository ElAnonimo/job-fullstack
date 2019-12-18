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
import { getTimestamps, getEntriesForTimestamp } from '../actions/timestamps';
import { getPrices } from '../actions/prices';

const Stats = ({
	prices: { prices, loading: pricesLoading },
	entries: { entries, loading: entriesLoading },
	getPrices,
	getEntriesForTimestamp,
	getTimestamps,
	timestamps: { timestamps }
}) => {
	const [activeTab, setActiveTab] = useState('1');
	const [displayIndex, setDisplayIndex] = useState({
		startIndex: 0,
		endIndex: 50
	});
	const [componentDisplayIndex, setComponentDisplayIndex] = useState({
		componentStartIndex: 0,
		componentEndIndex: 10
	});
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		getPrices();
		getEntriesForTimestamp(displayIndex);
		getTimestamps();
	}, [getPrices, getEntriesForTimestamp, getTimestamps, displayIndex]);
	
	// console.log('Stats displayIndex startIndex, endIndex, Stats timestamps.length:', displayIndex.startIndex, displayIndex.endIndex, timestamps && timestamps.length);

	const toggle = tab => {
    if (activeTab !== tab) {
			setActiveTab(tab);
		}
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

	const pricesLength = prices && prices.entries && prices.entries.length;	
		
	const sortedEntries = entries && entries.entries && entries.entries.length > 0 &&
		[...entries.entries]
		.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
		.slice(componentDisplayIndex.componentStartIndex, componentDisplayIndex.componentEndIndex);
		
	const barData = {
		labels: sortedEntries && sortedEntries.map(item => ({
			date: new Date(item.timestamp * 1000).toLocaleDateString('ru-Ru'),
			time: new Date(item.timestamp * 1000).toLocaleTimeString('ru-Ru')
		})),
		datasets: [{
			label: 'дата',
			backgroundColor: '#1c7cd5',
			data: sortedEntries && sortedEntries.map(item => item.count)
		}]	
	};

	let renderPageNumbers;

	const pageNumbers = [];
	if (pricesLength > 0) {
		for (let i = 1; i <= Math.ceil(pricesLength / 50); i++) {
			pageNumbers.push(i);
		}

		renderPageNumbers = pageNumbers.map(number => {
			if (number === 1 || number === Math.ceil(pricesLength / 50) || (number >= Number(currentPage) - 2 && number <= Number(currentPage) + 2)) {
				return (
					<span className={number === Number(currentPage) ? 'pagination-item--active' : 'pagination-item'} key={number} onClick={() => {
						console.log('Stats renderPageNumbers number onClick fired.');
						if (number !== currentPage) {
							setCurrentPage(number);
							
							setDisplayIndex({
								startIndex: (number - 1) * 50,
								endIndex: (number - 1) * 50 + 50
							});
							setComponentDisplayIndex({
								componentStartIndex: 0,
								componentEndIndex: 10
							});
						}
					}}>
						{number}
					</span>
				);
			} else {
				return null;
			}	
		});
	}

	console.log('Stats sortedEntries:', sortedEntries);

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
															return `сумма: ${value.toLocaleString('ru-Ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} p.`;
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
										{/* <p>{timestamps && timestamps.length > 0 && timestamps.map(item => <span key={item}>{item}, </span>)}</p> */}
										<div className='chart-container-controls'>
											<div className='chart-container__slider'>
												<p className='chart-container__slider-p'>Данные на графике: {displayIndex.startIndex + Number(componentDisplayIndex.componentStartIndex) + 1} - {displayIndex.startIndex + Number(componentDisplayIndex.componentEndIndex)} из {pricesLength}</p>
												<input
													className='chart-container__slider-input'
													type='range'
													value={displayIndex.startIndex + Number(componentDisplayIndex.componentEndIndex) <= pricesLength && componentDisplayIndex.componentEndIndex}
													min='10'
													max='50'
													step='1'
													// onChange={(evt) => console.log('Records input type="range" evt.target.value:', evt.target.value)}
													onChange={(evt) => {
														if (displayIndex.startIndex + Number(evt.target.value) <= pricesLength) {
															setComponentDisplayIndex({
																componentStartIndex: 0,
																componentEndIndex: evt.target.value
															});
														}
													}}
												/>
											</div>
											<div className='chart-container__pagination-container'>
												<div className='chart-container__pagination'>
													{currentPage > 1 && <span onClick={() => {
														setCurrentPage(1);

														setDisplayIndex({
															startIndex: 0,
															endIndex: 50
														});
														setComponentDisplayIndex({
															componentStartIndex: 0,
															componentEndIndex: 10
														});
													}}>
														<span className='pagination-item'>&laquo;</span>
													</span>
													}
													{currentPage > 1 && <span onClick={() => {
															setCurrentPage(currentPage - 1);

															setDisplayIndex({
																startIndex: (currentPage - 2) * 50,		// currentPage is initially set to 1
																endIndex: (currentPage - 2) * 50 + 50
															});
															setComponentDisplayIndex({
																componentStartIndex: 0,
																componentEndIndex: 10
															});
														}}>
															<span className='pagination-item'>{'<'}</span>
														</span>
													}
													{renderPageNumbers}
													{pricesLength && Math.ceil(pricesLength / 50) > 1 && currentPage < Math.ceil(pricesLength / 50) &&
														<span onClick={() => {
															setCurrentPage(currentPage + 1);

															setDisplayIndex({
																startIndex: (currentPage) * 50,		// currentPage is initially set to 1
																endIndex: (currentPage) * 50 + 50
															});
															setComponentDisplayIndex({
																componentStartIndex: 0,
																componentEndIndex: 10
															});
														}}>
															<span className='pagination-item'>{'>'}</span>
														</span>
													}
													{pricesLength && Math.ceil(pricesLength / 50) > 1 && currentPage < Math.ceil(pricesLength / 50) &&
														<span onClick={() => {
															setCurrentPage(Math.ceil(pricesLength / 50));

															setDisplayIndex({
																startIndex: (Math.ceil(pricesLength / 50) - 1) * 50,		// currentPage is initially set to 1
																endIndex: pricesLength
															});
															setComponentDisplayIndex({
																componentStartIndex: 0,
																componentEndIndex: 10
															});
														}}>
															<span className='pagination-item'>&raquo;</span>
														</span>
													}
												</div>
												<div className='chart-container__goto'>
													{Math.ceil(pricesLength / 50) > 1 &&
														<input
															className='chart-container__goto-input'
															type='text'
															placeholder={`на стр... (всего ${Math.ceil(pricesLength / 50)})`}
															onChange={(evt) => {
																if (Number(evt.target.value) > 0 && Math.ceil(pricesLength / 50) >= evt.target.value) {
																	setCurrentPage(evt.target.value);
																}
															}}
															onKeyDown={(evt) => {
																if (evt.keyCode === 13) {
																	setDisplayIndex({
																		startIndex: (evt.target.value - 1) * 50,
																		endIndex: (evt.target.value - 1) * 50 + 50
																	});
																	setComponentDisplayIndex({
																		componentStartIndex: 0,
																		componentEndIndex: 10
																	});
																}
															}}
														/>
													}
												</div>
												{/* <span className='chart-container__goto-item' onClick={() => {
													if (timestamps && displayIndex.startIndex > 50) {
														setDisplayIndex({
															startIndex: displayIndex.startIndex - 50,
															endIndex: displayIndex.endIndex - 50
														});
														setComponentDisplayIndex({
															componentStartIndex: 0,
															componentEndIndex: 10
														});
														// getEntriesForTimestamp(displayIndex - 10);
													}
												}}>пред. 50</span>
												<span className='chart-container__goto-item' onClick={() => {
													setDisplayIndex({
														startIndex: 0,
														endIndex: 50
													});
													setComponentDisplayIndex({
														componentStartIndex: 0,
														componentEndIndex: 10
													});
													// getEntriesForTimestamp(10);
												}}
												>
													первые 50
												</span>
												<span className='chart-container__goto-item' onClick={() => {
													if (timestamps && displayIndex.endIndex < timestamps.length) {
														setDisplayIndex({
															startIndex: displayIndex.startIndex + 50,
															endIndex: displayIndex.endIndex + 50
														});
														setComponentDisplayIndex({
															componentStartIndex: 0,
															componentEndIndex: 10
														});
														// getEntriesForTimestamp(displayIndex + 10);
													}
												}}>след. 50</span> */}
											</div>
										</div>
										<Bar
											data={barData}
											plugins={[{
												beforeLayout: function(chart, options) {
													if (chart.width < 768) {
														chart.options.scales.xAxes[0].ticks.display = false;
														chart.options.scales.xAxes[0].ticks.callback = function(item, index) {
															return '';
														};
													} else {
														chart.options.scales.xAxes[0].ticks.display = true;
														chart.options.scales.xAxes[0].ticks.callback = function(item, index) {
															return `${item.date}, ${item.time}`;
														}	
													}
												}
											}]}
											options={{
												responsive: true,
												onResize: function(newChart, newSize) {
													if (newSize.width < 768) {
														newChart.options.scales.xAxes[0].ticks.display = false;
													} else {
														newChart.options.scales.xAxes[0].ticks.display = true;
														newChart.options.scales.xAxes[0].ticks.callback = function(item, index) {
															return `${item.date}, ${item.time}`;
														};
													}
												},
												legend: {
													display: true,
													position: 'bottom'
												},
												animation: false,
												tooltips: {
													callbacks: {
														title: () => '',
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
													/* xAxes: [{
														display: true,
														ticks: {
															// display: true,
															/* userCallback: function(item, index) {
																// console.log('Stats item:', item);
																return `${item.date}, ${item.time}`;
															}, */
															/* callback: function(value, index, values) {
																return `${value.date}, ${value.time}`;
															}, */
															// skip some labels when many ticks on the X scale; default
															// https://www.chartjs.org/docs/latest/axes/cartesian/#tick-configuration
															// autoSkip: true,
															// maxRotation: 90
														// }
													// }],
													yAxes: [{
														ticks: {
															beginAtZero: true,
															stepSize: 1
														},
														scaleLabel: {
															display: true,
															labelString: 'кол-во'
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
	entries: state.entries,
	timestamps: state.timestamps
});

const mapDispatchToProps = dispatch => ({
	getPrices: () => dispatch(getPrices()),
	getEntriesForTimestamp: (displayIndex) => dispatch(getEntriesForTimestamp(displayIndex)),
	getTimestamps: () => dispatch(getTimestamps())
});

Stats.propTypes = {
	prices: PropTypes.object.isRequired,
	entries: PropTypes.object.isRequired,
	getPrices: PropTypes.func.isRequired,
	getEntriesForTimestamp: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
