import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  UserGroupIcon,
  HomeModernIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/solid";
import {
  Home,
  Profile,
  Productions,
  Orders,
  Customers,
  Users,
  Department,
  Payments,
  Notifications,
} from "@/pages/dashboard";
import {
  UserEdit
} from "@/pages/dashboard/users/edit";

import Chat from "@/pages/chat/Home";

import {
  CustomerEdit
} from "@/pages/dashboard/customers/edit";
import { SignIn, SignUp } from "@/pages/auth";
import OrderEdit from "./pages/dashboard/orders/edit";
import OrderView from "./pages/dashboard/orders/view";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "Main pages",
    layout: "dashboard",
    role: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Invoice generator",
      //   path: "/invocies",
      //   element: <Invoices />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "payments",
      //   path: "/payments",
      //   element: <Payments />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "productions",
      //   path: "/productions",
      //   element: <Productions />,
      // },
      {
        icon: <HomeModernIcon {...icon} />,
        name: "staff management",
        path: "/users",
        element: <Users />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "customers",
        path: "/customers",
        element: <Customers />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Department",
        path: "/department",
        element: <Department />,
      },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  // {
  //   title: "",
  //   layout: "other",
  //   role: "admin",
  //   pages: [
  //     {
  //       // name: "user edit",
  //       path: "/users/edit/:id",
  //       element: <UserEdit />,
  //     },
  //     {
  //       // name: "user edit",
  //       path: "/customers/edit/:id",
  //       element: <CustomerEdit />,
  //     },
  //     {
  //       // name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //     {
  //       // name: "order add",
  //       path: "/orders/edit",
  //       element: <OrderEdit />,
  //     },
  //     {
  //       // name: "order add",
  //       path: "/orders/view",
  //       element: <OrderView />,
  //     },
  //   ],
  // },
  {
    title: "Salse Manager pages",
    layout: "dashboard",
    role: "Sales Manager",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "payments",
      //   path: "/payments",
      //   element: <Payments />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "productions",
      //   path: "/productions",
      //   element: <Productions />,
      // },
      // {
      //   icon: <HomeModernIcon {...icon} />,
      //   name: "staff",
      //   path: "/users",
      //   element: <Users />,
      // },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "customers",
        path: "/customers",
        element: <Customers />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Department",
      //   path: "/department",
      //   element: <Department />,
      // },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  // {
  //   title: "",
  //   layout: "other",
  //   role: "Sales Manager",
  //   pages: [
  //     {
  //       // name: "user edit",
  //       path: "/users/edit/:id",
  //       element: <UserEdit />,
  //     },
  //     {
  //       // name: "user edit",
  //       path: "/customers/edit/:id",
  //       element: <CustomerEdit />,
  //     },
  //     {
  //       // name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //     {
  //       // name: "order add",
  //       path: "/orders/edit",
  //       element: <OrderEdit />,
  //     },
  //     {
  //       // name: "order add",
  //       path: "/orders/view",
  //       element: <OrderView />,
  //     },
  //   ],
  // },
  {
    title: "Salse Team Member pages",
    layout: "dashboard",
    role: "Sales Team Member",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "payments",
      //   path: "/payments",
      //   element: <Payments />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "productions",
      //   path: "/productions",
      //   element: <Productions />,
      // },
      // {
      //   icon: <HomeModernIcon {...icon} />,
      //   name: "staff",
      //   path: "/users",
      //   element: <Users />,
      // },
      // {
      //   icon: <UserGroupIcon {...icon} />,
      //   name: "customers",
      //   path: "/customers",
      //   element: <Customers />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Department",
      //   path: "/department",
      //   element: <Department />,
      // },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    title: "",
    layout: "other",
    role: "Sales Team Member",
    pages: [
      {
        // name: "user edit",
        path: "/users/edit/:id",
        element: <UserEdit />,
      },
      {
        // name: "user edit",
        path: "/customers/edit/:id",
        element: <CustomerEdit />,
      },
      {
        // name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        // name: "order add",
        path: "/orders/edit",
        element: <OrderEdit />,
      },
      {
        // name: "order add",
        path: "/orders/view",
        element: <OrderView />,
      },
    ],
  },

  {
    title: "Artwork Manager pages",
    layout: "dashboard",
    role: "Artwork Manager",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Department",
      //   path: "/department",
      //   element: <Department />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "payments",
      //   path: "/payments",
      //   element: <Customers />,
      // },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    title: "Artwork Staff pages",
    layout: "dashboard",
    role: "Artwork Staff",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Department",
      //   path: "/department",
      //   element: <Department />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "payments",
      //   path: "/payments",
      //   element: <Customers />,
      // },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    title: "Production Manager pages",
    layout: "dashboard",
    role: "Production Manager",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "payments",
      //   path: "/payments",
      //   element: <Payments />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Department",
        path: "/department",
        element: <Department />,
      },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    title: "Production Staff",
    layout: "dashboard",
    role: "Production Staff",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "payments",
      //   path: "/payments",
      //   element: <Payments />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Department",
      //   path: "/department",
      //   element: <Department />,
      // },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },

  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    title: "customer pages",
    layout: "dashboard",
    role: "normal",
    pages: [
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "home",
      //   path: "/home",
      //   element: <Home />,
      // },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "payments",
        path: "/payments",
        element: <Payments />,
      },
      {
        icon: <ChatBubbleLeftRightIcon  {...icon} />,
        name: "Chatting Room",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
];

export default routes;
