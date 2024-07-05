"use client";
import { setJWT } from "@/lib/redux/slices/user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { FaHome } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";

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
  }, [useReducer]);

  return (
    <>
      {pathname !== "/login" &&
      pathname !== "/register" &&
      pathname !== "/logout" ? (
        <div className="flex justify-between items-center">
          <FaHome
            onClick={() => router.push("/")}
            className="cursor-pointer text-primary text-2xl"
          />
          <FaPowerOff
            onClick={() => router.push("/logout")}
            className="cursor-pointer text-danger text-2xl"
          />
        </div>
      ) : (
        <div className="pb-2" />
      )}
      {children}
    </>
  );
}
