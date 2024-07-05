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
    console.log('jwt',jwt)
    if (pathname !== "/login" && pathname !== "/register") {
      if (jwt && !jwtRedux) {
        dispatch(setJWT(jwt));
      } else if (!jwt) {
        router.push("/login");
      }
    } else {
      if (jwt && jwtRedux) {
        router.push("/");
      }
    }
  }, [useReducer]);

  return <>{children}</>;
}
