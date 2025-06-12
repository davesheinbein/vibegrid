import React from 'react';
import clsx from 'clsx';

interface CustomizationCategoryProps {
	title: string;
	items: Array<
		{
			id: string;
			name: string;
			description?: string;
			primaryColor?: string;
			accentColor?: string;
			secondaryColor?: string;
			borderColor?: string;
			swatchGradient?: string;
			imageUrl?: string;
			previewBorder?: string;
			previewImage?: string;
			backgroundColor?: string;
			style?: string;
			equipped?: boolean;
		} & Record<string, any>
	>;
	onEquip: (slot: string, id: string) => void;
	ariaLabelPrefix: string;
	lockedIndices?: number[];
	onLockedClick?: (item: any) => void;
}

function getCustomizationTypeFlags(title: string) {
	const lowerTitle = title.toLowerCase();
	return {
		isEmote: lowerTitle.includes('emote'),
		isFont: lowerTitle.includes('font'),
		isTheme: lowerTitle.includes('theme'),
		isBorder: lowerTitle.includes('border'),
		isBackground: lowerTitle.includes('background'),
		lowerTitle,
	};
}

const CustomizationCategory: React.FC<
	CustomizationCategoryProps
> = ({
	title,
	items = [],
	onEquip,
	ariaLabelPrefix,
	lockedIndices = [],
	onLockedClick,
}) => {
	const {
		isEmote,
		isFont,
		isTheme,
		isBorder,
		isBackground,
		lowerTitle,
	} = getCustomizationTypeFlags(title);

	return (
		<div
			className={clsx(
				'customization-category',
				`customization-category-${lowerTitle}`
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
					No {lowerTitle} unlocked yet.
				</div>
			) : (
				<div className='customization-grid'>
					{items.map((item, idx) => {
						const isLocked = lockedIndices.includes(idx);
						return (
							<button
								key={item.id}
								onClick={
									isLocked
										? (e) => {
												e.preventDefault();
												if (onLockedClick)
													onLockedClick(item);
										  }
										: () => onEquip(lowerTitle, item.id)
								}
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
									'locked': isLocked,
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
									background: isLocked
										? '#f1f5f9'
										: item.equipped
										? 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%)'
										: '#fff',
									fontWeight: 700,
									color: isLocked
										? '#b0b7c3'
										: item.equipped
										? '#2563eb'
										: '#222',
									boxShadow: item.equipped
										? '0 0 12px 2px #38bdf855'
										: '0 1px 4px 0 #e3eaff33',
									fontSize: '1.1rem',
									fontFamily: isFont
										? item.name
										: undefined,
									cursor: 'pointer',
									transition: 'all 0.18s',
									position: 'relative',
								}}
								aria-label={
									isLocked
										? `Locked: log in to unlock ${item.name}`
										: `Equip ${item.name} ${ariaLabelPrefix}`
								}
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
													: item.backgroundColor ||
													  '#e0e7ef',
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
											{item.previewText || 'Aa'}
										</div>
									)}
									<span
										style={{
											fontSize: 14,
											fontWeight: 600,
											marginTop: 2,
											fontFamily: isFont
												? item.name
												: undefined,
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
												fontFamily: isFont
													? item.name
													: undefined,
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
								{isLocked && (
									<span
										className='customization-locked-badge'
										style={{
											position: 'absolute',
											top: 8,
											right: 8,
											background: '#fff',
											borderRadius: '50%',
											padding: '2px 7px',
											fontSize: 16,
											color: '#64748b',
											boxShadow: '0 1px 4px #e3eaff33',
											border: '1.5px solid #e0e7ef',
											cursor: 'pointer',
										}}
										title='Log in to unlock this style'
									>
										🔒
									</span>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default CustomizationCategory;
