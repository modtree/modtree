import {
  ShareIcon,
  ArrowsExpandIcon,
  BeakerIcon,
  BellIcon,
  CloudUploadIcon,
  FingerPrintIcon,
} from "@heroicons/react/outline";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "Smart Reminders",
    description: `Modtree will remind you to take pre-requisites so you don&apos;t have to check yourself.`,
    icon: BellIcon,
  },
  {
    name: "Easy Authentication",
    description: `Modtree offers an option of passwordless, OTP-only authentication.`,
    icon: FingerPrintIcon,
  },
  {
    name: "Remote Storage",
    description: `Save your degree and module plans online.`,
    icon: CloudUploadIcon,
  },
  {
    name: "Switch it up",
    description: `Efficiently trial-and-error many possible ways of completing your degree.`,
    icon: BeakerIcon,
  },
  {
    name: "Power of overview",
    description: `Modtree lets you visualize your entire degree all the way through, while giving you the flexibility to make it truly your own.`,
    icon: ArrowsExpandIcon,
  },
  {
    name: "Community templates",
    description: `Pick from one of many existing templates that your friends created to jumpstart your degree planning.`,
    icon: ShareIcon,
  },
];

const members = [
  {
    name: "Nguyen Vu Khang",
    role: "Faculty of Science",
    href: "https://github.com/nguyenvukhang",
    src: "/images/people/khang_headshot.jpg",
  },
  {
    name: "Tan Wei Seng",
    role: "Faculty of Computing",
    href: "https://github.com/weiseng18",
    src: "https://avatars.githubusercontent.com/u/20338724",
  },
];

function Page() {
  return (
    <>
      <Head>
        <title>Modtree</title>
        <meta
          name="og:description"
          content="Modtree is a graph-oriented interactive visualization tool for planning out university degrees."
        />
      </Head>
      <div className="w-auto px-4 pt-16 pb-8 mx-auto sm:pt-24 lg:px-8">
        <h1 className="max-w-5xl text-center mx-auto text-6xl font-extrabold tracking-tighter leading-[1.1] sm:text-7xl lg:text-8xl xl:text-8xl">
          Degree planning that
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 ">
            makes stuff happen.
          </span>
        </h1>
        <p className="max-w-lg mx-auto mt-6 text-xl font-medium leading-tight text-center text-gray-400 sm:max-w-4xl sm:text-2xl md:text-3xl lg:text-4xl">
          Modtree is a graph-oriented interactive visualization tool for
          planning out university degrees.
        </p>
        <div className="max-w-xl mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md ">
            <Link href="/docs/getting-started">
              <a className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white no-underline bg-black border border-transparent rounded-md dark:bg-white dark:text-black betterhover:dark:hover:bg-gray-300 betterhover:hover:bg-gray-700 md:py-3 md:text-lg md:px-10 md:leading-6">
                Get Started →
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative from-gray-50 to-gray-100">
        <div className="px-4 py-16 mx-auto sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl lg:text-center dark:text-white">
            Plan like the best
          </h2>
          <p className="mx-auto mt-4 text-lg font-medium text-gray-400 lg:max-w-3xl lg:text-xl lg:text-center">
            Modtree reimagines degree-planning techniques used by top
            universities to remove information-lookup burden and mental
            overhead.
          </p>
          <div className="grid grid-cols-1 mt-12 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {features.map((feature) => (
              <div
                className="p-10 bg-white shadow-lg rounded-xl dark:bg-opacity-5 "
                key={feature.name}
              >
                <div>
                  <feature.icon
                    className="h-8 w-8 dark:text-white  rounded-full p-1.5 dark:bg-white dark:bg-opacity-10 bg-black bg-opacity-5 text-black"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base font-medium text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="">
        <div className="px-4 py-16 mx-auto sm:pt-20 sm:pb-24 lg:pt-24 lg:px-8">
          <h2 className="max-w-4xl mx-auto pb-6 text-5xl font-extrabold  tracking-tight lg:text-6xl xl:text-7xl leading-[1.25!important] md:text-center dark:text-white">
            Planning your degree shouldn&apos;t be so difficult
          </h2>
          <div className="max-w-2xl mx-auto lg:mt-2 dark:text-gray-400">
            <p className="mb-6 text-lg leading-normal text-current lg:text-xl">
              Degrees are incredibly useful in getting a job, even in a world
              that heavily memes on how useless going to college supposedly is.
              However, knowing what to do in these last few years in school
              academically can be daunting. It&apos;s become completely normal
              to waste entire careers just because people didn&apos;t really
              care for how they chose their path when they were still in
              university.
            </p>
            <p className="mb-6 text-lg leading-normal text-current lg:text-xl">
              We need something else.
            </p>
            <p className="mb-6 text-lg leading-normal text-current lg:text-xl">
              A fresh take on the whole approach. Designed to glue everything
              together. A tool that works for you and not against you. Built
              with the same techniques used by the big guys, but in a way that
              doesn&apos;t require PhD to learn or a staff to maintain.
            </p>
            <p className="mb-6 text-lg leading-normal text-current lg:text-xl">
              <b className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                With modtree, we&apos;re doing just that.
              </b>{" "}
              We&apos;re abstracting the staggering internet queries needed for
              most degree planning into a single cohesive web-app to serve you a
              world class planning experience.
            </p>
          </div>
          {members.map((props, i) => (
            <Person {...props} key={i} />
          ))}
        </div>
      </div>
    </>
  );
}

function Person(props: {
  name: string;
  href: string;
  role: string;
  src: string;
}) {
  return (
    <div className="flex items-center max-w-2xl py-2 mx-auto space-x-4">
      <div className="mt-4">
        <Image
          height={56}
          width={56}
          className="block mr-6 rounded-full"
          src={props.src}
          alt={props.name}
        />
      </div>
      <div className="flex flex-col h-full space-y-3">
        <div className="inline-flex items-center ">
          <a
            href={props.href}
            target="_blank"
            className="font-bold text-gray-400 no-underline"
            rel="noopener noreferrer"
          >
            {props.name}
          </a>
          <div className="ml-2 text-gray-500">{props.role}</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
