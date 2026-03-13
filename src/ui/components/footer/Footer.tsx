import React from 'react'
import { Container } from '@/ui/components'
import { cx } from '@/utils/cx'

interface FooterProps {
	className?: string
}


export const Footer = ({className}: FooterProps) => {
	return (
		<footer className={cx('border-t border-black', className)}>
			{/* Bottom thick rule */}
			<div className="w-full border-b border-black/10 px-16 lg:px-24 py-6 flex justify-between items-center">
				<span className="font-sans text-9 uppercase tracking-widest opacity-30">End of transmission</span>
				<span className="font-sans text-9 uppercase tracking-widest opacity-30">{new Date().getFullYear()}</span>
			</div>
			<div className="px-16 lg:px-24 py-24 flex justify-between items-end">
				<span className="font-serif text-32 lg:text-40 uppercase leading-none">Portfolio</span>
				<span className="font-sans text-9 uppercase tracking-widest opacity-30 hidden lg:block">Singapore</span>
			</div>
			<div className="h-[3px] bg-black w-full" />
		</footer>
	)
}