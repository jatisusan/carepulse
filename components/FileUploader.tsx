"use client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
	files: File[] | undefined;
	onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
	const onDrop = useCallback((acceptedFiles: File[]) => {
		// Do something with the files
		onChange(acceptedFiles);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} className="file-upload">
			<input {...getInputProps()} />
			{files && files.length > 0 ? (
				<Image
					src={convertFileToUrl(files[0])}
					alt="Uploaded file"
					width={1000}
					height={1000}
					className="max-h-[400px] overflow-hidden object-cover"
				/>
			) : (
				<>
					<Image
						src={"/assets/icons/upload.svg"}
						alt="Upload"
						width={40}
						height={40}
					/>
                        <div className="file-upload_label">
                            <p className="text-14-regular">
                                <span className="text-primary-500">Click to upload</span>
                                or drag and drop
                            </p>
                            <p className="text-12-regular">
                                PNG, JPG or SVG
                            </p>
                    </div>
				</>
			)}
		</div>
	);
};

export default FileUploader;
