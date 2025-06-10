// Centralized ThemeSelector component for UI Kit
import React from 'react';
import { vsModeDefaults } from '../../ThemeSelector';

// TODO: Implement a real theme selector UI. For now, export the color tokens and a stub.

const ThemeSelector: React.FC = () => {
	return (
		<div style={{ padding: 16 }}>
			<h3>Theme Selector (Coming Soon)</h3>
			<pre
				style={{
					fontSize: 12,
					background: '#f1f5f9',
					padding: 8,
					borderRadius: 8,
				}}
			>
				{JSON.stringify(vsModeDefaults, null, 2)}
			</pre>
		</div>
	);
};

export default ThemeSelector;
