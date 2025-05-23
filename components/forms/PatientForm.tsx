"use client";

import {  z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";



export enum FormFieldType {
	INPUT = "input",
	TEXTAREA = "textarea",
	PHONE_INPUT = "phoneInput",
	CHECKBOX = "checkbox",
	DATE_PICKER = "datePicker",
	SELECT = "select",
	SKELETON = "skeleton",
}

const PatientForm = () => {

	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	// 1. Define your form.
	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof UserFormValidation>) {
		setIsLoading(true);

		try {
			const userData = {
				name: values.name,
				email: values.email,
				phone: values.phone,
			}

			const user = await createUser(userData);

			if (user) router.push(`/patients/${user.$id}/register`);
		} catch (error) {
			console.error("Error creating user:", error);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				<section className="mb-12 space-y-3">
					<h1 className="header">Hi there 👋</h1>
					<p className="text-dark-700">Schedule your first appointment.</p>
				</section>

				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name="name"
					label="Full Name"
					placeholder="John Doe"
					iconSrc="/assets/icons/user.svg"
					iconAlt="user"
				/>
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name="email"
					label="Email"
					placeholder="johndoe@example.com"
					iconSrc="/assets/icons/email.svg"
					iconAlt="email"
				/>
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.PHONE_INPUT}
					name="phone"
					label="Phone Number"
					placeholder="(123) 456-7890"
				/>

				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default PatientForm;
