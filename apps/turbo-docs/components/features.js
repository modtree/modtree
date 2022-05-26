import {
  ShareIcon,
  ArrowsExpandIcon,
  BeakerIcon,
  BellIcon,
  CloudUploadIcon,
  FingerPrintIcon,
} from "@heroicons/react/outline";

export const features = [
  {
    name: "Smart Reminders",
    description: `Modtree will remind you to take pre-requisites so you don't have to check yourself.`,
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

function Features() {
  return (
    <>
      <div className="grid grid-cols-2 gap-6 my-12 sm:grid-cols-3 ">
        {features.map(({ icon: Icon, ...feature }, i) => (
          <div
            className="flex items-center space-x-4"
            key={i}
          >
            <div>
              <Icon
                className="block w-8 h-8"
                style={{ height: 24, width: 24 }}
                aria-hidden="true"
              />
            </div>
            <div>
              <div className="my-0 font-medium dark:text-white">
                {feature.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Features;
