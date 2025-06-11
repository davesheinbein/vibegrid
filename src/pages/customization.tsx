import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { equipItem } from '../store/customizationSlice';
import clsx from 'clsx';
import { GoBackButton } from '../components/ui-kit/buttons';

// DRY component for rendering a customization category
const CustomizationCategory: React.FC<{
	title: string;
	items: any[];
	onEquip: (id: string) => void;
	ariaLabelPrefix: string;
}> = ({ title, items, onEquip, ariaLabelPrefix }) => {
	const isTheme = title === 'Themes';
	const isEmote = title === 'Emotes';
	const isFont = title === 'Fonts';
	const isBorder = title === 'Borders';
	const isBackground = title === 'Backgrounds';

	return (
		<div
			className={clsx(
				'customization-category',
				`customization-category-${title.toLowerCase()}`
			)}
		>
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
				<div className='customization-grid'>
					{items.map((item: any) => (
						<button
							key={item.id}
							onClick={() => onEquip(item.id)}
							className={clsx('customization-item-btn', {
								'equipped': item.equipped,
								'theme-preview': isTheme,
								'emote-preview': isEmote,
								'font-preview': isFont,
								'border-preview': isBorder,
								'background-preview': isBackground,
								[`border-style-${item.style}`]:
									isBorder && item.style,
								[`font-family-${item.name}`]:
									isFont && item.name,
							})}
							style={{
								height: 'fit-content',
								width: '100%',
								maxWidth: 320,
								padding: '14px',
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
								fontFamily: isFont ? item.name : undefined,
								cursor: 'pointer',
								transition: 'all 0.18s',
							}}
							aria-label={`Equip ${item.name} ${ariaLabelPrefix}`}
						>
							{/* Preview square/image/swatch */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								{isTheme && (
									<div
										style={{
											width: 60,
											height: 60,
											borderRadius: 10,
											background:
												item.primaryColor ||
												item.accentColor ||
												'#e0e7ef',
											border: `3px solid ${
												item.secondaryColor ||
												item.borderColor ||
												'#38bdf8'
											}`,
											marginBottom: 6,
											position: 'relative',
										}}
									>
										{/* Swatch bar */}
										<div
											style={{
												position: 'absolute',
												bottom: 0,
												left: 0,
												width: '100%',
												height: 10,
												borderBottomLeftRadius: 10,
												borderBottomRightRadius: 10,
												background:
													item.swatchGradient ||
													item.accentColor ||
													'#a78bfa',
											}}
										/>
									</div>
								)}
								{isEmote && (
									<img
										src={item.imageUrl || '/logo.svg'}
										alt={item.name}
										width={60}
										height={60}
										style={{
											borderRadius: 10,
											marginBottom: 6,
											objectFit: 'cover',
											background: '#f3f6fa',
										}}
									/>
								)}
								{isBorder && (
									<div
										style={{
											width: 60,
											height: 60,
											borderRadius: 10,
											border:
												item.previewBorder ||
												'3px solid #e0e7ef',
											marginBottom: 6,
											background: '#fff',
										}}
									/>
								)}
								{isBackground && (
									<div
										style={{
											width: 60,
											height: 60,
											borderRadius: 10,
											marginBottom: 6,
											background: item.previewImage
												? `url(${item.previewImage}) center/cover no-repeat`
												: item.backgroundColor || '#e0e7ef',
										}}
									/>
								)}
								{isFont && (
									<div
										style={{
											width: 60,
											height: 60,
											borderRadius: 10,
											marginBottom: 6,
											background: '#fff',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontFamily: item.name,
											fontWeight: 700,
											fontSize: 20,
											color: '#222',
										}}
									>
										Aa
									</div>
								)}
								<span
									style={{
										fontSize: 14,
										fontWeight: 600,
										marginTop: 2,
									}}
								>
									{item.name}
								</span>
								{item.description && (
									<span
										style={{
											fontSize: 10,
											color: '#64748b',
											marginTop: 2,
										}}
									>
										{item.description}
									</span>
								)}
							</div>
							{item.equipped && (
								<div
									className='customization-equipped-indicator'
									style={{
										color: '#38bdf8',
										fontSize: 18,
										marginTop: 4,
									}}
								>
									✓
								</div>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

const CustomizationPage: React.FC = () => {
	const router = useRouter();
	const inventory = useSelector(
		(state: RootState) => state.customization
	);
	const dispatch = useDispatch();

	const [tab, setTab] = useState<
		'themes' | 'emote' | 'font' | 'borders' | 'background'
	>('themes');

	// Apply equipped theme/background/font globally
	useEffect(() => {
		const equippedTheme = inventory.themes.find(
			(t: any) => t.equipped
		);
		if (equippedTheme) {
			if (equippedTheme.bg) {
				document.body.style.background = equippedTheme.bg;
			}
			if (equippedTheme.font) {
				document.body.style.color = equippedTheme.font;
			}
			// Example: set CSS variables for theme colors
			if (equippedTheme.color) {
				document.documentElement.style.setProperty(
					'--primary-color',
					equippedTheme.color
				);
			}
		}
		const equippedFont = inventory.font.find(
			(f: any) => f.equipped
		);
		if (equippedFont) {
			document.body.style.fontFamily = equippedFont.name;
		}
		const equippedBg = inventory.background.find(
			(b: any) => b.equipped
		);
		if (equippedBg && equippedBg.bg) {
			document.body.style.background = equippedBg.bg;
		}
		// Borders and other granular customizations can be handled via class on body or root
		const equippedBorder = inventory.borders.find(
			(b: any) => b.equipped
		);
		if (equippedBorder && equippedBorder.style) {
			document.body.classList.remove(
				'border-style-solid',
				'border-style-dashed',
				'border-style-dotted',
				'border-style-double',
				'border-style-groove'
			);
			document.body.classList.add(
				`border-style-${equippedBorder.style}`
			);
		}
		// Clean up on unmount
		return () => {
			document.body.classList.remove(
				'border-style-solid',
				'border-style-dashed',
				'border-style-dotted',
				'border-style-double',
				'border-style-groove'
			);
		};
	}, [
		inventory.themes,
		inventory.font,
		inventory.background,
		inventory.borders,
	]);

	const handleEquip = (itemId: string) => {
		dispatch(equipItem({ id: itemId, category: tab }));
		// TODO: Optionally call backend to persist equipped item
	};

	return (
		<div
			style={{ display: 'flex', justifyContent: 'center' }}
		>
			<div
				className='gridRoyale-container'
				style={{
					minHeight: '100vh',
					padding: 24,
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
						Personalize your Vibe Grid experience! Unlock
						and equip themes, emote packs, fonts, and more.
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
							overflow: 'scroll',
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
								onClick={() =>
									setTab(tabName as typeof tab)
								}
								className={clsx('customization-tab-btn', {
									active: tab === tabName,
								})}
								style={{
									fontWeight: tab === tabName ? 700 : 500,
									fontSize: '1.08rem',
									background:
										tab === tabName
											? 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)'
											: 'none',
									color:
										tab === tabName ? '#fff' : '#2563eb',
									border: 'none',
									borderRadius: 8,
									padding: '8px 22px',
									transition:
										'background 0.18s, color 0.18s',
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
						{tab === 'themes' && (
							<CustomizationCategory
								title='Emote Packs'
								items={inventory.emote}
								onEquip={handleEquip}
								ariaLabelPrefix='emote pack'
							/>
						)}
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
		</div>
	);
};

export default CustomizationPage;
