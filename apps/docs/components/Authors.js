import { Avatar } from "./Avatar";

const team = {
  khang: {
    name: "Nguyen Vu Khang",
    githubUsername: "nguyenvukhang",
    picture: "/images/people/khang_headshot.jpg",
  },
  weiseng: {
    name: "Tan Wei Seng",
    githubUsername: "weiseng18",
    picture: "/images/people/weiseng_headshot.jpg",
  },
};

export default function Authors({ authors }) {
  return (
    <div
      className="authors grid grid-cols-[repeat(var(--grid-cnt-small),minmax(0,1fr))] gap-4 py-8 border-b border-gray-400 md:grid-cols-[repeat(var(--grid-cnt),minmax(0,1fr))] border-opacity-20"
      style={{
        "--grid-cnt": authors.length,
        "--grid-cnt-small": authors.length > 1 ? 2 : 1,
      }}
    >
      {authors.map((username) =>
        !!team[username] ? (
          <Avatar key={username} {...team[username]} />
        ) : (
          console.warning("no author found for", username) || null
        )
      )}
    </div>
  );
}
