import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { equipItem } from '../store/customizationSlice';
import { ThemeSelector } from '../components/ThemeSelector';
import { GoBackButton } from '../components/ui/Buttons';

// DRY component for rendering a customization category
const CustomizationCategory: React.FC<{
	title: string;
	items: any[];
	onEquip: (id: string) => void;
	ariaLabelPrefix: string;
}> = ({ title, items, onEquip, ariaLabelPrefix }) => (
	<div style={{ textAlign: 'center' }}>
		<h2
			style={{
				marginBottom: 12,
				fontWeight: 700,
				color: '#2563eb',
			}}
		>
			{title}
		</h2>
		{items.length === 0 ? (
			<div
				style={{
					color: '#64748b',
					fontWeight: 500,
					fontSize: '1.1rem',
					marginTop: 32,
				}}
			>
				No {title.toLowerCase()} unlocked yet.
			</div>
		) : (
			<div
				style={{
					display: 'flex',
					gap: 18,
					justifyContent: 'center',
					flexWrap: 'wrap',
					marginTop: 16,
				}}
			>
				{items.map((item: any) => (
					<button
						key={item.id}
						onClick={() => onEquip(item.id)}
						style={{
							padding: '14px 28px',
							borderRadius: 14,
							border: item.equipped
								? '2.5px solid #38bdf8'
								: '2px solid #e0e7ef',
							background: item.equipped
								? 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%)'
								: '#fff',
							fontWeight: 700,
							color: item.equipped ? '#2563eb' : '#222',
							boxShadow: item.equipped
								? '0 0 12px 2px #38bdf855'
								: '0 1px 4px 0 #e3eaff33',
							fontSize: '1.1rem',
							fontFamily:
								title === 'Fonts' ? item.name : undefined,
							cursor: 'pointer',
							transition: 'all 0.18s',
						}}
						aria-label={`Equip ${item.name} ${ariaLabelPrefix}`}
					>
						{item.name}
						{item.equipped && (
							<span
								style={{
									marginLeft: 8,
									color: '#38bdf8',
									fontWeight: 900,
								}}
							>
								✓
							</span>
						)}
					</button>
				))}
			</div>
		)}
	</div>
);

const CustomizationPage: React.FC = () => {
	const router = useRouter();
	const inventory = useSelector(
		(state: RootState) => state.customization
	);
	const dispatch = useDispatch();

	const [tab, setTab] = useState<
		'themes' | 'emote' | 'font' | 'borders' | 'background'
	>('themes');

	const handleEquip = (itemId: string) => {
		dispatch(equipItem(itemId));
		// TODO: Call backend to equip item
	};

	return (
		<div
			className='gridRoyale-container'
			style={{
				minHeight: '100vh',
				padding: 0,
				maxWidth: 700,
				margin: '0 auto',
				position: 'relative',
				background:
					'linear-gradient(135deg, #fafdff 0%, #e0e7ef 100%)',
				borderRadius: 24,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'stretch',
			}}
		>
			<GoBackButton
				onClick={() => router.back()}
				className='back-icon-btn'
			/>
			<div
				style={{
					padding: '48px 0',
					width: '100%',
				}}
			>
				<h1
					style={{
						fontSize: '2.4rem',
						fontWeight: 800,
						marginBottom: 10,
						textAlign: 'center',
						color: '#2563eb',
						letterSpacing: 0.01,
					}}
				>
					🎨 Customization
				</h1>
				<p
					style={{
						textAlign: 'center',
						color: '#64748b',
						marginBottom: 32,
						fontSize: '1.15rem',
						fontWeight: 500,
					}}
				>
					Personalize your Vibe Grid experience! Unlock and
					equip themes, emote packs, fonts, and more.
				</p>
				<div
					style={{
						display: 'flex',
						gap: 8,
						justifyContent: 'center',
						marginBottom: 32,
						background: '#f3f6fa',
						borderRadius: 12,
						padding: 6,
						boxShadow: '0 1px 4px 0 #e3eaff22',
					}}
				>
					{[
						'themes',
						'emote',
						'font',
						'borders',
						'background',
					].map((tabName) => (
						<button
							key={tabName}
							onClick={() => setTab(tabName as typeof tab)}
							style={{
								fontWeight: tab === tabName ? 700 : 500,
								fontSize: '1.08rem',
								background:
									tab === tabName
										? 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)'
										: 'none',
								color: tab === tabName ? '#fff' : '#2563eb',
								border: 'none',
								borderRadius: 8,
								padding: '8px 22px',
								transition: 'background 0.18s, color 0.18s',
								boxShadow:
									tab === tabName
										? '0 2px 8px 0 #38bdf855'
										: 'none',
								cursor: 'pointer',
							}}
						>
							{tabName.charAt(0).toUpperCase() +
								tabName.slice(1)}
						</button>
					))}
				</div>
				<div style={{ minHeight: 240, width: '100%' }}>
					{tab === 'themes' && <ThemeSelector />}
					{tab === 'emote' && (
						<CustomizationCategory
							title='Emote Packs'
							items={inventory.emote}
							onEquip={handleEquip}
							ariaLabelPrefix='emote pack'
						/>
					)}
					{tab === 'font' && (
						<CustomizationCategory
							title='Fonts'
							items={inventory.font}
							onEquip={handleEquip}
							ariaLabelPrefix='font'
						/>
					)}
					{tab === 'borders' && (
						<CustomizationCategory
							title='Borders'
							items={inventory.borders}
							onEquip={handleEquip}
							ariaLabelPrefix='border'
						/>
					)}
					{tab === 'background' && (
						<CustomizationCategory
							title='Backgrounds'
							items={inventory.background}
							onEquip={handleEquip}
							ariaLabelPrefix='background'
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default CustomizationPage;
