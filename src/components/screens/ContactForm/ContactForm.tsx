import React, { FC, useEffect, useState } from 'react'
import styles from './ContactForm.module.scss'
import Logo from '@/assets/images/logo.png'
import { ContactFormProps } from '@/components/screens/ContactForm/ContactForm.props'
import { Formik } from 'formik'
import { validationSchema } from '@/components/screens/ContactForm/schema'
import cn from 'classnames'
import { inputs } from '@/components/screens/ContactForm/data'
import Button from '@/components/ui/Button/Button'
import CustomSelectForm from '@/components/screens/ContactForm/CustomSelectForm/CustomSelectForm'
import {
	achievements,
	cities,
	consultantDepartment, defaultValue,
	educationProgram,
	formPayment,
	formStudy,
	institutions,
	institutionType,
	languages,
	regions,
	socialStatus
} from '@/components/screens/ContactForm/options'
import Htag from '@/components/Htag/Htag'
import ContactFormInput from '@/components/screens/ContactForm/ContactFormInput/ContactFormInput'
import axios from 'axios'
import { CONTACT_FORM_BASE_URL } from '@/configs/constants'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { Stack, TextField } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { Link, useNavigate } from 'react-router-dom'
import { ContactsInterface } from '@/shared/interfaces/contacts.interface'


const stylesSelect = {
	option: (provided: any) => ({
		...provided
	}),
	control: (provided: any) => ({
		...provided,
		minHeight: 41,
		border: '1px solid #e5e7eb',
		backgroundColor: '#fff'
	}),
	placeholder: (provided: any) => ({
		...provided,
		color: '#9ca3af'
	})
}

let options: any = {
	year: 'numeric',
	// month: 'long',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric'
}

