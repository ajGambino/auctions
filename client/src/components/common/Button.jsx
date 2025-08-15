import React from 'react';

const Button = ({
	children,
	onClick,
	disabled = false,
	variant = 'primary',
	size = 'medium',
	className = '',
	type = 'button',
	...props
}) => {
	// build css classes based on props
	const getButtonClasses = () => {
		const baseClasses = 'btn';

		const variantClasses = {
			primary: 'btn-primary',
			secondary: 'btn-secondary',
			danger: 'btn-danger',
			success: 'btn-success',
		};

		const sizeClasses = {
			small: 'btn-small',
			medium: 'btn-medium',
			large: 'btn-large',
		};

		return [
			baseClasses,
			variantClasses[variant] || variantClasses.primary,
			sizeClasses[size] || sizeClasses.medium,
			disabled && 'btn-disabled',
			className,
		]
			.filter(Boolean)
			.join(' ');
	};

	return (
		<button
			type={type}
			className={getButtonClasses()}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
