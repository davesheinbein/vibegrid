// GlobalToast.tsx - Renders global toasts from Redux notifications
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { removeNotification } from '../../../store/notificationsSlice';
import { ToastBanner } from './ToastBanner';
// import { AnimatePresence, motion } from 'framer-motion'; // Uncomment if using Framer Motion

const AUTO_DISMISS = 3200;

const GlobalToast: React.FC = () => {
	const notifications = useSelector(
		(state: RootState) => state.notifications.notifications
	);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (notifications.length > 0) {
			const timer = setTimeout(() => {
				dispatch(removeNotification(notifications[0].id));
			}, AUTO_DISMISS);
			return () => clearTimeout(timer);
		}
	}, [notifications, dispatch]);

	if (notifications.length === 0) return null;

	// Optionally use AnimatePresence/motion for animation
	return (
		<div
			style={{
				position: 'fixed',
				top: 24,
				left: 0,
				right: 0,
				zIndex: 2000,
				pointerEvents: 'none',
			}}
		>
			{/* <AnimatePresence initial={false}> */}
			{notifications.slice(0, 2).map((notif) => (
				// <motion.div key={notif.id} ...animationProps>
				<ToastBanner
					key={notif.id}
					message={notif.message}
					type={notif.type}
					onClose={() =>
						dispatch(removeNotification(notif.id))
					}
				/>
				// </motion.div>
			))}
			{/* </AnimatePresence> */}
		</div>
	);
};

export default GlobalToast;
