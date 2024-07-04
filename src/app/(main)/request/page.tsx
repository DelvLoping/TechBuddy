"use client";

import HelpRequest from "@/app/component/form/HelpRequest";

export default function Page() {
 

  return (
    <div className="flex flex-col items-center gap-5 w-full p-4 px-10 md:px-20 h-full mb-10">
      <h1 className="text-4xl font-bold text-secondary">Request</h1>
      <p>Need Help</p>
      <HelpRequest/>
    </div>
  );
}
