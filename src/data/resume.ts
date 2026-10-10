export type TimelineEntry = {
  period: string;
  title: string;
  organization?: string;
  description?: string;
  image?: string;
  url?: string;
  type: 'education' | 'work' | 'award' | 'certification'| 'organization';
};

export const timeline: TimelineEntry[] = [
  {
    period: '2026.08.15',
    type: 'organization',
    title: 'Notion北陸 設立(代表)',
    organization: 'Notion北陸',
    url: "https://notionhokuriku.vercel.app",
    image: '/resume/notionhokuriku.png',
  },
  {
    period: '2026.06.25',
    type: 'organization',
    title: 'Notionキャンパスリーダー 就任',
    organization: 'Notion Campus Leader Program',
    url: "https://notion.notion.site/Notion-dff76cf4f6b14bbc9570623a5de5ae0e",
    image: '/resume/notion.png',
  },
  {
    period: '2026.05.21',
    type: 'organization',
    title: '北陸学生プロジェクト 所属',
    organization: '北陸学生プロジェクト',
    url: "https://www.instagram.com/hokuriku_students_pj/",
    image: '/resume/hpro.png',
  },
  {
    period: '2026.04.01',
    type: 'education',
    title: '富山大学工学部知能情報工学コース 入学',
    organization: '富山大学',
    url: "https://www.u-toyama.ac.jp",
    image: '/resume/toyama_univ.jpg',
  },
  {
    period: '2026.03.31',
    type: 'education',
    title: '北海道北広島高校 卒業',
    organization: '北海道北広島高校',
    url: "https://www.kitahiro.hokkaido-c.ed.jp",
  },
  {
    period: '2023.04.01',
    type: 'education',
    title: '北海道北広島高校 入学',
    organization: '北海道北広島高校',
    url: "https://www.kitahiro.hokkaido-c.ed.jp",
  }
];

export const skills = {
  Frontend: ['HTML/CSS', 'JavaScript', 'TypeScript', 'Astro', 'React'],
  Backend: ['Node.js', 'Python', 'Google Apps Script'],
  Cloud: ['Vercel', 'GitHub Actions'],
  Tools: ['Git / GitHub', 'Notion'],
};

export const socials = [
  { label: 'GitHub', url: 'https://github.com/hokke414', icon: 'github' },
  { label: 'Zenn', url: 'https://zenn.dev/hokke414', icon: 'zenn' },
  { label: 'note', url: 'https://note.com/hokke414', icon: 'note' },
  { label: 'X', url: 'https://x.com/hokke414', icon: 'x' },
  { label: 'Instagram', url: 'https://instagram.com/hokke414', icon: 'instagram' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ryo-okudera-0920b7381/', icon: 'linkedin' },
  { label: 'Email', url: 'mailto:hokke41499@gmail.com', icon: 'mail' },
] as const;
