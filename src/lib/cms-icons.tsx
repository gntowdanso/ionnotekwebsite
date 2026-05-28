import type { LucideIcon } from "lucide-react";
import {
  Award,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Database,
  Globe,
  Handshake,
  Hexagon,
  Plug,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  bot: Bot,
  "brain-circuit": BrainCircuit,
  briefcase: BriefcaseBusiness,
  building: Building2,
  database: Database,
  globe: Globe,
  handshake: Handshake,
  plug: Plug,
  "scan-search": ScanSearch,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  users: Users,
  workflow: Workflow,
};

export function getCmsIcon(name: string) {
  return iconMap[name] ?? Hexagon;
}