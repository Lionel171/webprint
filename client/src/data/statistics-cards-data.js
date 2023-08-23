import {
  BanknotesIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";


export const statisticsCardsData = [
  {
    color: "blue",
    icon: BanknotesIcon,
    title: "Today's Sales",
    value: "$53k",
  },
  {
    color: "yellow",
    icon: CurrencyDollarIcon,
    title: "Total Sales",
    value: "$53k",
  },
  {
    color: "pink",
    icon: ShoppingCartIcon,
    title: "Today's Orders",
    value: "",
  },
  {
    color: "green",
    icon: UserPlusIcon,
    title: "New Customers",
    value: "",

  },
  {
    color: "orange",
    icon: ChartBarIcon,
    title: "Today's Completed Orders",
    value: "",
  },
];

export default statisticsCardsData;
