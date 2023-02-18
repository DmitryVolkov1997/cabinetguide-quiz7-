import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { DashboardProps } from '@/components/screens/Dashboard/Dashboard.props'
import axios from 'axios'
import { CONTACT_FORM_BASE_URL } from '@/configs/constants'
import Table from '@/components/screens/Dashboard/Table/Table'
import { ContactsInterface } from '@/shared/interfaces/contacts.interface'
import Auth from '@/components/Auth/Auth'

const getPasswordFromLocalStorage = () => {
	if (localStorage.getItem('email') && localStorage.getItem('password')) {
		return localStorage.getItem('password') as string
	}

	return ''
}

const getEmailFromLocalStorage = () => {
	if (localStorage.getItem('email') && localStorage.getItem('password')) {
		return localStorage.getItem('email') as string
	}

	return ''
}

const Dashboard: FC<DashboardProps> = () => {
	const [users, setUsers] = useState<ContactsInterface[]>([])
	const [email, setEmail] = useState<string>(getEmailFromLocalStorage)
	const [password, setPassword] = useState<string>(getPasswordFromLocalStorage)
	const [show, setShow] = useState(false)
	const [checked, setChecked] = useState<boolean>(false)
	const [showError, setShowError] = useState<boolean>(false)

	const [duplicates, setDuplicates] = useState<string[]>([])

	const getDuplicate = () => {
		if (duplicates.length) {
			duplicates.forEach(id => {
				removeDuplicate(id).then(error => console.log(error))
			})
		}
	}

	// useEffect(() => {
	// 	getDuplicate()
	// }, [duplicates])

	useEffect(() => {
		getDuplicate()
	}, [])

	const removeDuplicate = async (id: string) => {
		await axios.delete(
			`${CONTACT_FORM_BASE_URL}/contacts/${id}.json`
		).then(r => console.log(r))
	}

	const getUsers = async () => {
		const { data = {} } = await axios.get(`${CONTACT_FORM_BASE_URL}contacts.json`)
		const contacts: ContactsInterface[] = []

		if (data) {
			Object.keys(data).map((key) => {
				contacts.unshift({
					id: key,
					...data[key][0]
				})
			})

			const table: any = {}
			const duplicateId: string[] = []
			contacts.reverse().forEach((el: any) => {
				if (!(!table[el.email] && (table[el.email] = 1))) {
					duplicateId.push(el.id)
				} else if(!(!table[el.phone] && (table[el.phone] = 1))) {
					duplicateId.push(el.id)
				}
			})
			setDuplicates(duplicateId)

			setUsers(contacts.reverse())

			// setUsers(contacts.reverse().filter((elem: ContactsInterface, index: number, self: ContactsInterface[]) => self.findIndex(
			// 	(t: any) => {
			// 		return (t.email === elem.email || t.phone === elem.phone)
			// 	}) === index).reverse())
		}
	}

	const handleEmail = (value: string) => {
		setEmail(value)
	}

	const handlePassword = (value: string) => {
		setPassword(value)
	}

	const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
		setChecked(!checked)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (email === 'abt@mail.ru' && password === 'abt') {
			setShow(true)
			setShowError(false)

			if (checked) {
				localStorage.setItem('password', password)
				localStorage.setItem('email', email)
			}
		} else {
			setShowError(true)
		}
	}

	useEffect(() => {
		getUsers().then((e) => {
			if (e === undefined) return
			console.warn(e)
		})
	}, [])

	return (
		<div>
			{
				show ? <Table users={users} removeDuplicate={getDuplicate} /> :
					<Auth onChangeEmail={handleEmail} email={email} onChangePassword={handlePassword} password={password}
								handleSubmit={handleSubmit} handleChecked={handleChecked} checked={checked} error={showError} />
			}
		</div>
	)
}

export default Dashboard
