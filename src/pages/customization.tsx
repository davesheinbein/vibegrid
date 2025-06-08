import React from 'react';
import { useRouter } from 'next/router';

// Placeholder for user's owned and equipped items
const sampleInventory = [
	{
		id: 'theme1',
		type: 'theme',
		name: 'Oceanic',
		equipped: true,
	},
	{
		id: 'theme2',
		type: 'theme',
		name: 'Sunset',
		equipped: false,
	},
	{
		id: 'emoji1',
		type: 'emoji',
		name: 'Party Parrot',
		equipped: false,
	},
	{
		id: 'font1',
		type: 'font',
		name: 'Comic Sans',
		equipped: false,
	},
];

const CustomizationPage: React.FC = () => {
	const router = useRouter();
	// In a real app, fetch inventory and equipped items from backend
	const [inventory, setInventory] =
		React.useState(sampleInventory);

	const handleEquip = (itemId: string) => {
		setInventory((inv) =>
			inv.map((item) =>
				item.id === itemId
					? { ...item, equipped: true }
					: item.type ===
					  inv.find((i) => i.id === itemId)?.type
					? { ...item, equipped: false }
					: item
			)
		);
		// TODO: Call backend to equip item
	};

	return (
		<div
			className='gridRoyale-container'
			style={{
				minHeight: '100vh',
				padding: 24,
				maxWidth: 600,
				margin: '0 auto',
			}}
		>
			<h1
				style={{
					fontSize: '2rem',
					fontWeight: 700,
					marginBottom: 18,
					textAlign: 'center',
					color: '#2563eb',
				}}
			>
				🎨 Customization
			</h1>
			<p
				style={{
					textAlign: 'center',
					color: '#64748b',
					marginBottom: 32,
				}}
			>
				View and equip your unlocked themes, fonts, and
				emoji packs. More coming soon!
			</p>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 32,
				}}
			>
				{['theme', 'font', 'emoji'].map((type) => (
					<div key={type}>
						<h2
							style={{
								fontSize: 20,
								marginBottom: 10,
								color: '#2563eb',
								fontWeight: 700,
								letterSpacing: 0.5,
							}}
						>
							{type === 'theme' && '🎨 '}
							{type === 'font' && '🔤 '}
							{type === 'emoji' && '😃 '}
							{type.charAt(0).toUpperCase() + type.slice(1)}
							s
						</h2>
						<div
							style={{
								display: 'flex',
								gap: 18,
								flexWrap: 'wrap',
							}}
						>
							{inventory.filter(
								(item) => item.type === type
							).length === 0 ? (
								<span style={{ color: '#94a3b8' }}>
									No {type}s unlocked yet.
								</span>
							) : (
								inventory
									.filter((item) => item.type === type)
									.map((item) => (
										<div
											key={item.id}
											style={{
												border: item.equipped
													? '2.5px solid #38bdf8'
													: '2px solid #e0e7ef',
												borderRadius: 12,
												padding: '16px 22px',
												background: item.equipped
													? 'linear-gradient(90deg,#a7f3d0 0%,#fde68a 100%)'
													: '#f8fafc',
												color: item.equipped
													? '#2563eb'
													: '#222',
												fontWeight: 600,
												fontSize: 18,
												boxShadow: item.equipped
													? '0 2px 12px 0 #bae6fd'
													: '0 1px 4px 0 #e0e7ef',
												cursor: item.equipped
													? 'default'
													: 'pointer',
												opacity: item.equipped ? 1 : 0.92,
												transition: 'all 0.18s',
												minWidth: 120,
												textAlign: 'center',
												position: 'relative',
												outline: item.equipped
													? '2px solid #38bdf8'
													: undefined,
											}}
											onClick={() =>
												!item.equipped &&
												handleEquip(item.id)
											}
											aria-pressed={item.equipped}
											tabIndex={0}
											onKeyDown={(e) => {
												if (
													!item.equipped &&
													(e.key === 'Enter' ||
														e.key === ' ')
												) {
													handleEquip(item.id);
												}
											}}
										>
											{item.name}
											{item.equipped && (
												<span
													style={{
														position: 'absolute',
														top: 8,
														right: 10,
														fontSize: 18,
														color: '#38bdf8',
													}}
													aria-label='Equipped'
												>
													✓
												</span>
											)}
										</div>
									))
							)}
						</div>
					</div>
				))}
			</div>
			<div style={{ marginTop: 36, textAlign: 'center' }}>
				<button
					className='gridRoyale-submit'
					style={{ width: 180 }}
					onClick={() => router.push('/')}
				>
					Back to Home
				</button>
			</div>
		</div>
	);
};

export default CustomizationPage;
