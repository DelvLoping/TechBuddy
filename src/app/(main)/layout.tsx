"use client";
import { setJWT } from "@/lib/redux/slices/user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

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

  return <>{children}</>;
}
