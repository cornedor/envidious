import Image from "next/image";
import BrowserLayout from "./(browser)/layout";

export default function Custom404() {
  return (
    <BrowserLayout>
      <div className="p-4">
        <h1 className="text-2xl">404 - Page not found</h1>
        <p>The page or video cannot be found or is no longer available.</p>
        <Image
          src="/undraw_cat_epte.svg"
          width={888}
          height={342}
          alt=""
          className="w-96 pt-10"
        />
      </div>
    </BrowserLayout>
  );
}
