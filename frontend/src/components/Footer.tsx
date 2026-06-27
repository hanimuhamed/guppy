let current_year = new Date().getFullYear();

/*proprs for mobile-only*/
interface FooterProps {
	mobileOnly?: boolean
}

export const Footer: React.FC<FooterProps> = ({ mobileOnly = false }) => {
	return (
		<footer className={`home-footer ${mobileOnly ? 'mobile-only' : ''}`}>
			<p style={{ color: 'var(--text-dimmed)', fontSize: '14px' }}>
				&copy; {current_year} <a href="https://github.com/hanimuhamed/getsetpixel" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dimmed)'}}>guppy</a>. All rights reserved.
			</p>
		</footer>
	)
}