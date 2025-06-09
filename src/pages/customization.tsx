import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { equipItem } from '../store/customizationSlice';
import { ThemeSelector } from '../components/ThemeSelector';
import { GoBackButton } from '../components/ui/Buttons';

const CustomizationPage: React.FC = () => {
	const router = useRouter();
	const inventory = useSelector(
		(state: RootState) => state.customization
	);
	const dispatch = useDispatch();

	const [tab, setTab] = useState<
		'themes' | 'emoji' | 'font' | 'borders' | 'background'
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
				background: 'linear-gradient(135deg, #fafdff 0%, #e0e7ef 100%)',
				borderRadius: 24,
				boxShadow: '0 4px 32px 0 #e3eaff33',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'stretch',
			}}
		>
			<GoBackButton
				onClick={() => router.back()}
				style={{
					position: 'absolute',
					top: 24,
					left: 24,
					zIndex: 10,
					background: '#fff',
					borderRadius: 12,
					boxShadow: '0 2px 8px 0 #e3eaff33',
				}}
				label=''
			/>
			<div style={{ padding: '48px 32px 32px 32px', width: '100%' }}>
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
					Personalize your Vibe Grid experience! Unlock and equip themes, emoji packs, fonts, and more.
				</p>
				<div style={{
					display: 'flex',
					gap: 8,
					justifyContent: 'center',
					marginBottom: 32,
					background: '#f3f6fa',
					borderRadius: 12,
					padding: 6,
					boxShadow: '0 1px 4px 0 #e3eaff22',
				}}>
					{['themes', 'emoji', 'font', 'borders', 'background'].map((tabName) => (
						<button
							key={tabName}
							onClick={() => setTab(tabName as typeof tab)}
							style={{
								fontWeight: tab === tabName ? 700 : 500,
								fontSize: '1.08rem',
								background: tab === tabName ? 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)' : 'none',
								color: tab === tabName ? '#fff' : '#2563eb',
								border: 'none',
								borderRadius: 8,
								padding: '8px 22px',
								transition: 'background 0.18s, color 0.18s',
								boxShadow: tab === tabName ? '0 2px 8px 0 #38bdf855' : 'none',
								cursor: 'pointer',
							}}
						>
							{tabName.charAt(0).toUpperCase() + tabName.slice(1)}
						</button>
					))}
				</div>
				<div style={{ minHeight: 240, width: '100%' }}>
					{tab === 'themes' && <ThemeSelector />}
					{tab === 'emoji' && (
						<div style={{ textAlign: 'center' }}>
							<h2 style={{ marginBottom: 12, fontWeight: 700, color: '#2563eb' }}>Emoji Packs</h2>
							<div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
								{inventory.emoji.map((item: any) => (
									<button
										key={item.id}
										onClick={() => handleEquip(item.id)}
										style={{
											padding: '14px 28px',
											borderRadius: 14,
											border: item.equipped ? '2.5px solid #38bdf8' : '2px solid #e0e7ef',
											background: item.equipped ? 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%)' : '#fff',
											fontWeight: 700,
											color: item.equipped ? '#2563eb' : '#222',
											boxShadow: item.equipped ? '0 0 12px 2px #38bdf855' : '0 1px 4px 0 #e3eaff33',
											fontSize: '1.1rem',
											cursor: 'pointer',
											transition: 'all 0.18s',
										}}
										aria-label={`Equip ${item.name} emoji pack`}
									>
										{item.name}
										{item.equipped && <span style={{ marginLeft: 8, color: '#38bdf8', fontWeight: 900 }}>✓</span>}
									</button>
								))}
							</div>
						</div>
					)}
					{tab === 'font' && (
						<div style={{ textAlign: 'center' }}>
							<h2 style={{ marginBottom: 12, fontWeight: 700, color: '#2563eb' }}>Fonts</h2>
							<div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
								{inventory.font.map((item: any) => (
									<button
										key={item.id}
										onClick={() => handleEquip(item.id)}
										style={{
											padding: '14px 28px',
											borderRadius: 14,
											border: item.equipped ? '2.5px solid #38bdf8' : '2px solid #e0e7ef',
											background: item.equipped ? 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%)' : '#fff',
											fontWeight: 700,
											color: item.equipped ? '#2563eb' : '#222',
											boxShadow: item.equipped ? '0 0 12px 2px #38bdf855' : '0 1px 4px 0 #e3eaff33',
											fontSize: '1.1rem',
											fontFamily: item.name,
											cursor: 'pointer',
											transition: 'all 0.18s',
										}}
										aria-label={`Equip ${item.name} font`}
									>
										{item.name}
										{item.equipped && <span style={{ marginLeft: 8, color: '#38bdf8', fontWeight: 900 }}>✓</span>}
									</button>
								))}
							</div>
						</div>
					)}
					{tab === 'borders' && (
						<div style={{ textAlign: 'center' }}>
							<h2 style={{ marginBottom: 12, fontWeight: 700, color: '#2563eb' }}>Borders</h2>
							{inventory.borders.length === 0 ? (
								<div style={{ color: '#64748b', fontWeight: 500, fontSize: '1.1rem', marginTop: 32 }}>
									No border styles unlocked yet.
								</div>
							) : (
								<div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
									{inventory.borders.map((item: any) => (
										<button
											key={item.id}
											onClick={() => handleEquip(item.id)}
											style={{
												padding: '14px 28px',
												borderRadius: 14,
												border: item.equipped ? '3px solid #38bdf8' : '2px solid #e0e7ef',
												background: item.equipped ? 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%)' : '#fff',
												fontWeight: 700,
												color: item.equipped ? '#2563eb' : '#222',
												boxShadow: item.equipped ? '0 0 12px 2px #38bdf855' : '0 1px 4px 0 #e3eaff33',
												fontSize: '1.1rem',
												cursor: 'pointer',
												transition: 'all 0.18s',
											}}
											aria-label={`Equip ${item.name} border`}
										>
											{item.name}
											{item.equipped && <span style={{ marginLeft: 8, color: '#38bdf8', fontWeight: 900 }}>✓</span>}
										</button>
									))}
								</div>
							)}
						</div>
					)}
					{tab === 'background' && (
						<div style={{ textAlign: 'center' }}>
							<h2 style={{ marginBottom: 12, fontWeight: 700, color: '#2563eb' }}>Backgrounds</h2>
							{inventory.background.length === 0 ? (
								<div style={{ color: '#64748b', fontWeight: 500, fontSize: '1.1rem', marginTop: 32 }}>
									No backgrounds unlocked yet.
								</div>
							) : (
								<div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
									{inventory.background.map((item: any) => (
										<button
											key={item.id}
											onClick={() => handleEquip(item.id)}
											style={{
												padding: '14px 28px',
												borderRadius: 14,
												border: item.equipped ? '3px solid #38bdf8' : '2px solid #e0e7ef',
												background: item.equipped ? 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%)' : '#fff',
												fontWeight: 700,
												color: item.equipped ? '#2563eb' : '#222',
												boxShadow: item.equipped ? '0 0 12px 2px #38bdf855' : '0 1px 4px 0 #e3eaff33',
												fontSize: '1.1rem',
												cursor: 'pointer',
												transition: 'all 0.18s',
											}}
											aria-label={`Equip ${item.name} background`}
										>
											{item.name}
											{item.equipped && <span style={{ marginLeft: 8, color: '#38bdf8', fontWeight: 900 }}>✓</span>}
										</button>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CustomizationPage;
