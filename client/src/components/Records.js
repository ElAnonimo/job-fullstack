import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Header from './Header';
import Loader from './Loader';
import { getRecords } from '../actions/records';

const Records = ({
	records: { records, loading },
	getRecords
}) => {
	useEffect(() => {
		getRecords();
	}, [getRecords]);

	const columns = [{
		Header: 'Имя',
		accessor: 'name'
	}, {
		Header: 'Дата',
		accessor: 'timestamp',
		Cell: cell => `${new Date(parseInt(`${cell.value}000`, 10)).toLocaleDateString('ru-Ru')}, ${new Date(parseInt(`${cell.value}000`, 10)).toLocaleTimeString('ru-Ru')}`
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

Records.propTypes = {
	records: PropTypes.object.isRequired,
	getRecords: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getRecords })(Records);
