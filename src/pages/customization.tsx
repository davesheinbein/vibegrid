import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { GoBackButton } from '../components/ui-kit/buttons';
import { CustomizationCategory } from '../components/ui-kit/customization';
import { loadFont } from '../utils/fontLoader';
import type { Customization } from '../types/api';
import {
	fetchInventory,
	equipCustomization,
	fetchAvailableCustomizations,
} from '../services/customizationService';
import { useSession, signIn } from 'next-auth/react';
import SignInModal from '../components/ui-kit/modals/SignInModal';

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

const LOCAL_STORAGE_KEY = 'vibegrid.customization';

const CustomizationPage: React.FC = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const user = session?.user;
	const [inventory, setInventory] = useState({
		themes: [],
		emote: [],
		font: [],
		borders: [],
		background: [],
	});
	const [available, setAvailable] = useState({
		themes: [],
		emote: [],
		font: [],
		borders: [],
		background: [],
	});
	const [loading, setLoading] = useState(true);
	const [showSignIn, setShowSignIn] = useState(false);
	const [tab, setTab] = useState<
		'themes' | 'emote' | 'font' | 'borders' | 'background'
	>('themes');
	const [guestSelection, setGuestSelection] = useState<any>(
		{}
	);

	// On load, fetch available and inventory, and guest localStorage if not logged in
	useEffect(() => {
		// Don't fetch until we know the session status
		if (status === 'loading') return;

		async function loadAllCustomizations() {
			setLoading(true);
			try {
				const [avail, inv] = await Promise.all([
					fetchAvailableCustomizations(),
					user?.id
						? fetchInventory(user.id)
						: Promise.resolve({
								themes: [],
								emote: [],
								font: [],
								borders: [],
								background: [],
						  }),
				]);
				setAvailable(avail);
				setInventory(inv);
				if (!user?.id) {
					const local = localStorage.getItem(
						LOCAL_STORAGE_KEY
					);
					if (local) setGuestSelection(JSON.parse(local));
				}
			} catch (error) {
				console.error(
					'Failed to load customizations:',
					error
				);
			} finally {
				setLoading(false);
			}
		}
		loadAllCustomizations();
	}, [user?.id, status]);

	// Apply equipped theme/background/font globally
	useEffect(() => {
		// THEME: Set CSS variables on :root for palette
		const equippedTheme = (inventory?.themes ?? []).find(
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
		const equippedFont = (inventory?.font ?? []).find(
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
		const equippedBg = (inventory?.background ?? []).find(
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
		const equippedBorder = (inventory?.borders ?? []).find(
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

	// Helper to merge available and inventory for a category
	function getMergedItems(
		category: keyof typeof available
	) {
		const all = available[category] || [];
		const owned = inventory[category] || [];
		return all.map((item, idx) => {
			const ownedItem = owned.find((i) => i.id === item.id);
			const equipped = user?.id
				? !!ownedItem?.equipped
				: guestSelection[category] === item.id;
			return {
				...item,
				unlocked: user?.id ? !!ownedItem : idx < 2,
				equipped,
			};
		});
	}

	// Handler for equipping customization
	const handleEquip = async (
		slot: string,
		itemId: string
	) => {
		if (!user?.id) {
			// Guest: only allow first two, store in localStorage
			const idx = (available[slot] || []).findIndex(
				(i) => i.id === itemId
			);
			if (idx > 1) return; // Should be locked, ignore
			const newSel = { ...guestSelection, [slot]: itemId };
			setGuestSelection(newSel);
			localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify(newSel)
			);
			return;
		}
		await equipCustomization(slot, itemId, user.id);
		const inv = await fetchInventory(user.id);
		setInventory(inv);
	};

	// Handler for locked click (guests)
	const handleLockedClick = () => setShowSignIn(true);

	// For each tab, determine locked indices for guests
	const lockedIndices = !user?.id
		? available[tab]
				?.map((_, idx) => (idx > 1 ? idx : -1))
				.filter((i) => i >= 0) || []
		: [];

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
						<CustomizationCategory
							title={
								tab.charAt(0).toUpperCase() + tab.slice(1)
							}
							items={getMergedItems(tab)}
							onEquip={handleEquip}
							ariaLabelPrefix={tab}
							lockedIndices={lockedIndices}
							onLockedClick={handleLockedClick}
						/>
					</div>
				</div>
				<SignInModal
					open={showSignIn}
					onClose={() => setShowSignIn(false)}
					onSignIn={() => {
						signIn();
						setShowSignIn(false);
					}}
				/>
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
