import React from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { equipItem } from '../store/customizationSlice';
import { themes } from '../components/ThemeSelector';
import { GoBackButton } from '../components/ui/Buttons';

const getThemeConfig = (themeName: string) =>
	themes.find(
		(t) => t.label.toLowerCase() === themeName.toLowerCase()
	) || themes[0];

const CustomizationPage: React.FC = () => {
	const router = useRouter();
	const inventory = useSelector(
		(state: RootState) => state.customization
	);
	const dispatch = useDispatch();

	const handleEquip = (itemId: string) => {
		dispatch(equipItem(itemId));
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
				position: 'relative',
			}}
		>
			<GoBackButton
				onClick={() => router.back()}
				style={{
					position: 'absolute',
					top: 16,
					left: 16,
					zIndex: 10,
				}}
				label=''
			/>
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

			{['theme', 'emoji', 'font'].map((type) => (
				<div key={type}>
					<div
						style={{
							display: 'flex',
							gap: 16,
							flexWrap: 'wrap',
						}}
					>
						{inventory
							.filter((item) => item.type === type)
							.map((item) => {
								const themeCfg =
									type === 'theme'
										? getThemeConfig(item.name)
										: null;
								return (
									<div
										key={item.id}
										style={{
											border: item.equipped
												? '2.5px solid #38bdf8'
												: '1.5px solid #e0e7ef',
											borderRadius: 14,
											padding: 16,
											minWidth: 120,
											textAlign: 'center',
											background: item.equipped
												? '#e0f7fa'
												: '#fff',
											boxShadow: item.equipped
												? '0 0 16px 2px #38bdf855'
												: '0 1px 4px 0 #e3eaff33',
											transition:
												'box-shadow 0.22s, border 0.22s, background 0.22s',
										}}
									>
										<div
											style={{
												fontWeight: 600,
												marginBottom: 8,
											}}
										>
											{item.name}
										</div>
										{/* Theme swatch preview for themes only */}
										{type === 'theme' && themeCfg && (
											<label
												className='container'
												style={{
													margin: '0 auto 12px auto',
													display: 'block',
													width: 54,
													height: 54,
													borderRadius: 16,
													cursor: item.equipped
														? 'default'
														: 'pointer',
												}}
												aria-label={`Preview ${themeCfg.label} theme`}
											>
												<input
													type='radio'
													name='theme-swatch'
													checked={item.equipped}
													onChange={() =>
														handleEquip(item.id)
													}
													style={{ display: 'none' }}
													disabled={item.equipped}
												/>
												<span className='checkbox-wrapper'>
													<span
														className='checkmark'
														style={{
															background:
																themeCfg.swatchType ===
																'gradient'
																	? themeCfg.bg
																	: themeCfg.color,
															borderColor: item.equipped
																? themeCfg.color
																: '#4b5eaa',
															borderRadius: item.equipped
																? '50%'
																: '8px',
															boxShadow: item.equipped
																? `0 0 8px 2px ${themeCfg.color}99`
																: '0 0 8px rgba(75, 94, 170, 0.3)',
															transition:
																'background 0.4s, border-color 0.3s, border-radius 0.3s',
														}}
													></span>
													<span className='nebula-glow'></span>
													<span className='sparkle-container'></span>
												</span>
											</label>
										)}
										{/* Add emoji/font preview here if needed */}
										<button
											onClick={() => handleEquip(item.id)}
											style={{
												background: item.equipped
													? '#38bdf8'
													: '#fbbf24',
												color: item.equipped
													? '#fff'
													: '#222',
												border: 'none',
												borderRadius: 8,
												padding: '6px 18px',
												fontWeight: 600,
												cursor: item.equipped
													? 'default'
													: 'pointer',
												opacity: item.equipped ? 0.7 : 1,
												marginTop: 10,
											}}
											disabled={item.equipped}
										>
											{item.equipped ? 'Equipped' : 'Equip'}
										</button>
									</div>
								);
							})}
					</div>
				</div>
			))}
		</div>
	);
};

export default CustomizationPage;
