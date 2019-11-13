import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Header from './Header';
import Loader from './Loader';
import { getRecords } from '../actions/records';
import { logout } from '../actions/auth';

const Records = ({
	records: { records, loading },
	getRecords,
	logout
}) => {
	const [sortby, setSortby] = useState('price');
	const [order, setOrder] = useState('1');
	const [limit, setLimit] = useState(100);
	const [disabled, setDisabled] = useState(false);

	console.log('records:', records);
	// console.log('isAutenticated:', isAutenticated);

	useEffect(() => {
		getRecords();
	}, [getRecords]);

	const onSortByChange = evt => {
		setSortby(evt.target.value);

		if (evt.target.value === 'unsorted') {
			// console.log('sort order change to unsorted');
			setOrder('unsorted');
			console.log('order:', order);
		}
	};

	const onSortOrderChange = evt => {
		setOrder(evt.target.value);

		if (evt.target.value === 'unsorted') {
			// console.log('sort order change to unsorted');
			setSortby('unsorted');
			console.log('sortby:', sortby);
		}
	};

	const onGetData = () => {
		getRecords(sortby, order, limit);
	};

	const onLogoutClick = () => {
		logout();
	};

	const columns = [{
		Header: 'Имя',
		accessor: 'name'
	}, {
		Header: 'Дата',
		accessor: 'timestamp',
		Cell: cell => `${new Date(parseInt(`${cell.value}000`, 10)).toLocaleDateString('ru-Ru')}, ${new Date(cell.value).toLocaleTimeString('ru-Ru')}`
	}, {
		Header: 'Сумма, руб.',
		accessor: 'price',
		Cell: cell => (cell.value / 100).toLocaleString('ru-Ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}];

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
				{/* <div className='sort-select'>
					<div className='sort-select__menu'>
						<h4 className='sort-select__heading'>Set what to sort by</h4>
						<select onChange={onSortByChange} value={sortby}>
							<option value='price'>price</option>
							<option value='timestamp'>timestamp</option>
							<option value='name'>name</option>
						</select>
					</div>
					<div className='sort-select__menu'>
						<h4 className='sort-select__heading'>Set asc/desc sort</h4>
						<select onChange={onSortOrderChange} value={order}>
							<option value='1'>asc</option>
							<option value='-1'>desc</option>
						</select>
					</div>
					<input type='button' onClick={onGetData} value='Get Data' />
				</div> */}
				<div className='table-wrapper'>
					{records && records.length > 0 &&
						<ReactTable
							data={records}
							columns={columns}
							defaultPageSize={10}
							className='-striped -highlight'
							defaultSorted={[{
								id: 'price',
								asc: true
						 	}]}
							previousText='Пред.'
							nextText='След.'
							pageText='Стр.'
							ofText='из'
							rowsText='строк'
						/>
					}
				</div>
			</Fragment>
		);
	}
};

const mapStateToProps = state => ({
	records: state.records
});

export default connect(mapStateToProps, { getRecords, logout })(Records);
