import React from 'react';
import GoBackButton from '../buttons/GoBackButton';

interface BrowseHeaderProps {
	title: string;
	tabs: { label: string; value: string }[];
	currentTab: string;
	setTab: (tab: string) => void;
	onBack: () => void;
}

const BrowseHeader: React.FC<BrowseHeaderProps> = ({
	title,
	tabs,
	currentTab,
	setTab,
	onBack,
}) => (
	<div className='browse-puzzles-header'>
		<GoBackButton
			onClick={onBack}
			className='back-icon-btn'
		/>
		<div
			className='browse-puzzles-header-title'
			style={{ flex: 1 }}
		>
			<h1 className='gridRoyale-title'>{title}</h1>
			<div className='browse-puzzles-tabs'>
				{tabs.map((tab) => (
					<button
						key={tab.value}
						onClick={() => setTab(tab.value)}
						className={currentTab === tab.value ? 'active' : ''}
					>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	</div>
);

export default BrowseHeader;
