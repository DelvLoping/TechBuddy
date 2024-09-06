import { getFullNames } from "@/utils";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Navbar = () => {
  const router = useRouter();
  const useReducer = useSelector((state) => state.user);
  const { user } = useReducer || {};
  const fullName = getFullNames(user);
  return (
    <div className="fixed bg-white flex justify-between items-center shadow-md p-4 rounded-lg w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] top-6 left-4 lg:left-8 border border-gray-200">
      <FaHome
        onClick={() => router.push("/")}
        className="cursor-pointer text-primary text-2xl"
      />
      <h1 className="text-lg font-semibold opacity-80">Welcome, {fullName}</h1>
      <FaPowerOff
        onClick={() => router.push("/logout")}
        className="cursor-pointer text-danger text-2xl"
      />
    </div>
  );
};
export default Navbar;
