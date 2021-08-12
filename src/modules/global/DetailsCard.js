import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

import '../../assets/css/project.css';
import { PROJECT_STATUS } from '../../constants';

export default function DetailsCard(props) {
	const { title, button_name, name, name_value, total, total_value, status, handleStatusChange } = props;

	const handleSwitchChange = e => {
		const _status = e === true ? PROJECT_STATUS.ACTIVE : PROJECT_STATUS.SUSPENDED;
		handleStatusChange(_status);
	};

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								{title || 'No Title'}
							</CardTitle>
						</Col>
						<Col>
							<div style={{ float: 'right' }}>
								{title === 'Project Details' ? (
									<BootstrapSwitchButton
										checked={status === PROJECT_STATUS.SUSPENDED ? false : true}
										onlabel="Activated"
										offlabel="Suspended"
										width={140}
										height={30}
										onstyle="success"
										onChange={handleSwitchChange}
									/>
								) : (
									<button
										type="button"
										className="btn waves-effect waves-light btn-outline-info"
										style={{ borderRadius: '8px' }}
									>
										{button_name || 'button'}
									</button>
								)}
							</div>
						</Col>
					</Row>
					<Row>
						<Col md="8" sm="12" style={{ marginBottom: '10px' }}>
							<p className="card-font-medium">{name_value || '0'}</p>
							<div className="sub-title">{name || 'No Label'}</div>
						</Col>
						<Col md="4" sm="12">
							<p className="card-font-bold">{total_value || '0'}</p>
							<div className="sub-title">{total || 'No Label'}</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}