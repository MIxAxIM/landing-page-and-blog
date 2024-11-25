import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { CourseStudioLinkItem, DashboardLinkItem } from "./link-items";
import { type CoursePublic } from "~/types/db";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileSideMenu({
  ownerCourses,
}: {
  ownerCourses: CoursePublic[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: sessionData } = useSession();

  const router = useRouter();

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-foreground"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-secondary px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href="/">
                      <Image
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                        src="/andamio-logo.svg"
                        alt="Andamio"
                      />
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          <DashboardLinkItem
                            current={false}
                            dashboardChildRoute=""
                          />
                          <CourseStudioLinkItem
                            current={false}
                            ownerCourses={ownerCourses}
                          />
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-accent">
                          Your courses
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {ownerCourses?.map((course) => (
                            <li key={course?.courseCode}>
                              <Link
                                href={`/studio/${course?.courseCode}`}
                                className={classNames(
                                  router.query.coursecode == course?.courseCode
                                    ? "bg-accent text-accent-foreground"
                                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                )}
                              >
                                <span
                                  className={classNames(
                                    router.query.coursecode ==
                                      course?.courseCode
                                      ? "border-primary text-accent-foreground"
                                      : "border-accent-foreground text-accent group-hover:border-primary group-hover:text-accent-foreground",
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-secondary text-[0.625rem] font-medium",
                                  )}
                                >
                                  {course?.title.substring(0, 1)}
                                </span>
                                <span className="truncate">
                                  {course?.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-background px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-foreground lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
          Studio
        </div>
        <span className="sr-only">Your profile</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-8 w-8 rounded-full bg-accent"
          src={sessionData?.user?.image ?? ""}
          alt=""
        />
      </div>
    </>
  );
}
