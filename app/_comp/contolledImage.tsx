import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, StepBackIcon, X } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

const ContolledImage = ({
  orginalUrl,
  setSelectedImageBlob,
  setSelectedImageFile,
  selectedImageBlob,
  className,
}: {
  orginalUrl?: string;
  className: string;
  selectedImageBlob: string;
  setSelectedImageBlob: React.Dispatch<React.SetStateAction<string>>;
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleInputChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageBlob(URL.createObjectURL(e.target.files[0]));
      setSelectedImageFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div
        // type='button'
        role="button"
        onClick={() => inputImageRef.current?.click()}
        className={
          "  relative flex items-center justify-center w-full h-full " +
          className
        }
      >
        <Input
          ref={inputImageRef}
          onChange={handleInputChangeImage}
          id="image-Service-uploader"
          type="file"
          className="hidden"
        />
        {selectedImageBlob ? (
            
          <Image
            src={selectedImageBlob || "/placeholder.svg"}
            alt="Service Image"
            width={500}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <Plus className="text-muted-foreground w-12 h-12" />
        )}

        {(!selectedImageBlob && orginalUrl ) || ( orginalUrl !== selectedImageBlob) ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (orginalUrl) {
                setSelectedImageBlob(orginalUrl);
                setSelectedImageFile(null);
              }
            }}
            className="  shadow cursor-pointer z-20 w-8 h-8 absolute top-5 left-2 -translate-y-1/2 bg-primary rounded-md flex items-center justify-center text-emerald-600  hover:bg-emerald-600 hover:text-primary-foreground transition-all duration-300"
          >
            <StepBackIcon className="h-4 w-4" />
          </button>
        ) : null}

        {selectedImageBlob && (
          <div className="absolute top-1 right-1">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedImageFile(null);
                setSelectedImageBlob("");
              }}
              className="cursor-pointer"
              size={"sm"}
              variant={"destructive"}
            >
              <X className=" w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ContolledImage;
