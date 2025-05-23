"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Dispatch, SetStateAction, useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
	createAppointment,
	updateAppointment,
} from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({
	type,
	userId,
	patientId,
	appointment,
	setOpen,
}: {
	type: "create" | "cancel" | "schedule";
	userId: string;
	patientId: string;
	appointment?: Appointment;
	setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const AppointmentFormValidation = getAppointmentSchema(type);

	// 1. Define your form.
	const form = useForm<z.infer<typeof AppointmentFormValidation>>({
		resolver: zodResolver(AppointmentFormValidation),
		defaultValues: {
			primaryPhysician: appointment ? appointment?.primaryPhysician : "",
			schedule: appointment
				? new Date(appointment?.schedule!)
				: new Date(Date.now()),
			reason: appointment ? appointment.reason : "",
			note: appointment?.note || "",
			cancellationReason: appointment?.cancellationReason || "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
		setIsLoading(true);

		let status;
		switch (type) {
			case "schedule":
				status = "scheduled";
				break;
			case "cancel":
				status = "cancelled";
				break;
			default:
				status = "pending";
		}

		try {
			if (type === "create" && patientId) {
				const appointmentData = {
					userId,
					patient: patientId,
					primaryPhysician: values.primaryPhysician,
					schedule: new Date(values.schedule),
					reason: values.reason!,
					note: values.note,
					status: status as Status,
				};
				const appointment = await createAppointment(appointmentData);

				if (appointment) {
					form.reset();
					router.push(
						`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
					);
				}
			} else {
				const appointmentToUpdate = {
					userId,
					appointmentId: appointment?.$id!,
					appointment: {
						primaryPhysician: values.primaryPhysician,
						schedule: values.schedule,
						status: status as Status,
						cancellationReason: values.cancellationReason,
					},
					type,
				};

				const updatedAppointment = await updateAppointment(appointmentToUpdate);

				if (updatedAppointment) {
					setOpen && setOpen(false);
					form.reset();
				}
			}
		} catch (error) {
			console.error("Error creating user:", error);
		}
	}

	let buttonLabel;
	switch (type) {
		case "cancel":
			buttonLabel = "Cancel Appointment";
			break;
		case "schedule":
			buttonLabel = "Schedule Appointment";
			break;
		default:
			buttonLabel = "Submit Appointment";
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				{type === "create" && (
					<section className="mb-12 space-y-3">
						<h1 className="header">New Appointment</h1>
						<p className="text-dark-700">
							Request an appointment in just a few clicks.
						</p>
					</section>
				)}

				{type !== "cancel" && (
					<>
						<CustomFormField
							fieldType={FormFieldType.SELECT}
							control={form.control}
							name="primaryPhysician"
							label="Doctor"
							placeholder="Select a doctor"
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

						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="schedule"
							label="Expected appointment date"
							showTimeSelect
							dateFormat="MM/dd/yyyy - h:mm aa"
						/>

						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="reason"
							label="Reason for visit"
							placeholder="e.g. Annual checkup"
						/>

						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="note"
							label="Additional notes"
							placeholder="Extra details (if any)"
						/>
					</>
				)}

				{type === "cancel" && (
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="cancellationReason"
						label="Reason for cancellation"
						placeholder="e.g. Urgent meeting came up"
					/>
				)}

				<SubmitButton
					isLoading={isLoading}
					className={`${
						type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
					} w-full`}
				>
					{buttonLabel}
				</SubmitButton>
			</form>
		</Form>
	);
};

export default AppointmentForm;
