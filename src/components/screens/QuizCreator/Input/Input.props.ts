import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface InputProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	type: string
	name: string
	value: string
}