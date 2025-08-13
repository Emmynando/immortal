import EncryptPreview from "../EncryptPreview";
import BankAppCredentials from "./BankApp-credentials";

import { useState } from "react";
export default function BankAppIndex() {
  const [currentView, setCurrentView] = useState<
    "preview" | "bank-app-encryption"
  >("preview");

  // Mapping view name → component
  const viewMap = {
    preview: EncryptPreview,
    "bank-app-encryption": BankAppCredentials,
  } as const;

  // Get the component from the map (default to preview if not found)
  const ComponentToRender = viewMap[currentView] || EncryptPreview;

  return (
    <main>
      <ComponentToRender setCurrentView={setCurrentView} />
    </main>
  );
}

// export default function BankAppIndex() {
//   const currentView: "preview" | "bank-app-encryption" = "preview";

//   const renderComp = () => {
//     switch (currentView as string) {
//       case "preview":
//         return <EncryptPreview />;

//       case "bank-app-encryption":
//         return <BankAppCredentials />;
//       default:
//         return <EncryptPreview />;
//     }
//   };
//   return <main>{renderComp()}</main>;
// }
