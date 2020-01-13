import React, {
	Fragment,
	useState,
	useEffect,
	useCallback
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'just-debounce-it';
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
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactTooltip from 'react-tooltip';
import Header from './Header';
import Loader from './Loader';
import { getEntriesForTimestamp } from '../actions/timestamps';
import { getPrices } from '../actions/prices';

const Stats = ({
	prices: { prices, loading: pricesLoading },
	entries: { entries, loading: entriesLoading },
	getPrices,
	getEntriesForTimestamp,
	displayIndexFromGetEntriesForTimestamp
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
	const [inputValue, setInputValue] = useState(1);

	// const debouncedGetEntriesForTimestamp = useCallback(debounce((displayIndex) => getEntriesForTimestamp(displayIndex), 1000), []);

	console.log('Stats componentDisplayIndex:', componentDisplayIndex);
	console.log('Stats displayIndex:', displayIndex);
	

	useEffect(() => {
		getEntriesForTimestamp(displayIndex);
		getPrices();
	}, [getEntriesForTimestamp, getPrices, displayIndex]);
	
	const debouncedCurrentPageSet = useCallback(debounce(page => setCurrentPage(page), 1000), []);
	const debouncedInputValueSet = useCallback(debounce(number => setInputValue(number), 1000), []);
	const debouncedSetDisplayIndex = useCallback(debounce(displayIndex => {
		setDisplayIndex(displayIndex);
	}, 1000), []);
	const debouncedSetComponentDisplayIndex = useCallback(debounce(componentDisplayIndex => setComponentDisplayIndex(componentDisplayIndex), 1000), []);

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

	const barData2 = {
		labels: [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10
		],
		datasets: [{
			backgroundColor: '#1c7cd5',
			data: [
				10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010
			]
		}]
	};

	let renderPageNumbers;

	const pageNumbers = [];

	if (pricesLength > 0) {
		for (let i = 1; i <= Math.ceil(pricesLength / 50); i++) {
			pageNumbers.push(i);
		}

		if (!currentPage) {
			setCurrentPage(1);
			setInputValue(1);
		}

		renderPageNumbers = pageNumbers.map(number => {
			if (number === 1 || number === Math.ceil(pricesLength / 50) || (number >= Number(currentPage) - 2 && number <= Number(currentPage) + 2)) {
				if (number !== Number(currentPage)) {
					return (
						<span className={number === Number(currentPage) ? 'pagination-item--active' : 'pagination-item'} key={number} onClick={() => {
							if (number !== Number(currentPage)) {
								debouncedInputValueSet(number);
								debouncedCurrentPageSet(number);
								debouncedSetDisplayIndex({	
									startIndex: (number - 1) * 50,
									endIndex: (number - 1) * 50 + 50
								});
								debouncedSetComponentDisplayIndex({	
									componentStartIndex: 0,
									componentEndIndex: 10
								});
							}
						}}>
							{number}
						</span>
					);
				} else {
					return (
						<input type='text'
							className='pagination-item__input'
							key={number}
							value={inputValue}
							onChange={(evt) => {
								if (evt.target.value === '' || (Number(evt.target.value) > 0 && Math.ceil(pricesLength / 50) >= Number(evt.target.value))) {
									setInputValue(evt.target.value);
									debouncedCurrentPageSet(evt.target.value);
									debouncedSetDisplayIndex({	
										startIndex: evt.target.value ? (evt.target.value - 1) * 50 : 0,
										endIndex: evt.target.value ? (evt.target.value - 1) * 50 + 50 : 50
									});
									debouncedSetComponentDisplayIndex({	
										componentStartIndex: 0,
										componentEndIndex: 10
									});
								}
							}}						
						/>
					);
				}
			} else {
				return null;
			}	
		});
	}

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

	let componentContent;

	if (pricesLoading || entriesLoading) {
		componentContent = (
			<Loader />
		);
	} else {
		componentContent = (
			<Fragment>
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
															return ` сумма: ${value.toLocaleString('ru-Ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} p.`;
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
										<div className='chart-container-controls'>
											<div className='chart-container__slider'>
												<p className='chart-container__slider-p'>
													Данные на графике:
													{' '}
													<span className='chart-container__slider-first-number'>
														{displayIndex.startIndex + Number(componentDisplayIndex.componentStartIndex) + 1}
													</span> - {displayIndex.startIndex + Number(componentDisplayIndex.componentEndIndex)} из {pricesLength}
												</p>
												<div className='chart-container__tooltip-slider-wrapper'>
													<div className='chart-container__tooltip' data-tip data-for='slider-tooltip'>?</div>
													<ReactTooltip id='slider-tooltip' place='right' type='dark' effect='solid'>
														<span>Для изменения диапазона данных на графике передвиньте ползунки слайдера</span>
													</ReactTooltip>
													<div className='chart-container__sliders-container'>
														<Slider.Range
															min={0}
															max={50}
															defaultValue={[0, 10]}
															value={[componentDisplayIndex.componentStartIndex, componentDisplayIndex.componentEndIndex]}
															pushable={10}
															onChange={evt => {
																// console.log('Stats evt:', evt);

																if (displayIndex.startIndex + evt[1] <= pricesLength) {
																	setComponentDisplayIndex({
																		componentStartIndex: evt[0],
																		componentEndIndex: evt[1]
																	})
																}
															}}
														/>
													</div>
												</div>
											</div>
											<div className='chart-container__pagination-container'>
												<div className='chart-container__pagination'>
													{currentPage > 1 &&
														<span className='pagination-item' onClick={() => {
															setInputValue(1);
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
															&laquo;
														</span>
													}
													{currentPage > 1 &&
														<span className='pagination-item' onClick={() => {
																setInputValue(currentPage - 1);
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
																{'<'}
															</span>
													}
													{renderPageNumbers}
													{pricesLength && Math.ceil(pricesLength / 50) > 1 && currentPage < Math.ceil(pricesLength / 50) &&
														<span className='pagination-item' onClick={() => {
															setInputValue(currentPage + 1);
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
															{'>'}
														</span>
													}
													{pricesLength && Math.ceil(pricesLength / 50) > 1 && currentPage < Math.ceil(pricesLength / 50) &&
														<span className='pagination-item' onClick={() => {
															setInputValue(Math.ceil(pricesLength / 50));
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
															&raquo;
														</span>
													}
												</div>
											</div>
										</div>
										{/* <Bar
											data={barData2}
											options={{
												scales: {
													yAxes: [{
														ticks: {
															suggestedMin: 9999,
															// stepSize: 100
														},
														scaleLabel: {
															display: true,
															labelString: 'кол-во'
														}
													}]
												}
											}}
										/> */}
										<Bar
											data={barData}
											plugins={[{
												beforeLayout: function(chart, options) {
													console.log('Stats chart:', chart);

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

	return (
		<div className={`main-chart-container ${pricesLoading || entriesLoading ? 'with-loader' : ''}`}>
			<h3 className='page-name'>Статистика</h3>
			<Header
				text='В Записи'
				goto='/'
			/>
			{componentContent}
		</div>
	);
};

const mapStateToProps = state => {
	console.log('Stats mapStateToProps state:', state);

	return {
		prices: state.prices,
		entries: state.entries,
		displayIndexFromGetEntriesForTimestamp: state.entries.displayIndexFromGetEntriesForTimestamp
		// timestamps: state.timestamps
	}
};

const mapDispatchToProps = dispatch => ({
	getPrices: () => dispatch(getPrices()),
	getEntriesForTimestamp: (displayIndex) => dispatch(getEntriesForTimestamp(displayIndex))
});

Stats.propTypes = {
	prices: PropTypes.object.isRequired,
	entries: PropTypes.object.isRequired,
	getPrices: PropTypes.func.isRequired,
	getEntriesForTimestamp: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
