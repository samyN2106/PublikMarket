"use client";
import { useDashboardContext } from "@/Context/dashboardContext";

export default function NavbarDashboard() {
  const { showSidebar, setShowSidebar } = useDashboardContext();
  return !showSidebar ? (
    <div onClick={() => setShowSidebar(true)} className="min-[1100px]:hidden">
      <span className={"cursor-pointer"}>
        <svg
          className={`size-9 `}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.9}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </span>
    </div>
  ) : (
    ""
  );
}
