import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { equipItem } from '../store/customizationSlice';
import clsx from 'clsx';
import { GoBackButton } from '../components/ui-kit/buttons';
import { CustomizationCategory } from '../components/ui-kit/customization';
import { loadFont } from '../utils/fontLoader';

function setGlobalFontFamily(fontFamily: string) {
	const styleTagId = 'customization-font-style';
	let styleTag = document.getElementById(
		styleTagId
	) as HTMLStyleElement | null;
	if (!styleTag) {
		styleTag = document.createElement('style');
		styleTag.id = styleTagId;
		document.head.appendChild(styleTag);
	}
	styleTag.innerHTML = `*, *::before, *::after { font-family: ${fontFamily} !important; }`;
}

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
		// THEME: Set CSS variables on :root for palette
		const equippedTheme = inventory.themes.find(
			(t: any) => t.equipped
		);
		if (equippedTheme) {
			if (equippedTheme.color) {
				document.documentElement.style.setProperty(
					'--primary-color',
					equippedTheme.color
				);
			}
			if (equippedTheme.bg) {
				document.body.style.background = equippedTheme.bg;
				document.documentElement.style.background =
					equippedTheme.bg;
				const next = document.getElementById('__next');
				if (next) next.style.background = equippedTheme.bg;
			}
			if (equippedTheme.font) {
				document.body.style.color = equippedTheme.font;
				document.documentElement.style.color =
					equippedTheme.font;
			}
		}

		// FONT: Set font-family globally (body, html, *)
		const equippedFont = inventory.font.find(
			(f: any) => f.equipped
		);
		if (equippedFont) {
			const fontFamily =
				extractFontFamily(equippedFont.style) ||
				equippedFont.name;
			document.body.style.fontFamily = fontFamily;
			document.documentElement.style.fontFamily =
				fontFamily;
			setGlobalFontFamily(fontFamily); // * selector with !important
			loadFont(fontFamily);
		}

		// BACKGROUND: Also set on html and #__next for full coverage
		const equippedBg = inventory.background.find(
			(b: any) => b.equipped
		);
		if (equippedBg && equippedBg.bg) {
			document.body.style.background = equippedBg.bg;
			document.documentElement.style.background =
				equippedBg.bg;
			const next = document.getElementById('__next');
			if (next) next.style.background = equippedBg.bg;
		}

		// BORDER: Add class to body for border style
		const equippedBorder = inventory.borders.find(
			(b: any) => b.equipped
		);
		const borderClasses = [
			'border-style-solid',
			'border-style-dashed',
			'border-style-dotted',
			'border-style-double',
			'border-style-groove',
		];
		document.body.classList.remove(...borderClasses);
		if (equippedBorder && equippedBorder.style) {
			document.body.classList.add(
				`border-style-${equippedBorder.style}`
			);
		}

		// Clean up on unmount
		return () => {
			document.body.classList.remove(...borderClasses);
			// Optionally remove font style tag
			const styleTag = document.getElementById(
				'customization-font-style'
			);
			if (styleTag) styleTag.remove();
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
								title='Themes'
								items={inventory.themes}
								onEquip={handleEquip}
								ariaLabelPrefix='theme'
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

// Helper to extract font-family from style string
function extractFontFamily(
	style: string
): string | undefined {
	const match = style.match(
		/font-family:\s*(["']?)([\w\s-]+)(?:\1)?/i
	);
	if (match) {
		return match[2];
	}
	// fallback: try to extract quoted family
	const quoted = style.match(
		/font-family:\s*(["'][^"']+["'])/i
	);
	if (quoted) {
		return quoted[1].replace(/['"]/g, '');
	}
	return undefined;
}

export default CustomizationPage;
