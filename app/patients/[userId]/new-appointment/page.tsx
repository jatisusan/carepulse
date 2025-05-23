import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

const NewAppointment = async ({params}: SearchParamProps) => {

  const { userId } = await params;
  const patient = await getPatient(userId);

	return (
		<div className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container">
				<div className="sub-container max-w-[760px]">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="logo"
						width={1000}
						height={1000}
						className="w-fit h-8 mb-12"
          />
          
          <AppointmentForm type='create' userId={userId} patientId={patient.$id}  />

					<p className="copyright mt-10 py-12">© 2025 CarePulse</p>
				</div>
			</section>

			<Image
				src={"/assets/images/appointment-bg.jpg"}
				width={1000}
				height={1000}
				alt="doctor"
				className="side-img max-w-[390px]"
			/>
		</div>
	);
};

export default NewAppointment;
