import {
  CheckCircleIcon,
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
  CreditCardIcon,
  BellAlertIcon,

  ShoppingCartIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";

export const ordersOverviewData = [
  {
    icon: PlusCircleIcon,
    color: "text-green-500",
    title: "New Orders:",
    description: "22 DEC 7:20 PM",
  },
  {
    icon: CheckCircleIcon,
    color: "text-red-500",
    title: "Review Orders:",
    description: "21 DEC 11 PM",
  },
  {
    icon: ArrowTopRightOnSquareIcon,
    color: "text-blue-500",
    title: "Processing Orders:",
    description: "21 DEC 9:34 PM",
  },
  {
    icon: BellAlertIcon,
    color: "text-orange-500",
    title: "Completed Orders:",
    description: "20 DEC 2:20 AM",
  },
  {
    icon: ShoppingCartIcon,
    color: "text-pink-500",
    title: "Pick-Up Orders:",
    description: "18 DEC 4:54 AM",
  },
  {
    icon: CreditCardIcon,
    color: "text-blue-gray-900",
    title: "Deleivery Orders:",
    description: "17 DEC",
  },
];

export default ordersOverviewData;
