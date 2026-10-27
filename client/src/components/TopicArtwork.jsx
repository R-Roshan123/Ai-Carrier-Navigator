import {
  Award,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
} from 'lucide-react';

const illustrations = [
  { match: /assessment|skill-gap/, Icon: BrainCircuit, side: Search, label: 'DISCOVER YOUR STRENGTHS' },
  { match: /course/, Icon: BookOpen, side: Sparkles, label: 'LEARN AND PRACTICE' },
  { match: /job|application|company/, Icon: BriefcaseBusiness, side: Building2, label: 'FIND YOUR NEXT ROLE' },
  { match: /resume|profile/, Icon: FileText, side: UserRound, label: 'SHOWCASE YOUR SKILLS' },
  { match: /certificate|verification/, Icon: Award, side: ShieldCheck, label: 'RECOGNIZE YOUR PROGRESS' },
  { match: /project/, Icon: FolderKanban, side: Sparkles, label: 'BUILD YOUR PORTFOLIO' },
  { match: /chat|mentor/, Icon: MessageSquareText, side: BrainCircuit, label: 'THINK IT THROUGH' },
  { match: /roadmap|career|role/, Icon: Route, side: TrendingUp, label: 'PLAN YOUR NEXT STEP' },
];

export default function TopicArtwork({ path }) {
  const illustration = illustrations.find(({ match }) => match.test(path)) || {
    Icon: LayoutDashboard,
    side: TrendingUp,
    label: 'YOUR CAREER WORKSPACE',
  };
  const Icon = illustration.Icon;
  const SideIcon = illustration.side;

  return (
    <div className="topic-artwork" aria-hidden="true">
      <svg className="topic-artwork-route" viewBox="0 0 300 150" fill="none">
        <path d="M24 112C68 112 64 72 115 72s48-48 91-48 40 26 70 26" />
        <circle cx="24" cy="112" r="4" />
        <circle cx="115" cy="72" r="4" />
        <circle cx="206" cy="24" r="4" />
        <circle cx="276" cy="50" r="4" />
      </svg>
      <div className="topic-artwork-orbit topic-artwork-orbit-one" />
      <div className="topic-artwork-orbit topic-artwork-orbit-two" />
      <div className="topic-artwork-card topic-artwork-card-back"><SideIcon size={19} strokeWidth={1.7} /></div>
      <div className="topic-artwork-card topic-artwork-card-front"><Icon size={30} strokeWidth={1.45} /></div>
      <div className="topic-artwork-stamp"><span />{illustration.label}</div>
    </div>
  );
}
