import React, { useEffect } from 'react';

const Modal = ({ children, onClose, className = '', title = '' }) => {
	// handle escape key to close modal
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		// add event listener and prevent body scroll
		document.addEventListener('keydown', handleEscape);
		document.body.style.overflow = 'hidden';

		// cleanup function
		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [onClose]);

	// close modal when clicking backdrop
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div className='modal-backdrop' onClick={handleBackdropClick}>
			<div className={`modal-content ${className}`}>
				{/* close button */}
				<button
					className='modal-close'
					onClick={onClose}
					aria-label='Close modal'
				>
					×
				</button>

				{/* optional title */}
				{title && <h3 className='modal-title'>{title}</h3>}

				{/* modal content */}
				<div className='modal-body'>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
