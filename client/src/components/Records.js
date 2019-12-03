import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import 'flatpickr/dist/themes/light.css'
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
	console.log('Records component records:', records);
	console.log('Records sortInComponent:', sortInComponent);
	// console.log('Records sortOrderInComponent:', sortOrderInComponent);
	
	useEffect(() => {
		// getRecords();		
		getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
	}, []);
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
				return (
					<span className={number === Number(currentPage) ? 'pagination-item--active' : 'pagination-item'} key={number} onClick={() => {
						if (Math.ceil(size / resultsPerPage) > 1) {
							setCurrentPage(number);
							getRecordsForPage(number, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
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

	const sortedRecords = records && records.length > 0 && [...records].sort((a, b) => (
		sortInComponent.sortOrder === 'asc'
			? a[sortInComponent.sortBy] > b[sortInComponent.sortBy] ? 1 : -1
			: a[sortInComponent.sortBy] > b[sortInComponent.sortBy] ? -1 : 1
	));

	const areSortedRecordsNotEmpty = sortedRecords && sortedRecords.length > 0;

	console.log('Records sortedRecords:', sortedRecords);

	if (loading) {
		return <Loader />;
	} else {
		return (
			<Fragment>
				<h3 className='page-name'>Записи</h3>
				<Header
					text='В Статистику'
					goto='/stats'
				/>
				<div className='table-container'>
					<table>
						<thead>
							<tr>
								<th className='table-th--big-width'>
									<label htmlFor='name' onClick={() => {
										setCurrentPage(1);
										sortInComponent.sortOrder === 'asc'
											? setSortInComponent({ sortBy: 'name', sortOrder: 'desc' })
											: setSortInComponent({ sortBy: 'name', sortOrder: 'asc' });

										// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);	
									}}>Имя {sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'asc' ? <span>{'▲'}</span> : sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'desc' ? <span>{'▼'}</span> : ''}</label>

									<input type='text' name='name' onChange={(evt) => {
											setNameFilter(evt.target.value);
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
								</th>
								<th className='table-th--medium-width'>
									<label htmlFor='' onClick={() => {
										setCurrentPage(1);
										sortInComponent.sortOrder === 'asc'
											? setSortInComponent({ sortBy: 'timestamp', sortOrder: 'desc' })
											: setSortInComponent({ sortBy: 'timestamp', sortOrder: 'asc' });

										// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);	
									}}>Дата {sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'asc' ? <span>{'▲'}</span> : sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'desc' ? <span>{'▼'}</span> : ''}</label>
									<div className='th-input-container'>
										<span className='th-input-container__name-span'>от</span>
										<Flatpickr
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
										/>
									</div>
									<div className='th-input-container'>
										<span className='th-input-container__name-span'>до</span>
										<Flatpickr
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
										/>
									</div>
								</th>
								<th className='table-th'>
									<div className='th-input-container'>
										<label htmlFor='' onClick={() => {
											setCurrentPage(1);
											sortInComponent.sortOrder === 'asc'
												? setSortInComponent({ sortBy: 'price', sortOrder: 'desc' })
												: setSortInComponent({ sortBy: 'price', sortOrder: 'asc' });

											// getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);	
										}}>Сумма {sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'asc' ? <span>{'▲'}</span> : sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'desc' ? <span>{'▼'}</span> : ''}</label>
										<span className='th-input-container__name-span'>от</span>
										<input
											type='text'
											name='min'
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
										<span className='th-input-container__name-span'>до</span>
										<input
											type='text'
											name='max'
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
						{currentPage >= 2 && <span onClick={() => {
							setCurrentPage(1);
							getRecordsForPage(1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
						}}>
							<span className='pagination-item'>&laquo;</span>
						</span>}
						{currentPage >= 2 && <span onClick={() => {
							setCurrentPage(currentPage - 1);
							getRecordsForPage(currentPage - 1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent)}
						}>
							<span className='pagination-item'>{'<'}</span>
						</span>}
						{renderPageNumbers}
						{Math.ceil(size / resultsPerPage) > 1 && currentPage < Math.ceil(size / resultsPerPage) && <span onClick={() => {
							setCurrentPage(Number(currentPage) + 1);
							getRecordsForPage(Number(currentPage) + 1, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
						}}>
							<span className='pagination-item'>{'>'}</span>
						</span>}
						{Math.ceil(size / resultsPerPage) > 1 && currentPage < Math.ceil(size / resultsPerPage) && <span onClick={() => {
							setCurrentPage(size && Math.ceil(size / resultsPerPage));
							getRecordsForPage(size && Math.ceil(size / resultsPerPage), nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
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
