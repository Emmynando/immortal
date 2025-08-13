import type { Dispatch, SetStateAction } from "react";

interface EncryptPreviewInterface {
  setCurrentView: Dispatch<SetStateAction<"preview" | "bank-app-encryption">>;
}

export default function EncryptPreview({
  setCurrentView,
}: EncryptPreviewInterface) {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <section className="bg-[#f9ffff] w-[60%] p-2 rounded-md shadow-[inset_0_0_15px_0_rgb(199,199,199)]">
        <h2 className="mb-4 font-bold">
          Let's Encrypt Your Bank App Login Credentials
        </h2>
        <div className="space-y-2  ">
          <p>
            Important information about your logins will be encrypted, this will
            not be visible to anyone except the recipient but, until the day of
            release.
          </p>

          <p>
            Once encrypted, encrypted files cannot be edited rather, the file
            will be replaced
          </p>

          <p className="font-medium mt-2">
            Files that will be encrypted inlcudes:
          </p>
          <ul className="space-y-1 italic font-normal list-disc ml-4">
            <li>Bank-Login Password</li>
            <li>Transfer Pin</li>
            <li>
              Extra Note (Additional Information) that you think will be
              neccessary for the recpient to note
            </li>
          </ul>

          <p>
            On the day of release, the encrypted key will be sent to the
            recipient via email which will need to be decrypted before use and
            the decrypted key will be used to decrypt the listed encrypted files
          </p>

          <p> For further questions or enquiry, kndly contact support </p>
          <button
            onClick={() => setCurrentView("bank-app-encryption")}
            className="w-max ml-auto bg-black text-white px-2 rounded-md "
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
