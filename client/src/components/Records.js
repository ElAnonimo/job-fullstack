import React, {
	Fragment,
	useState,
	useEffect,
	useCallback,
	useRef
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/themes/light.css'
import debounce from 'just-debounce-it';
import Header from './Header';
import Loader from './Loader';
import { getRecordsForPage } from '../actions/records';
import { apiCall } from '../utils/apiCall';

const Records = ({
	records: { records: { records, size }, loading },
	getRecordsForPage,
	// apiCall
}) => {
	const [sortInComponent, setSortInComponent] = useState({
		sortBy: 'price',
		sortOrder: 'asc'
	});
	const [inputValue, setInputValue] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [min, setMin] = useState('');
	const [minCleared, setMinCleared] = useState(false);
	const [max, setMax] = useState('');
	const [maxCleared, setMaxCleared] = useState(false);
	const [nameFilter, setNameFilter] = useState('');
	const [nameFilterCleared, setNameFilterCleared] = useState(false);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [resultsPerPage, setResultsPerPage] = useState(10);

	const debouncedPageNumberSet = useCallback(debounce((page) => setCurrentPage(page), 1000), []);

	const apiCall = () => getRecordsForPage(currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
	
	useEffect(() => {
		// console.log('Records. currentPage, nameFilter:', currentPage, nameFilter);
		/* getRecordsForPage(1, '', '', '', '', '', 10, {
			sortBy: 'price',
			sortOrder: 'asc'
		}); */
		// if (!nameFilterCleared) return;
		setNameFilterCleared(false);
		setMinCleared(false);
		setMaxCleared(false);

		apiCall();
		// apiCall(currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
	// }, [currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent, getRecordsForPage]);
	}, [nameFilterCleared, startDate, endDate, currentPage, minCleared, maxCleared, sortInComponent, resultsPerPage]);

	console.log('Records startDate:', startDate);

	const nameRef = useRef(null);
	const minRef = useRef(null);
	const maxRef = useRef(null);
	const fpStartDate = useRef(null);
	const fpEndDate = useRef(null);
	const updateRef = useRef(true);

	const clearNameFilter = useCallback(() => {
		if (nameRef.current) {
			nameRef.current.value = '';
		}
		if (nameFilter !== '') {
			setNameFilter('');
			setCurrentPage(1);
			setInputValue(1);
			setNameFilterCleared(true);
			// apiCall();
		}
		// updateRef.current = true;
	}, [nameRef, nameFilter]);

	const clearStartDate = useCallback(() => {
		console.log('clearStartDate ran.');

		if (fpStartDate.current) {
			fpStartDate.current.flatpickr.clear();
			fpStartDate.current.flatpickr.close();
		}
		if (startDate) {
			setStartDate('');
			setCurrentPage(1);
			setInputValue(1);
		}
	}, [fpStartDate, startDate]);

	const clearEndDate = useCallback(() => {
		if (fpEndDate.current) {
			fpEndDate.current.flatpickr.clear();
			fpEndDate.current.flatpickr.close();
		}
		if (endDate) {
			setEndDate('');
			setCurrentPage(1);
			setInputValue(1);
		}
	}, [fpEndDate, endDate]);

	const clearMin = useCallback(() => {
		if (minRef.current) {
			minRef.current.value = '';
		}
		if (min) {
			setMin('');
			setCurrentPage(1);
			setInputValue(1);
			setMinCleared(true);
		}
	}, [minRef, min]);

	const clearMax = useCallback(() => {
		if (maxRef.current) {
			maxRef.current.value = '';
		}
		if (max) {
			setMax('');
			setCurrentPage(1);
			setInputValue(1);
			setMaxCleared(true);
		}
	}, [maxRef, max]);

	const clearAll = () => {
		if (
			(sortInComponent.sortBy !== 'price' || sortInComponent.sortOrder !== 'asc') ||
			currentPage > 1 ||
			nameFilter !== '' ||
			startDate !== '' ||
			endDate !== '' ||
			min !== '' ||
			max !== ''
		) {
			console.log('Records clearAll() ran.');
			// setClearedAll(true);
			setCurrentPage(1);
			setInputValue(1);
			setStartDate('');
			setEndDate('');
			setNameFilter('');
			setMin('');
			setMax('');
			setSortInComponent({
				sortBy: 'price',
				sortOrder: 'asc'
			});
			if (nameRef.current) {
				nameRef.current.value = '';
			}
			if (fpStartDate.current) {
				fpStartDate.current.flatpickr.clear();
			}
			if (fpEndDate.current) {
				fpEndDate.current.flatpickr.clear();
			}
			if (minRef.current) {
				minRef.current.value = '';
			}
			if (maxRef.current) {
				maxRef.current.value = '';
			}
		}

		// apiCall(1, '', '', '', '', '', 10, { sortBy: 'price', sortOrder: 'asc' });
	};

	let renderPageNumbers;
	
	const pageNumbers = [];
	if (size) {
		if (!currentPage) {
			setCurrentPage(1);
			setInputValue(1);
		}
		
		for (let i = 1; i <= Math.ceil(size / resultsPerPage); i++) {
			pageNumbers.push(i);
		}
		
		renderPageNumbers = pageNumbers.map(number => {
			if (number === 1 || number === Math.ceil(size / resultsPerPage) || (number >= Number(currentPage) - 2 && number <= Number(currentPage) + 2)) {
				if (number !== Number(currentPage)) {
					return (
						<span className={number === Number(currentPage) ? 'pagination-item--active' : 'pagination-item'} key={number} onClick={() => {
							if (Math.ceil(size / resultsPerPage) > 1 && number !== Number(currentPage)) {
								setInputValue(number);
								setCurrentPage(number);
								// apiCall();
							}
						}}>
							{number}
						</span>	
					)
				} else {
					return (
						<input type='text'
							className='pagination-item__input'
							key={number}
							value={inputValue}
							onChange={(evt) => {
								if (evt.target.value === '' || (Number(evt.target.value) > 0 && Math.ceil(size / resultsPerPage) >= Number(evt.target.value))) {
									setInputValue(evt.target.value);
									// debouncedPageNumberSet(evt.target.value);
									// setCurrentPage(evt.target.value);
								}
							}}
							onKeyDown={(evt) => {
								if (evt.keyCode === 13) {
									if (Number(inputValue) !== 0 && Number(inputValue) !== currentPage) {
										setCurrentPage(inputValue);
									}
									// setInputValue(currentPage);
									// setInputValue(inputValue);
									// apiCall();
								}
							}}
						/>
					)
				}
			} else {
				return null;
			}	
		});
	}
	
	const stubRecords = [];
	for (let i = 0; i < resultsPerPage; i++) {
		stubRecords.push({
			_id: i,
			name: '002134e1-267c-418a-9e0f-4b5ee7fc111c',
			timestamp: 1567296480,
			price: 20000
		});
	};

	let tableContent = null;

	const renderTbodyContent = (recordsData) => recordsData && recordsData.length > 0 && recordsData.map(item => 
		<tr key={item._id}>
			<td>{item.name}</td>
			<td>{new Date(item.timestamp * 1000).toLocaleDateString('ru-Ru')}, {new Date(item.timestamp * 1000).toLocaleTimeString('ru-Ru')}</td>
			<td>{(item.price / 100).toLocaleString('ru-Ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
		</tr>
	);

	tableContent = (
		<Fragment>
			<div className={`table-container ${loading ? 'with-loader' : ''}`}>
				<table>
					<thead>
						<tr>
							<th className='table-th--big-width'>
								<label htmlFor='name' className={`table-th-label table-th-label--${sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'asc' ? 'asc' : sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'desc' ? 'desc' : ''}`} onClick={() => {
									setInputValue(1);
									setCurrentPage(1);
									if (sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'asc') {
										setSortInComponent({ sortBy: 'name', sortOrder: 'desc' });
										// apiCall();
									} else {
										setSortInComponent({ sortBy: 'name', sortOrder: 'asc' });
										// apiCall();
									}
								}}>Имя</label>
								<div className='th-input-container th-input-container--single'>
									<input
										ref={nameRef}
										type='text'
										name='name' 
										className='th-input-container__input'
										onChange={evt => {
											setInputValue(1);
											setCurrentPage(1);
											setNameFilter(evt.target.value);
										}}
										onKeyDown={evt => {
											if (evt.keyCode === 13) {
												apiCall();
											}
										}}
									/>
									<span
										className='th-input-container__icon'
										onMouseDown={(evt) => {
											// console.log('Records name onMouseDown evt:', evt);
											if (nameFilter !== '') {
												clearNameFilter();
												// setNameFilterCleared(true);
												// apiCall();
											}
										}}
									>
										&times;
									</span>
								</div>
							</th>
							<th className='table-th--medium-width'>
								<label htmlFor='' className={`table-th-label table-th-label--${sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'asc' ? 'asc' : sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'desc' ? 'desc' : ''}`} onClick={() => {
									setInputValue(1);
									setCurrentPage(1);
									if (sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'asc') {
										setSortInComponent({ sortBy: 'timestamp', sortOrder: 'desc' })
										// apiCall();
									} else {
										setSortInComponent({ sortBy: 'timestamp', sortOrder: 'asc' });
										// apiCall();
									}
								}}>Дата</label>
								<div className='th-input-container-group'>
									<div className='th-input-container'>
										<Flatpickr
											ref={fpStartDate}
											className='th-input-container__input'
											value={startDate}
											onClose={(selectedDates, dateStr, instance) => {
												console.log('selected:', selectedDates);

												if (selectedDates.length > 0) {
													setInputValue(1);
													// setCurrentPage(1);
													setStartDate(selectedDates[0]);
													// apiCall();
												}
											}}
											onValueUpdate={(selectedDates, dateStr, instance) => {
												
											}}
											options={{
												enableTime: true,
												enableSeconds: true,
												dateFormat: 'd.m.Y, H:i:S',
												locale: Russian,
												mode: 'single',
												time_24hr: true,
												minuteIncrement: 1,
												allowInput: true,
												disableMobile: true,
												monthSelectorType: 'dropdown',
												onOpen: function(selectedDates, dateStr, instance) {
													setTimeout(function() {
														instance.open();
													}, 200);
												}
											}}
											placeholder='от'
										/>
										<span
											className='th-input-container__icon'
											onMouseDown={() => {
												console.log('Records onMouseDown start date ran:', startDate.toString());
												if (startDate !== '') {
													clearStartDate();
													// apiCall();
												}
											}}
										>
											&times;
										</span>
									</div>
									<div className='th-input-container'>
										<Flatpickr
											ref={fpEndDate}
											className='th-input-container__input'
											value={endDate}
											onClose={(selectedDates, dateStr, instance) => {
												if (selectedDates.length > 0) {
													setInputValue(1);
													// setCurrentPage(1);
													setEndDate(selectedDates[0]);
													// apiCall();
												}
											}}
											options={{
												enableTime: true,
												enableSeconds: true,
												dateFormat: 'd.m.Y, H:i:S',
												locale: Russian,
												mode: 'single',
												time_24hr: true,
												minuteIncrement: 1,
												allowInput: true,
												disableMobile: true,
												onOpen: function(selectedDates, dateStr, instance) {
													setTimeout(function() {
														instance.open();
													}, 200);
												}
											}}
											placeholder='до'
										/>
										<span
											className='th-input-container__icon'
											onMouseDown={() => {
												// console.log('Records onMouseDown end date ran.');

												if (endDate !== '') {
													clearEndDate();
													// apiCall();
												}
											}}
										>
											&times;
										</span>
									</div>
								</div>
							</th>
							<th className='table-th'>
								<label htmlFor='' className={`table-th-label table-th-label--${sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'asc' ? 'asc' : sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'desc' ? 'desc' : ''}`} onClick={() => {
										setInputValue(1);
										setCurrentPage(1);
										if (sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'asc') {
											setSortInComponent({ sortBy: 'price', sortOrder: 'desc' });
											// apiCall();
										} else {
											setSortInComponent({ sortBy: 'price', sortOrder: 'asc' });
											// apiCall();
										}
									}}>Сумма</label>
								<div className='th-input-container-group'>	
									<div className='th-input-container'>
										<input
											ref={minRef}
											className='th-input-container__input th-input-container__input--short'
											type='text'
											name='min'
											placeholder='от'
											onChange={(evt) => {
												setInputValue(1);
												setCurrentPage(1);
												setMin(evt.target.value);
											}}
											onKeyDown={(evt) => {
												if (evt.keyCode === 13) {
													apiCall();
												}
											}}
										/>
										<span
											className='th-input-container__icon'
											onMouseDown={() => {
												if (min !== '') {
													clearMin();
													// apiCall();
												}
											}}
										>
											&times;
										</span>
									</div>
									<div className='th-input-container'>
										<input
											ref={maxRef}
											className='th-input-container__input th-input-container__input--short'
											type='text'
											name='max'
											placeholder='до'
											onChange={(evt) => {
												setInputValue(1);
												setCurrentPage(1);
												setMax(evt.target.value)
											}}
											onKeyDown={(evt) => {
												if (evt.keyCode === 13) {
													apiCall();
												}
											}}
										/>
										<span
											className='th-input-container__icon'
											onMouseDown={() => {
												if (max !== '') {
													clearMax();
													// apiCall();
												}
											}}
										>
											&times;
										</span>
									</div>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{/* {loading && <tr><td className='td--no-border'><Loader /></td></tr>} */}
						{loading ? renderTbodyContent(stubRecords) : renderTbodyContent(records)}
					</tbody>
				</table>
				{loading && <Loader />}
			</div>
			{records && records.length === 0 && <p className='no-records'>Записей нет</p>}
			<div className='table-pagination-container'>
				<div className='table-pagination-container__per-page-container'>
					{records && records.length > 0 &&
						<select
							className='table-pagination-container__per-page-select'
							name='resultsPerPage'
							onChange={(evt) => {
								setCurrentPage(1);
								setResultsPerPage(evt.target.value);
							}}
							value={resultsPerPage}
						>
							<option value='10'>10 строк</option>
							<option value='20'>20 строк</option>
							<option value='50'>50 строк</option>
						</select>
					}
				</div>
				<div className='table-pagination-container__clear'>
					<span className='table-pagination-container__clear-button' onClick={clearAll}>Сброс фильтров</span>
				</div>
				<div className='table-pagination-container__pagination'>
					{currentPage > 1 &&
						<span className='pagination-item' onClick={() => {
							setInputValue(1);
							setCurrentPage(1);
						}}>
							&laquo;
						</span>
					}
					{currentPage > 1 &&
						<span className='pagination-item' onClick={() => {
							setInputValue(currentPage - 1);
							setCurrentPage(currentPage - 1);
						}}>
							{'<'}
						</span>
					}
					{renderPageNumbers}
					{size > 0 && Math.ceil(size / resultsPerPage) > 1 && currentPage < Math.ceil(size / resultsPerPage) &&
						<span className='pagination-item' onClick={() => {
							setInputValue(Number(currentPage) + 1);
							setCurrentPage(Number(currentPage) + 1);
						}}>
							{'>'}
						</span>
					}
					{size > 0 && Math.ceil(size / resultsPerPage) > 1 && currentPage < Math.ceil(size / resultsPerPage) &&
						<span className='pagination-item' onClick={() => {
							setInputValue(Math.ceil(size / resultsPerPage));
							setCurrentPage(Math.ceil(size / resultsPerPage));
						}}>
							&raquo;
						</span>
					}
				</div>
			</div>
		</Fragment>
	);

	return (
		<Fragment>
			<h3 className='page-name'>Записи</h3>
			<Header
				text='В Статистику'
				goto='/stats'
			/>
			{tableContent}
		</Fragment>
	);
};

const mapStateToProps = state => ({
	records: state.records,
	sorting: state.sorting
});

Records.propTypes = {
	records: PropTypes.object.isRequired,
	sorting: PropTypes.object.isRequired,
	getRecordsForPage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getRecordsForPage, apiCall })(Records);
