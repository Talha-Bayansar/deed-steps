import { generateArray } from "@/lib/utils";
import { FormFieldSkeleton } from "./form-field-skeleton";
import { ButtonSkeleton } from "./button-skeleton";

export const AppFormSkeleton = () => {
  return (
    <form className="flex flex-col flex-grow w-full max-w-2xl justify-between md:justify-start gap-8">
      <div className="flex flex-col gap-8">
        {generateArray(3).map((item) => (
          <FormFieldSkeleton key={item} />
        ))}
      </div>
      <ButtonSkeleton />
    </form>
  );
};
