import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
	
	const sparams = await searchParams;
	const isAdmin = sparams.admin === "true";

	return (
		<div className="flex h-screen max-h-screen">

			{isAdmin && <PasskeyModal />}

			<section className="remove-scrollbar container">
				<div className="sub-container max-w-[496px]">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="logo"
						width={1000}
						height={1000}
						className="w-fit h-8 mb-12"
					/>

					<PatientForm />

					<div className="text-14-regular mt-20 flex justify-between">
						<p className="text-dark-600 xl:text-left">© 2025 CarePulse</p>
						<Link href={"/?admin=true"} className="text-green-500">
							Admin
						</Link>
					</div>
				</div>
			</section>

			<Image
				src={"/assets/images/onboarding-img.jpg"}
				width={1000}
				height={1000}
				alt="doctor"
				className="side-img max-w-[50%]"
			/>
		</div>
	);
}