const ContactForm: FC<ContactFormProps> = () => {
	const [selectRegion, setSelectRegion] = useState('')
	const [selectCity, setSelectCity] = useState('')
	const [selectInstitutionType, setSelectInstitutionType] = useState('')

	const [regionsData, setRegionsData] = useState<{ value: string, label: string }[]>([])
	const [institutionsData, setInstitutionsData] = useState<{ value: string, label: string }[]>([])

	const [contacts, setContacts] = useState<ContactsInterface[]>([])

	const navigate = useNavigate()

	const renderLabel = (name: string) => {
		switch (name) {
			case 'firstName':
				return '?????? (??????)*'
			case 'lastName':
				return '???????? (??????????????)*'
			case 'patronymic':
				return '???????????????? ?????? (????????????????)*'
			case 'email':
				return 'Email*'
			case 'phone':
				return '??????????????'
			default:
				return <></>
		}
	}

	const renderInputs = (
		values: any,
		handleChange: any,
		handleBlur: any,
		touched: any,
		errors: any
	) => {
		return inputs.map((input, idx) => {
			return (
				<div
					key={idx}
					className={cn(
						'w-full mb-4 relative',
						touched[input.name] && errors[input.name] && 'mb-8'
					)}
				>
					<p className={'w-full'}>
						<ContactFormInput
							className={styles.input}
							type={input.type}
							name={input.name}
							value={values[input.name]}
							placeholder={renderLabel(input.name)}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</p>
					{touched[input.name] && errors[input.name] && (
						<span className={styles.error}>{errors[input.name]}</span>
					)}
				</div>
			)
		})
	}

	// const [value, setValue] = useState<Dayjs | null>(dayjs('2006-08-18'))
	const [value, setValue] = useState<any>(dayjs('2006-08-18'))

	const handleChangeDatePicker = (newValue: Dayjs | null) => {
		setValue(newValue)
	}

	const getCitiesByRegion = async () => {
		if (selectRegion) {
			const { data } = await axios.get(`https://contact-form-2d4a6-default-rtdb.firebaseio.com/get_cities_by_region/${selectRegion}.json`)

			if (data) {
				const arr: { value: string, label: string }[] = []

				Object.keys(data).map(key => {
					if (data[key][1]) {
						arr.push(...data[key])
					} else {
						arr.push({
							...data[key][0]
						})
					}
				})

				setRegionsData(arr)
			}
		}
	}

	useEffect(() => {
		getCitiesByRegion().then(e => e !== undefined && console.log(e))
	}, [selectRegion])

	const getSchoolsByCity = async () => {
		if (selectCity && selectInstitutionType) {
			// console.log(`https://contact-form-2d4a6-default-rtdb.firebaseio.com/get_schools_by_city/${selectCity}/${selectInstitutionType}.json`)
			const { data } = await axios.get(`https://contact-form-2d4a6-default-rtdb.firebaseio.com/get_schools_by_city/${selectCity}/${selectInstitutionType}.json`)

			if (data) {
				const arr: { value: string, label: string }[] = []

				Object.keys(data).map((key) => {
					arr.push(
						...data[key]
					)
				})

				setInstitutionsData(arr)
			}
		}
	}

	useEffect(() => {
		getSchoolsByCity().then(e => e !== undefined && console.log(e))
		// console.log(selectCity)
	}, [selectCity, selectInstitutionType])

	const getContacts = async () => {
		const { data } = await axios.get(
			`${CONTACT_FORM_BASE_URL}/contacts.json`
		)

		const contactsData: ContactsInterface[] = []

		if (data) {
			Object.keys(data).map(key => {
				contactsData.push({
					id: key,
					...data[key][0]
				})
			})
			setContacts(contactsData)
		}
	}

	useEffect(() => {
		getContacts().then(e => e !== undefined && console.log(e))
	}, [])

	return (
		<>
			<div className={styles.main}>
				<div className={styles.main__row}>
					<h1 className={styles.main__title}>
						???????????????? ?????????????????????? ???????? ????????????????????/ ???????????? ???????????????? ????????????????????????????
						??????????????????????
					</h1>
					<p className={styles.main__text}>
						???????????? ???????????????????? ???????? ???????????? ?????????????? ?????????????? ?????????? / ?????? ????????????
						?????????????????? ???? ?????????????????????????? ????????????????*
					</p>
					<img className={styles.main__logo} src={Logo} alt='logo' />
				</div>
				<div className={styles.wrapper}>
					<div className={styles.ContactForm}>
						<div className={styles.body}>
							<Htag className={styles.title} tag={'h1'}>
								??????????????????????
							</Htag>
							<Formik
								initialValues={{
									firstName: '',
									lastName: '',
									patronymic: '',
									email: '',
									phone: '',
									socialStatus: '',
									regions: '',
									cities: '',
									institutionType: '',
									institutions: '',
									formStudy: '',
									educationProgram: '',
									achievements: '',
									formPayment: '',
									languages: '',
									consultantDepartment: '',
									yourQuestion: '',
									birthday: '',
									yourInstitution: ''
								}}
								onSubmit={async (values, { resetForm }) => {
									resetForm()
									const duplicateUser = contacts.find(contact => contact.phone.includes(values.phone) || contact.email.includes(values.email))

									if (!duplicateUser) {
										const data = {
											firstName:
												values.firstName.slice(0, 1).toUpperCase() +
												values.firstName.slice(1).toLowerCase(),
											lastName:
												values.lastName.slice(0, 1).toUpperCase() +
												values.lastName.slice(1).toLowerCase(),
											patronymic: values.patronymic.length
												? values.patronymic.slice(0, 1).toUpperCase() +
												values.patronymic.slice(1).toLowerCase()
												: '???? ??????????????',
											email: values.email.toLowerCase(),
											phone: values.phone,
											birthday: value ? value.$d.toLocaleString().slice(0, 10) : '???? ??????????????',
											socialStatus: values.socialStatus
												? values.socialStatus
												: '???? ??????????????',
											regions: values.regions ? values.regions : '???? ??????????????',
											cities: values.cities ? values.cities : '???? ??????????????',
											institutionType: values.institutionType
												? values.institutionType
												: '???? ??????????????',
											institutions: values.institutions
												? values.institutions
												: '???? ??????????????',
											formStudy: values.formStudy
												? values.formStudy
												: '???? ??????????????',
											educationProgram: values.educationProgram
												? values.educationProgram
												: '???? ??????????????',
											achievements: values.achievements
												? values.achievements
												: '???? ??????????????',
											formPayment: values.formPayment
												? values.formPayment
												: '???? ??????????????',
											languages: values.languages
												? values.languages
												: '???? ??????????????',
											consultantDepartment: values.consultantDepartment
												? values.consultantDepartment
												: '???? ??????????????',
											yourQuestion: values.yourQuestion
												? values.yourQuestion
												: '?????? ????????????????',
											yourInstitution: values.yourInstitution
												? values.yourInstitution
												: '?????????????? ?? ???????????????????? ????????????',
											created_at: new Date().toLocaleString('ru', options)
										}
										try {
											await axios.post(`${CONTACT_FORM_BASE_URL}contacts.json`, [
												data
											])
											await navigate('/successful-form')
											await resetForm()
										} catch (e) {
											console.warn(e)
										}

										return
									}
									navigate('/unsuccessful-form')
								}}
								validationSchema={validationSchema}
							>
								{({
										values,
										errors,
										touched,
										handleChange,
										handleBlur,
										isValid,
										handleSubmit,
										setFieldValue,
										dirty
									}) => (
									<form className={styles.form} onSubmit={handleSubmit}>
										{renderInputs(
											values,
											handleChange,
											handleBlur,
											touched,
											errors
										)}
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<Stack spacing={3} my={2.3}>
												<DesktopDatePicker
													label='???????? ????????????????'
													inputFormat='DD/MM/YYYY'
													value={value}
													onChange={handleChangeDatePicker}
													renderInput={(params) => (
														<TextField
															sx={{
																'& .MuiOutlinedInput-root': {
																	'& > fieldset': {
																		borderColor: '#e5e7eb'
																	}
																},
																input: {
																	fontFamily: 'Montserrat Alternates'
																},
																label: {
																	fontFamily: 'Montserrat Alternates',
																	backgroundColor: 'white',
																	fontSize: '16px',
																	color: '#374151'
																}
															}}
															{...params}
														/>
													)}
												/>
											</Stack>
										</LocalizationProvider>
										<CustomSelectForm
											styles={stylesSelect}
											className={cn('mb-4')}
											onChange={(value: { value: string; label: string }) =>
												setFieldValue('socialStatus', value.value)
											}
											options={socialStatus}
											value={values.socialStatus}
											placeholder={'???????????????????? ????????????'}
										/>
										<div
											className={cn(
												'w-full mb-4 relative',
												touched.regions && errors.regions && 'mb-8'
											)}>
											<CustomSelectForm
												styles={stylesSelect}
												className={'mb-0'}
												onChange={(value: { value: string; label: string }) => {
													setFieldValue('regions', value.label)
													setSelectRegion(value.value)
												}}
												options={regions}
												value={values.regions}
												placeholder={'?????????? (????????????)'}
											/>
											{touched.regions && errors.regions && (
												<span className={styles.error}>{errors.regions}</span>
											)}
										</div>

										<div className={cn(
											'w-full mb-4 relative',
											touched.cities && errors.cities && 'mb-8'
										)}>
											<CustomSelectForm
												styles={stylesSelect}
												className={'mb-0'}
												onChange={(value: { value: string; label: string }) => {
													setFieldValue('cities', value.label)
													setSelectCity(value.value)
												}}
												options={regionsData ? regionsData : defaultValue}
												value={values.cities}
												placeholder={'????????/????????/???????? (??????????/??????????????/????????)'}
											/>
											{touched.cities && errors.cities && (
												<span className={styles.error}>{errors.cities}</span>
											)}
										</div>

										<div className={cn(
											'w-full mb-4 relative',
											touched.institutionType && errors.institutionType && 'mb-8'
										)}>
											<CustomSelectForm
												styles={stylesSelect}
												className={'mb-0'}
												onChange={(value: { value: string; label: string }) => {
													setFieldValue('institutionType', value.label)
													setSelectInstitutionType(value.value)
												}}
												options={institutionType}
												value={values.institutionType}
												placeholder={'?????? ???????????????? ??????????????????'}
											/>
											{touched.institutionType && errors.institutionType && (
												<span className={styles.error}>{errors.institutionType}</span>
											)}
										</div>

										<div className={cn(
											'w-full mb-4 relative',
											touched.institutions && errors.institutions && 'mb-8'
										)}>
											<CustomSelectForm
												styles={stylesSelect}
												className={'mb-0'}
												onChange={(value: { value: string; label: string }) => {
													setFieldValue('institutions', value.value)
													// setSelectInstitutionType(value.value)
													// console.log(value.value)
												}}
												options={institutionsData ? institutionsData : defaultValue}
												value={values.institutions}
												placeholder={'?????? ???????? (?????????????? ??????????????????)'}
											/>
											{touched.institutions && errors.institutions && (
												<span className={styles.error}>{errors.institutions}</span>
											)}
										</div>

										<div
											className={cn(
												'w-full mb-4 relative',
												touched.yourInstitution && errors.yourInstitution && 'mb-8'
											)}
										>
											<p className={'w-full'}>
												<ContactFormInput
													className={cn(styles.input, 'min-h-[50px] h-full pt-0 pb-4')}
													type={'text'}
													name={'yourInstitution'}
													value={values.yourInstitution}
													placeholder={'???????? ?? ???????????? ???????? ?????????????????????? ???????? ?????????????? ?????????????????? ?????????????? ?????? ??????????'}
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</p>
											{touched.yourInstitution && errors.yourInstitution && (
												<span className={styles.error}>{errors['yourInstitution']}</span>
											)}
										</div>

										<div className={cn(
											'w-full mb-4 relative',
											touched.formStudy && errors.formStudy && 'mb-8'
										)}>
											<CustomSelectForm
												styles={stylesSelect}
												className={'mb-0'}
												onChange={(value: { value: string; label: string }) =>
													setFieldValue('formStudy', value.value)
												}
												options={formStudy}
												value={values.formStudy}
												placeholder={'?????? ???????? (?????????? ????????????????)'}
											/>
											{touched.formStudy && errors.formStudy && (
												<span className={styles.error}>{errors.formStudy}</span>
											)}
										</div>

										<CustomSelectForm
											styles={stylesSelect}
											className={'mb-4'}
											onChange={(value: { value: string; label: string }) =>
												setFieldValue('educationProgram', value.value)
											}
											options={educationProgram}
											value={values.educationProgram}
											placeholder={
												'?????????????????? ?????????? ???????? ???????????????????????? (???????????????????????????? ???????????? ?????????????????????????????? ????????????????)'
											}
										/>
										<CustomSelectForm
											styles={stylesSelect}
											className={'mb-4'}
											onChange={(value: { value: string; label: string }) =>
												setFieldValue('achievements', value.value)
											}
											options={achievements}
											value={values.achievements}
											placeholder={'?????????????? ?? ????????????????????'}
										/>
										<CustomSelectForm
											styles={stylesSelect}
											className={'mb-4'}
											onChange={(value: { value: string; label: string }) =>
												setFieldValue('formPayment', value.value)
											}
											options={formPayment}
											value={values.formPayment}
											placeholder={
												'???????????????????????????? ?????????? ???????????? ???? ???????????????? ?? ????????'
											}
										/>

										<div className={cn(
											'w-full mb-4 relative',
											touched.languages && errors.languages && 'mb-8'
										)}>
											<CustomSelectForm
												styles={stylesSelect}
												className={'mb-0'}
												onChange={(value: { value: string; label: string }) =>
													setFieldValue('languages', value.value)
												}
												options={languages}
												value={values.languages}
												placeholder={'?????? ???????? (???????? ????????????????)'}
											/>
											{touched.languages && errors.languages && (
												<span className={styles.error}>{errors.languages}</span>
											)}
										</div>

										<div className={cn(
											'w-full mb-4 relative',
											touched.consultantDepartment && errors.consultantDepartment && 'mb-8'
										)}>
											<CustomSelectForm
												styles={stylesSelect}
												className={'mb-0'}
												onChange={(value: { value: string; label: string }) =>
													setFieldValue('consultantDepartment', value.value)
												}
												options={consultantDepartment}
												value={values.consultantDepartment}
												placeholder={
													'??????????????-?????????????????????? - ???? ???????? ???????????????? ???????????????????? ?? ????????)'
												}
											/>
											{touched.consultantDepartment && errors.consultantDepartment && (
												<span className={styles.error}>{errors.consultantDepartment}</span>
											)}
										</div>

										<textarea
											id='message'
											className={styles.textarea}
											name={'yourQuestion'}
											value={values.yourQuestion}
											onChange={handleChange}
											onBlur={handleBlur}
											placeholder='???????????? ??????????/?????????? (?????? ????????????/??????????)'
										></textarea>

										<Button
											className={'w-full'}
											appearance={isValid && dirty ? 'green' : 'red'}
											rounded={'rounded'}
											type={'submit'}
										>
											????????????????????????????????????
										</Button>
									</form>
								)}
							</Formik>
						</div>
					</div>
					<div className={styles.info}>
						<h3 className={styles.info__title}>?????????????????????????????? ??????????????????</h3>
						<div className={styles.info__row}>
							<Link
								className={styles.info__link}
								to={'/educational-programs/bakalavriat/educational-subcategory'}
							>
								??????????????????????
							</Link>
							<Link
								className={styles.info__link}
								to={
									'/educational-programs/magistratura/educational-subcategory'
								}
							>
								????????????????????????
							</Link>
							<Link
								className={styles.info__link}
								to={
									'/educational-programs/doktorantura/educational-subcategory'
								}
							>
								????????????????????????
							</Link>
						</div>
					</div>
				</div>
				<ul className={styles.form__info}>
					<li className={styles.info__item}>
						?????????? ??????????????????????, ?? ???????????? ???????????????? ?????? ?????????? ???????????????? ??????????
						?????????????????????????????? ????????????????, ?????????? ???? ?????????????????? ??????
					</li>
					<li className={styles.info__item}>
						1. ??????????????????????: ?????????? ???? ?????????????????????????????? ????????????????????, ?????????? ????
						?????????????????? ??????
					</li>
					<li className={styles.info__item}>
						2. ????????????????????????: ?????????? ???? ???????????????????????? ??????????, ?????????? ???? ???????????????????? ??
						????????????????, ?????????? ???? ????????.??????????????????????
					</li>
					<li className={styles.info__item}>
						3. ????????????????????????: ?????????? ???? ???????????????????? ?? ????????????????, ?????????? ????
						????????.??????????????????????
					</li>
				</ul>
			</div>
		</>
	)
}

export default ContactForm
