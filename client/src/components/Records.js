import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/themes/light.css'
import debounce from 'just-debounce-it';
import Header from './Header';
import Loader from './Loader';
import { getRecords, getRecordsForPage } from '../actions/records';
import { sort } from '../actions/sort';

const Records = ({
	records: { records: { records, size }, loading },
	// records: { records: { sortByFromAction } },
	// records: { records: { sortOrderFromAction } },
	getRecords,
	getRecordsForPage,
	// sorting: { sortBy, sortOrder },
	sort
}) => {
	const [sortInComponent, setSortInComponent] = useState({
		sortBy: 'price',
		sortOrder: 'asc'
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [min, setMin] = useState('');
	const [max, setMax] = useState('');
	const [nameFilter, setNameFilter] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [resultsPerPage, setResultsPerPage] = useState(10);
	
	// console.log('Records component sortByFromAction:', sortByFromAction);
	console.log('Records component currentPage:', currentPage);
	console.log('Records sortInComponent:', sortInComponent);
	// console.log('Records sortOrderInComponent:', sortOrderInComponent);

	// const testFunc2 = useCallback(debounce((text) => setNameFilter(text), 1000), []);

	const debouncedApiCall = useCallback(debounce((currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent) => getRecordsForPage(currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent), 1000), []);
	
	useEffect(() => {
		// getRecords();		
		// getRecordsForPage(1, nameFilter, '', '', '', '', 10, {});
		debouncedApiCall(currentPage ,nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
	}, [currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent, debouncedApiCall]);
	// }, [nameFilter, getRecordsForPage]);
	// }, [startDate, endDate, resultsPerPage, sortInComponent, getRecordsForPage]);

	let renderPageNumbers;
	
	const pageNumbers = [];
	if (size) {
		console.log('Records size:', size);
		
		for (let i = 1; i <= Math.ceil(size / resultsPerPage); i++) {
			pageNumbers.push(i);
		}
		
		renderPageNumbers = pageNumbers.map(number => {
			// let classes = this.state.current_page === number ? styles.active : '';

			if (number === 1 || number === Math.ceil(size / resultsPerPage) || (number >= Number(currentPage) - 2 && number <= Number(currentPage) + 2)) {
				if (number !== Number(currentPage)) {
					return (
						<span className={number === Number(currentPage) ? 'pagination-item--active' : 'pagination-item'} key={number} onClick={() => {
							if (Math.ceil(size / resultsPerPage) > 1 && number !== Number(currentPage)) {
								setCurrentPage(number);
							}
						}}>
							{number}
						</span>	
					)
				} else {
					return (
						<input type='text'
							value={currentPage}
							onChange={(evt) => {
								console.log('Records pagination current page evt.target.value:', evt.target.value);

								if (Number(evt.target.value) > 0 && Math.ceil(size / resultsPerPage) >= Number(evt.target.value)) {
									setCurrentPage(evt.target.value);
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

	const sortedRecords = records && records.length > 0 && [...records].sort((a, b) => (
		sortInComponent.sortOrder === 'asc'
			? a[sortInComponent.sortBy] > b[sortInComponent.sortBy] ? 1 : -1
			: a[sortInComponent.sortBy] > b[sortInComponent.sortBy] ? -1 : 1
	));

	let tableContent = null;

	if (loading) {
		tableContent = <Loader />;
	} else {
		tableContent = (
			<Fragment>
				<div className='table-container'>
					<table>
						<thead>
							<tr>
								<th className='table-th--big-width'>
									<label htmlFor='name' className={`table-th-label table-th-label--${sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'asc' ? 'asc' : sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'desc' ? 'desc' : ''}`} onClick={() => {
										setCurrentPage(1);
										sortInComponent.sortOrder === 'asc'
											? setSortInComponent({ sortBy: 'name', sortOrder: 'desc' })
											: setSortInComponent({ sortBy: 'name', sortOrder: 'asc' });

										// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);	
									}}>Имя</label>
									<div className='th-input-container'>
										<input type='text' name='name' className='th-input-container__input' onChange={evt => {
												// console.log('evt.target.value:', evt.target.value);
												setCurrentPage(1);
												setNameFilter(evt.target.value);
												// if (evt.target.value) {
												// 	setNameFilter(evt.target.value);
												// }
											}}
											value={nameFilter}
											onKeyDown={(evt) => {
												if (evt.keyCode === 13) {
													setCurrentPage(1);
													getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
												} /* else if ((evt.keyCode === 8 || evt.keyCode === 46 )) {
													!nameFilter &&
													getRecordsForPage(1, '', min, max, startDate, endDate, resultsPerPage, sortInComponent)
												} */
											}}
										/>
									</div>
								</th>
								<th className='table-th--medium-width'>
									<label htmlFor='' className={`table-th-label table-th-label--${sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'asc' ? 'asc' : sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'desc' ? 'desc' : ''}`} onClick={() => {
										setCurrentPage(1);
										sortInComponent.sortOrder === 'asc'
											? setSortInComponent({ sortBy: 'timestamp', sortOrder: 'desc' })
											: setSortInComponent({ sortBy: 'timestamp', sortOrder: 'asc' });

										// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);	
									}}>Дата</label>
									<div className='th-input-container-group'>
										<div className='th-input-container'>
											{/* <span className='th-input-container__name-span'>от</span> */}
											<Flatpickr
												className='th-input-container__input'
												value={startDate}
												onClose={(selectedDates, dateStr, instance) => {
													setCurrentPage(1);
													setStartDate(selectedDates[0]);
													// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
												}}
												options={{
													enableTime: true,
													enableSeconds: true,
													dateFormat: 'd.m.Y, H:i:s',
													locale: Russian,
													mode: 'single',
													time_24hr: true,
													minuteIncrement: 1
												}}
												placeholder='от'
											/>
										</div>
										<div className='th-input-container'>
											{/* <span className='th-input-container__name-span'>до</span> */}
											<Flatpickr
												className='th-input-container__input'
												value={endDate}
												onClose={(selectedDates, dateStr, instance) => {
													console.log('Records endDate selectedDates:', selectedDates);
													setCurrentPage(1);
													setEndDate(selectedDates[0]);
													// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
												}}
												options={{
													enableTime: true,
													enableSeconds: true,
													dateFormat: 'd.m.Y, H:i:s',
													locale: Russian,
													mode: 'single',
													time_24hr: true,
													minuteIncrement: 1
												}}
												placeholder='до'
											/>
										</div>
									</div>
								</th>
								<th className='table-th'>
									<label htmlFor='' className={`table-th-label table-th-label--${sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'asc' ? 'asc' : sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'desc' ? 'desc' : ''}`} onClick={() => {
											setCurrentPage(1);
											sortInComponent.sortOrder === 'asc'
												? setSortInComponent({ sortBy: 'price', sortOrder: 'desc' })
												: setSortInComponent({ sortBy: 'price', sortOrder: 'asc' });

											// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);	
										}}>Сумма</label>
									<div className='th-input-container-group'>	
										<div className='th-input-container'>
											{/* <span className='th-input-container__name-span'>от</span> */}
											<input
												className='th-input-container__input'
												type='text'
												name='min'
												placeholder='от'
												onChange={(evt) => {
													setCurrentPage(1);
													setMin(evt.target.value);
												}}
												onKeyDown={(evt) => {
													if (evt.keyCode === 13) {
														setCurrentPage(1);
														getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
													}
												}}
												value={min}
											/>
										</div>
										<div className='th-input-container'>
											{/* <span className='th-input-container__name-span'>до</span> */}
											<input
												className='th-input-container__input'
												type='text'
												name='max'
												placeholder='до'
												onChange={(evt) => {
													setCurrentPage(1);
													setMax(evt.target.value)
												}}
												onKeyDown={(evt) => {
													if (evt.keyCode === 13) {
														setCurrentPage(1);
														getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
													}
												}}
												value={max}
											/>
										</div>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{records && records.length > 0 && records.map(item => 
								<tr key={item._id}>
									<td>{item.name}</td>
									<td>{new Date(item.timestamp * 1000).toLocaleDateString('ru-Ru')}, {new Date(item.timestamp * 1000).toLocaleTimeString('ru-Ru')}</td>
									<td>{(item.price / 100).toLocaleString('ru-Ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
								</tr>
							)}
						</tbody>
					</table>
					{records && records.length === 0 && <p className='no-records'>Записей нет</p>}
				</div>
				<div className='table-pagination-container'>
					<div className='table-pagination-container__per-page-container'>
						{records && records.length > 0 &&
							<select
								className='table-pagination-container__per-page-select'
								name='resultsPerPage'
								onChange={(evt) => {
									setCurrentPage(1);
									setResultsPerPage(evt.target.value);
									// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, evt.target.value, sortInComponent);
								}}
								value={resultsPerPage}
							>
								<option value='10'>10 строк</option>
								<option value='20'>20 строк</option>
								<option value='50'>50 строк</option>
							</select>
						}
					</div>
					<div className='table-pagination-container__pagination'>
						{currentPage > 1 && <span onClick={() => {
							setCurrentPage(1);
							// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
						}}>
							<span className='pagination-item'>&laquo;</span>
						</span>}
						{currentPage > 1 && <span onClick={() => {
							setCurrentPage(currentPage - 1);
							// getRecordsForPage(currentPage - 1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent)}
						}}>
							<span className='pagination-item'>{'<'}</span>
						</span>}
						{renderPageNumbers}
						{size > 0 && Math.ceil(size / resultsPerPage) > 1 && currentPage < Math.ceil(size / resultsPerPage) && <span onClick={() => {
							setCurrentPage(Number(currentPage) + 1);
							// getRecordsForPage(Number(currentPage) + 1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
						}}>
							<span className='pagination-item'>{'>'}</span>
						</span>}
						{size > 0 && Math.ceil(size / resultsPerPage) > 1 && currentPage < Math.ceil(size / resultsPerPage) && <span onClick={() => {
							setCurrentPage(Math.ceil(size / resultsPerPage));
							// getRecordsForPage(Math.ceil(size / resultsPerPage), nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
						}}>
							<span className='pagination-item'>&raquo;</span>
						</span>}
					</div>
					<div className='table-pagination-container__goto'>
						{Math.ceil(size / resultsPerPage) > 1 &&
							<input
								className='table-pagination-container__goto-input'
								type='text'
								placeholder={`на стр... (всего ${Math.ceil(size / resultsPerPage)})`}
								value={currentPage}
								onChange={(evt) => {
									// console.log('Records на стр... evt.target.value:', evt.target.value);

									if (Number(evt.target.value) > 0 && Math.ceil(size / resultsPerPage) >= evt.target.value) {
										setCurrentPage(evt.target.value);
									}

									// getRecordsForPage(evt.target.value, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
								}}
								onKeyDown={(evt) => {
									// console.log('Records на стр... onKeyDown evt.target.value:', evt.target.value);
									if (evt.keyCode === 13) {
										getRecordsForPage(currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
									}
								}}
							/>
						}
					</div>
					<input type='button' className='table-submit'
						onClick={() => getRecordsForPage(currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent)}
						value='отправить'
					/>
				</div>
			</Fragment>
		);
	}

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
	getRecords: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getRecords, getRecordsForPage, sort })(Records);
