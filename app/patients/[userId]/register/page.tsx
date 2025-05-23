import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

const Register = async ({ params }: SearchParamProps) => {
	const { userId } = await params;
	const user = await getUser(userId);

	return (
		<div className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container">
				<div className="sub-container max-w-[760px] flex-1 flex-col py-10">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="logo"
						width={1000}
						height={1000}
						className="w-fit h-8 mb-12"
					/>

					<RegisterForm user={user} />

					<p className="copyright py-12">© 2025 CarePulse</p>
				</div>
			</section>

			<Image
				src={"/assets/images/register.jpg"}
				width={1000}
				height={1000}
				alt="doctor"
				className="side-img max-w-[390px]"
			/>
		</div>
	);
};

export default Register;
