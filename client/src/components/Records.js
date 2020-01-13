import React, {
	Fragment,
	useState,
	useEffect,
	useCallback
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

const Records = ({
	records: { records: { records, size }, loading },
	getRecordsForPage
}) => {
	const [sortInComponent, setSortInComponent] = useState({
		sortBy: 'price',
		sortOrder: 'asc'
	});
	const [inputValue, setInputValue] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [min, setMin] = useState('');
	const [max, setMax] = useState('');
	const [nameFilter, setNameFilter] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [resultsPerPage, setResultsPerPage] = useState(10);

	const debouncedPageNumberSet = useCallback(debounce((page) => setCurrentPage(page), 1000), []);
	
	useEffect(() => {
		console.log('Records. useEffect has ran.');
		getRecordsForPage(currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
	}, [currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent, getRecordsForPage]);

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
									debouncedPageNumberSet(evt.target.value);
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
									sortInComponent.sortBy === 'name' && sortInComponent.sortOrder === 'asc'
										? setSortInComponent({ sortBy: 'name', sortOrder: 'desc' })
										: setSortInComponent({ sortBy: 'name', sortOrder: 'asc' });
								}}>Имя</label>
								<div className='th-input-container'>
									<input type='text' name='name' className='th-input-container__input' onBlur={evt => {
											setInputValue(1);
											setCurrentPage(1);
											setNameFilter(evt.target.value);
										}}
									/>
								</div>
							</th>
							<th className='table-th--medium-width'>
								<label htmlFor='' className={`table-th-label table-th-label--${sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'asc' ? 'asc' : sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'desc' ? 'desc' : ''}`} onClick={() => {
									setInputValue(1);
									setCurrentPage(1);
									sortInComponent.sortBy === 'timestamp' && sortInComponent.sortOrder === 'asc'
										? setSortInComponent({ sortBy: 'timestamp', sortOrder: 'desc' })
										: setSortInComponent({ sortBy: 'timestamp', sortOrder: 'asc' });
								}}>Дата</label>
								<div className='th-input-container-group'>
									<div className='th-input-container'>
										<Flatpickr
											className='th-input-container__input'
											value={startDate}
											onClose={(selectedDates, dateStr, instance) => {
												setInputValue(1);
												setCurrentPage(1);
												setStartDate(selectedDates[0]);
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
										<Flatpickr
											className='th-input-container__input'
											value={endDate}
											onClose={(selectedDates, dateStr, instance) => {
												setInputValue(1);
												setCurrentPage(1);
												setEndDate(selectedDates[0]);
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
										setInputValue(1);
										setCurrentPage(1);
										sortInComponent.sortBy === 'price' && sortInComponent.sortOrder === 'asc'
											? setSortInComponent({ sortBy: 'price', sortOrder: 'desc' })
											: setSortInComponent({ sortBy: 'price', sortOrder: 'asc' });
									}}>Сумма</label>
								<div className='th-input-container-group'>	
									<div className='th-input-container'>
										<input
											className='th-input-container__input'
											type='text'
											name='min'
											placeholder='от'
											onBlur={(evt) => {
												setInputValue(1);
												setCurrentPage(1);
												setMin(evt.target.value);
											}}
										/>
									</div>
									<div className='th-input-container'>
										<input
											className='th-input-container__input'
											type='text'
											name='max'
											placeholder='до'
											onBlur={(evt) => {
												setInputValue(1);
												setCurrentPage(1);
												setMax(evt.target.value)
											}}
										/>
									</div>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{loading && <tr><td className='td--no-border'><Loader /></td></tr>}
						{loading ? renderTbodyContent(stubRecords) : renderTbodyContent(records)}
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

export default connect(mapStateToProps, { getRecordsForPage })(Records);
