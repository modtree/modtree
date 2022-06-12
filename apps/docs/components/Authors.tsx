import { Avatar } from './Avatar';

const team = {
  khang: {
    name: 'Nguyen Vu Khang',
    githubUsername: 'nguyenvukhang',
    picture: '/images/people/khang_headshot.jpg',
  },
  weiseng: {
    name: 'Tan Wei Seng',
    githubUsername: 'weiseng18',
    picture: '/images/people/weiseng_headshot.jpg',
  },
};

export default function Authors({ authors }) {
  const grid = `grid-cols-${authors.length} md:grid-cols-${authors.length}`;
  return (
    <div
      className={`authors grid gap-4 py-8 border-b border-gray-400 border-opacity-20 ${grid}`}
    >
      {authors.map((username: string) =>
        team[username] ? (
          <Avatar key={username} {...team[username]} />
        ) : (
          console.warn('no author found for', username)
        )
      )}
    </div>
  );
}
