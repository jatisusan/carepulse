import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Success = async ({ params, searchParams }: SearchParamProps) => {
	const { userId } = await params;
	const sparams = await searchParams;
	const appointmentId = (sparams.appointmentId as string) || "";

	const appointment = await getAppointment(appointmentId);

	const doctor = Doctors.find(
		(doc) => doc.name === appointment.primaryPhysician
	);

	return (
		<div className="flex h-screen max-h-screen px-[5%]">
			<div className="success-img">
				<Link href="/">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="logo"
						height={1000}
						width={1000}
						className="w-fit h-8"
					/>
				</Link>

				<section className="flex flex-col items-center">
					<Image
						src={"/assets/gifs/success.gif"}
						width={280}
						height={300}
						alt="success"
					/>
					<h2 className="header mb-6 text-center max-w-[600px]">
						Your <span className="text-green-500">appointment request</span> has
						been successfully submitted!
					</h2>
					<p>We will be in touch shortly to confirm.</p>
				</section>

				<section className="request-details">
					<p>Requested appointment details:</p>

					<div className="flex items-center gap-3">
						<Image
							src={doctor?.image!}
							alt={"doctor"}
							width={100}
							height={100}
							className="size-6"
						/>

						<p className="whitespace-nowrap">Dr. {doctor?.name} </p>
					</div>
					<div className="flex gap-2">
						<Image
							src={"/assets/icons/calendar.svg"}
							alt={"calendar"}
							width={24}
							height={24}
						/>
						<p>{formatDateTime(appointment.schedule).dateTime}</p>
					</div>
				</section>

				<Button className="shad-primary-btn" asChild>
					<Link href={`/patients/${userId}/new-appointment`}>
						New Appointment
					</Link>
				</Button>

				<p className="copyright">© 2024 CarePluse</p>
			</div>
		</div>
	);
};

export default Success;
