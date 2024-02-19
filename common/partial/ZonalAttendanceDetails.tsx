import React, { FC, useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Button from '../../components/bootstrap/Button';
import Icon from '../../components/icon/Icon';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import data from '../data/dummyProductData';
import Link from 'next/link';

interface ITableRowProps {
	id: string;
	name: string;
	present: number;
	absent: number;
	total: number;
	actionPage: string;
}
const TableRow: FC<ITableRowProps> = ({
	id,
	absent,
	actionPage, name, present, total
}) => {
	const { darkModeStatus } = useDarkMode();

	return (
		<tr>
			<th scope='row'>{id}</th>
			<td>
				{name}
			</td>
			<td>
				{present}
			</td>
			<td>
				{absent}
			</td>
			<td>
				{total}
			</td>
			<td>
				<Link href={actionPage} className='btn btn-primary' >
					<Icon icon="Add" size='2x' color={"light"} />
				</Link>
			</td>
		</tr>
	);
};

const ZonalAttendanceDetails = () => {

	const [totalEmployeeFilter, setTotalEmployeeFilter] = useState([0, 20]);
	const filteredData = data.filter(f => f.total >= totalEmployeeFilter[0] && f.total < totalEmployeeFilter[1]);

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['3']);
	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData);

	return (
		<Card>
			<CardHeader>
				<CardLabel icon='Person' iconColor='info'>
					<CardTitle tag='h4' className='h5'>
						Employee Attedence Details
					</CardTitle>
				</CardLabel>
				{/* show if filter is needed temporarily disabled*/}
				<CardActions className=''>
					<Dropdown isButtonGroup>
						<Button color='success' isLight>
							Employess ( {totalEmployeeFilter[0]} - {totalEmployeeFilter[1]} )
						</Button>
						<DropdownToggle>
							<Button color='success' isLight isVisuallyHidden />
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd>
							<DropdownItem>
								<Button onClick={() => setTotalEmployeeFilter([0, 20])}>
									0 - 20
								</Button>
							</DropdownItem>
							<DropdownItem>
								<Button onClick={() => setTotalEmployeeFilter([21, 100])}>
									21 - 100
								</Button>
							</DropdownItem>
							<DropdownItem>
								<Button onClick={() => setTotalEmployeeFilter([101, 500])}>
									101 - 500
								</Button>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<Button
						color='info'
						icon='CloudDownload'
						isLight
						tag='a'
						to='/somefile.txt'
						target='_blank'
						download
						className='d-none'
					>
						Export
					</Button>
				</CardActions>
			</CardHeader>
			<CardBody className='table-responsive'>
				<table className='table table-modern table-hover'>
					<thead>
						<tr>
							<th
								scope='col'
								onClick={() => requestSort('id')}
								className='cursor-pointer text-decoration-underline'>
								#{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('id')}
									icon='FilterList'
								/>
							</th>
							<th scope='col'>Zone</th>
							<th scope='col'>
								Present
							</th>
							<th scope='col'>Absent</th>
							<th
								scope='col'
								onClick={() => requestSort('stock')}
								className='cursor-pointer text-decoration-underline'>
								Total{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('stock')}
									icon='FilterList'
								/>
							</th>
							<th
								scope='col'
								onClick={() => requestSort('price')}
								className='cursor-pointer text-decoration-underline'>
								Action{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('price')}
									icon='FilterList'
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						{dataPagination(items, currentPage, perPage)?.length > 0 && dataPagination(items, currentPage, perPage).map((i) => (
							// eslint-disable-next-line react/jsx-props-no-spreading
							<TableRow key={i.id} {...i} />
						))}

						{
							dataPagination(items, currentPage, perPage)?.length <= 0 && (
								<tr>
									<td className='text-center' style={{ height: 100 }} colSpan={6}>
										No data found.
									</td>
								</tr>
							)
						}
					</tbody>
				</table>
			</CardBody>
			<PaginationButtons
				data={items}
				label='items'
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				perPage={perPage}
				setPerPage={setPerPage}
			/>
		</Card>
	);
};

export default ZonalAttendanceDetails;
