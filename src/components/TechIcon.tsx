import {
  Code2,
  Server,
  Network,
  ShieldCheck,
  Printer,
  Wrench,
  Database,
  Terminal,
  Layout,
  Cloud,
  Cpu,
} from "lucide-react";

export function TechIcon({
  name,
  className = "h-5 w-5",
}: {
  name?: string | null;
  className?: string;
}) {
  switch (name) {
    case "Code2":
      return <Code2 className={className} />;
    case "Server":
      return <Server className={className} />;
    case "Network":
      return <Network className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Printer":
      return <Printer className={className} />;
    case "Wrench":
      return <Wrench className={className} />;
    case "Database":
      return <Database className={className} />;
    case "Terminal":
      return <Terminal className={className} />;
    case "Layout":
      return <Layout className={className} />;
    case "Cloud":
      return <Cloud className={className} />;
    default:
      return <Cpu className={className} />;
  }
}
