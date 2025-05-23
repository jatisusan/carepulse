"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { registerPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({ user }: { user: User }) => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	// 1. Define your form.
	const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
	defaultValues: {
	  ...PatientFormDefaultValues,
	  name: user.name,
	  email: user.email,
	  phone: user.phone,
	},
  });

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
		setIsLoading(true);

		// Store file info in form data as
		let formData;
		if (values.identificationDocument && values.identificationDocument.length > 0) {
			const blobFile = new Blob([values.identificationDocument[0]], {
				type: values.identificationDocument[0].type,
			});
			formData = new FormData();
			formData.append('blobFile', blobFile);
			formData.append('fileName', values.identificationDocument[0].name);
		}

		try {
			const patientData = {
				...values,
				userId: user.$id,
				identificationDocument: formData,
				birthDate: new Date(values.birthDate)
			}

			// @ts-ignore
			const patient = await registerPatient(patientData);

			if (patient) router.push(`/patients/${user.$id}/new-appointment`);
		} catch (error) {
			console.error("Error creating user:", error);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-12 flex-1"
			>
				<section className="space-y-4">
					<h1 className="header">Welcome 👋</h1>
					<p className="text-dark-700 mb-12">
						Let us know more about yourself.
					</p>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Personal Information</h2>
					</div>

					{/* NAME */}
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="name"
						label="Full name"
						placeholder="John Doe"
						iconSrc="/assets/icons/user.svg"
						iconAlt="user"
					/>

					{/* EMAIL & PHONE */}
					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="email"
							label="Email address"
							placeholder="johndoe@gmail.com"
							iconSrc="/assets/icons/email.svg"
							iconAlt="email"
						/>

						<CustomFormField
							fieldType={FormFieldType.PHONE_INPUT}
							control={form.control}
							name="phone"
							label="Phone number"
							placeholder="(555) 123-4567"
						/>
					</div>

					{/* DOB & GENDER */}
					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="birthDate"
							label="Date of Birth"
						/>

						<CustomFormField
							fieldType={FormFieldType.SKELETON}
							control={form.control}
							name="gender"
							label="Gender"
							renderSkeleton={(field) => (
								<FormControl>
									<RadioGroup
										defaultValue={field.value}
										onValueChange={field.onChange}
										className="flex gap-6 h-11 xl:justify-between"
									>
										{GenderOptions.map((option) => (
											<div key={option} className="radio-group">
												<RadioGroupItem value={option} id={option} />
												<Label htmlFor={option} className="cursor-pointer">
													{option}
												</Label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
							)}
						/>
					</div>

					{/* ADDRESS & OCCUPATION */}
					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="address"
							label="Address"
							placeholder="15 New Road, Kathmandu, 44600"
						/>

						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="occupation"
							label="Occupation"
							placeholder="Software Engineer"
						/>
					</div>

					{/* EMERGENCY CONTACT NAME & PHONE */}
					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="emergencyContactName"
							label="Emergency contact name"
							placeholder="Guardian's Name"
						/>

						<CustomFormField
							fieldType={FormFieldType.PHONE_INPUT}
							control={form.control}
							name="emergencyContactNumber"
							label="Emergency contact number"
							placeholder="(555) 123-4567"
						/>
					</div>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Medical Information</h2>
					</div>

					<CustomFormField
						fieldType={FormFieldType.SELECT}
						control={form.control}
						name="primaryPhysician"
						label="Primary physician"
						placeholder="Select a physician"
					>
						{Doctors.map((doctor) => (
							<SelectItem
								key={doctor.name}
								value={doctor.name}
								className="cursor-pointer"
							>
								<div className="flex items-center gap-2">
									<Image
										src={doctor.image}
										alt={doctor.name}
										width={32}
										height={32}
										className="rounded-full border border-dark-500"
									/>
									<p>{doctor.name}</p>
								</div>
							</SelectItem>
						))}
					</CustomFormField>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="insuranceProvider"
							label="Insurance provider"
							placeholder="e.g. Nepal Life Insurance"
						/>

						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="insurancePolicyNumber"
							label="Insurance policy number"
							placeholder="e.g. ABC123456789"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="allergies"
							label="Allergies (if any)"
							placeholder="e.g. Peanuts, Penicillin"
						/>

						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="currentMedication"
							label="Current medication (if any)"
							placeholder="e.g. Aspirin, Ibuprofen"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="familyMedicalHistory"
							label="Family medical history (if relevant)"
							placeholder="e.g. Hypertension(father)"
						/>

						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="pastMedicalHistory"
							label="Past medical history (if relevant)"
							placeholder="e.g. Appendectomy (2019), Asthma"
						/>
					</div>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Identification and Verification</h2>
					</div>

					<CustomFormField
						fieldType={FormFieldType.SELECT}
						control={form.control}
						name="identificationType"
						label="Identification type"
						placeholder="Select an identification type"
					>
						{IdentificationTypes.map((type) => (
							<SelectItem key={type} value={type} className="cursor-pointer">
								{type}
							</SelectItem>
						))}
					</CustomFormField>

					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="identificationNumber"
						label="Identification number"
						placeholder="e.g. 123456789"
					/>

					<CustomFormField
						fieldType={FormFieldType.SKELETON}
						control={form.control}
						name="identificationDocument"
						label="Scanned copy of identification document"
						renderSkeleton={(field) => (
							<FormControl>
								<FileUploader files={field.value} onChange={field.onChange} />
							</FormControl>
						)}
					/>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Consent and Privacy</h2>
					</div>

					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="treatmentConsent"
						label="I consent to recieiving treatment from the healthcare provider."
					/>
					
					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="disclosureConsent"
						label="I consent to the disclosure of my personal information for the purpose of treatment."
					/>
					
					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="privacyConsent"
						label="I acknowledge that I have reviewed and agree to the privacy policy."
					/>
				</section>

				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default RegisterForm;
