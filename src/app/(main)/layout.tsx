"use client";
import { setJWT } from "@/lib/redux/slices/user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHome } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";
import moment from "moment";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const useReducer = useSelector((state) => state.user);
  const { jwt: jwtRedux } = useReducer;
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !jwtRedux) {
      dispatch(setJWT(jwt));
    }
    if (pathname === "/login" || pathname === "/register") {
      if (jwt) {
        router.push("/");
      }
    } else {
      if (!jwt) {
        router.push("/login");
      }
    }
  }, [useReducer, pathname]);

  const navbarVisible =
    pathname !== "/login" && pathname !== "/register" && pathname !== "/logout";

  const pathSegments = pathname.split("/").filter((segment) => segment);

  const renderBreadcrumb = () => {
    if (pathSegments.length < 2) return null;

    const breadcrumb = pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const isLast = index === pathSegments.length - 1;
      return (
        <span
          key={href}
          className={`mr-2 text-primary ${isLast && "font-bold"}`}
        >
          {!isLast ? (
            <a href={href} className="hover:underline">
              {segment}
            </a>
          ) : (
            segment
          )}
          {!isLast && " / "}
        </span>
      );
    });

    return (
      <div className="w-full flex flex-row items-start ms-2 mb-4">
        {breadcrumb}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {navbarVisible && (
        <div className="fixed bg-white flex justify-between items-center shadow-md p-4 rounded-lg w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] top-6 left-4 lg:left-8 border border-gray-200">
          <FaHome
            onClick={() => router.push("/")}
            className="cursor-pointer text-primary text-2xl"
          />
          <FaPowerOff
            onClick={() => router.push("/logout")}
            className="cursor-pointer text-danger text-2xl"
          />
        </div>
      )}
      <div
        className={`flex justify-center items-center flex-col h-full p-4 lg:p-8 ${
          navbarVisible && "!pt-24"
        }`}
      >
        {renderBreadcrumb()}
        {children}
      </div>
      <footer
        className={`${
          !navbarVisible && "hidden"
        } w-full bg-primary border-t border-gray-200 p-4 text-center mt-auto`}
      >
        <p className="text-white">TechBuddy © {moment().format("YYYY")}</p>
      </footer>
    </div>
  );
}
