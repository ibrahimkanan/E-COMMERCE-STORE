const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='relative flex items-center justify-center w-20 h-20 rounded-full bg-[#e0e0e0] shadow-[8px_8px_16px_#b8b8b8,-8px_-8px_16px_#ffffff]'>
				<div className='w-12 h-12 border-4 border-gray-300 border-t-gray-800 animate-spin rounded-full absolute' />
				<div className='sr-only'>Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
