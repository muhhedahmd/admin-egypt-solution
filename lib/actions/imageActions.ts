"use server";

import { UTApi } from "uploadthing/server";

import { UploadFileResult } from "uploadthing/types";
const utapi = new UTApi();

interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Delete image from UploadThing
 * @param fileKey - The file key returned from upload
 * @returns Delete response
 */
export async function deleteImage(fileKey: string): Promise<DeleteResponse> {

  try {
    if (!fileKey) {
      return {
        success: false,
        error: "File key is required",
      };
    }

    await utapi.deleteFiles(fileKey);

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}

export const UploadImage = async (logo: Buffer | null, name?: string) => {
  let logoUpload: {
    data: UploadFileResult[];
  } | null = null;
  if (logo) {
    try {
  
      const buffer = Buffer.from(logo);

      const logoBlob = new Blob([buffer], { type: "image/jpeg" });
      const logoFile = new File([logoBlob], name || "logo.jpg", {
        type: "image/jpeg",
      });

      const uploadResult = await utapi.uploadFiles([logoFile]);

      logoUpload = {
        data: uploadResult,
      };

      return logoUpload;
    } catch (uploadError) {
      console.error("Logo upload failed:", uploadError);
      throw uploadError;
    }
  }
};